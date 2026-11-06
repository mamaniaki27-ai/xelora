import { createRequire } from 'node:module';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tools = process.argv[2];
if (!tools) {
  console.error('Usage: node scripts/unify-coin-colors.mjs <dir-with-node_modules>');
  process.exit(1);
}

const require = createRequire(path.join(tools, 'package.json'));
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const coinDir = path.join(root, 'public', 'coins');
const outDir = path.join(coinDir, 'unified');
const SIZE = 192;

const PLATE = [28, 51, 45];
const MARK_DARK = [70, 196, 150];
const MARK_LIGHT = [237, 255, 248];

function luma(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function rgbDist(r, g, b, plate) {
  const dr = r - plate[0];
  const dg = g - plate[1];
  const db = b - plate[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function smoothstep(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function markColor(l) {
  return mix(MARK_DARK, MARK_LIGHT, Math.min(1, Math.max(0, l)));
}

function classify(r, g, b, plate) {
  const d = rgbDist(r, g, b, plate) / 180;
  const dl = Math.abs(luma(r, g, b) - luma(plate[0], plate[1], plate[2]));
  return smoothstep(0.14, 0.38, Math.max(d, dl));
}

function paintPlate(out, size) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rad = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      const a = Math.min(1, Math.max(0, rad - dist + 0.85));
      const i = (y * size + x) * 4;
      out[i] = PLATE[0];
      out[i + 1] = PLATE[1];
      out[i + 2] = PLATE[2];
      out[i + 3] = Math.round(a * 255);
    }
  }
}

function sample(data, size, x, y) {
  if (x < 0 || y < 0 || x > size - 1 || y > size - 1) return [0, 0, 0, 0];
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, size - 1);
  const y1 = Math.min(y0 + 1, size - 1);
  const tx = x - x0;
  const ty = y - y0;
  const at = (px, py) => {
    const i = (py * size + px) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  const a = at(x0, y0);
  const b = at(x1, y0);
  const c = at(x0, y1);
  const d = at(x1, y1);
  const row = (p, q, t) => p.map((v, k) => v + (q[k] - v) * t);
  return row(row(a, b, tx), row(c, d, tx), ty);
}

function stamp(src, out, size) {
  paintPlate(out, size);
  let minX = size;
  let minY = size;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (src[(y * size + x) * 4 + 3] > 24) {
        count++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!count) return;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const scale = Math.min((size * 0.6) / bw, (size * 0.6) / bh);
  const ox = (size - bw * scale) / 2;
  const oy = (size - bh * scale) / 2;
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rad = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > rad) continue;
      const sx = (x - ox) / scale + minX;
      const sy = (y - oy) / scale + minY;
      const [r, g, b, a] = sample(src, size, sx, sy);
      if (a < 8) continue;
      const col = markColor(luma(r, g, b));
      const edge = Math.min(1, Math.max(0, rad - dist + 0.85));
      const alpha = (a / 255) * edge;
      const i = (y * size + x) * 4;
      out[i] = Math.round(col[0] * alpha + out[i] * (1 - alpha));
      out[i + 1] = Math.round(col[1] * alpha + out[i + 1] * (1 - alpha));
      out[i + 2] = Math.round(col[2] * alpha + out[i + 2] * (1 - alpha));
      out[i + 3] = Math.round(edge * 255);
    }
  }
}

function recolorDisc(src, out, size, plate) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rad = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      const i = (y * size + x) * 4;
      const edge = Math.min(1, Math.max(0, rad - dist + 0.85));
      if (edge <= 0) {
        out[i + 3] = 0;
        continue;
      }
      const a = src[i + 3];
      let col = PLATE;
      if (a > 12) {
        const t = classify(src[i], src[i + 1], src[i + 2], plate);
        const mark = markColor(luma(src[i], src[i + 1], src[i + 2]));
        col = mix(PLATE, mark, t);
      }
      out[i] = Math.round(col[0]);
      out[i + 1] = Math.round(col[1]);
      out[i + 2] = Math.round(col[2]);
      out[i + 3] = Math.round(edge * 255);
    }
  }
}

function analyze(src, size) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rad = size / 2;
  const samples = [];
  let ring = 0;
  let ringOpaque = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const norm = Math.hypot(x - cx, y - cy) / rad;
      if (norm < 0.84 || norm > 0.98) continue;
      ring++;
      const i = (y * size + x) * 4;
      if (src[i + 3] > 40) {
        ringOpaque++;
        samples.push([src[i], src[i + 1], src[i + 2]]);
      }
    }
  }
  const plate = [0, 0, 0];
  if (samples.length) {
    for (let c = 0; c < 3; c++) {
      const channel = samples.map((s) => s[c]).sort((a, b) => a - b);
      plate[c] = channel[channel.length >> 1];
    }
  }
  let opaque = 0;
  let marks = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.hypot(x - cx, y - cy) > rad) continue;
      const i = (y * size + x) * 4;
      if (src[i + 3] < 16) continue;
      opaque++;
      if (classify(src[i], src[i + 1], src[i + 2], plate) > 0.55) marks++;
    }
  }
  return {
    ringFrac: ring ? ringOpaque / ring : 0,
    markFrac: opaque ? marks / opaque : 0,
    plate,
  };
}

function unify(src, size) {
  const out = Buffer.alloc(size * size * 4);
  const info = analyze(src, size);
  const useDisc = info.ringFrac >= 0.58 && info.markFrac >= 0.045 && info.markFrac <= 0.7;
  if (useDisc) recolorDisc(src, out, size, info.plate);
  else stamp(src, out, size);
  return out;
}

function drawDefault(size) {
  const out = Buffer.alloc(size * size * 4);
  paintPlate(out, size);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rad = size / 2;
  const r = size * 0.28;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - cx) / r;
      const dy = (y - cy) / r;
      const star = Math.abs(dx) + Math.abs(dy) < 0.92 || Math.max(Math.abs(dx), Math.abs(dy)) < 0.34;
      if (!star) continue;
      const dist = Math.hypot(x - cx, y - cy);
      const edge = Math.min(1, Math.max(0, rad - dist + 0.85));
      const i = (y * size + x) * 4;
      out[i] = MARK_LIGHT[0];
      out[i + 1] = MARK_LIGHT[1];
      out[i + 2] = MARK_LIGHT[2];
      out[i + 3] = Math.round(edge * 255);
    }
  }
  return out;
}

async function raster(file) {
  const ext = path.extname(file).toLowerCase();
  let input = file;
  if (ext === '.svg') {
    const svg = await readFile(file);
    const renderer = new Resvg(svg, {
      fitTo: { mode: 'width', value: SIZE },
      background: 'rgba(0,0,0,0)',
      font: { loadSystemFonts: false },
    });
    input = renderer.render().asPng();
  }
  const { data, info } = await sharp(input)
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.width !== SIZE || info.height !== SIZE || info.channels !== 4) {
    throw new Error(`Unexpected raster ${info.width}x${info.height}x${info.channels} for ${file}`);
  }
  return data;
}

async function writePng(buffer, file) {
  await sharp(buffer, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png({ compressionLevel: 9 }).toFile(file);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const entries = (await readdir(coinDir)).filter((name) => /\.(svg|png)$/i.test(name));
  const seen = new Set();
  let failed = 0;
  for (const name of entries) {
    const base = path.basename(name, path.extname(name)).toLowerCase();
    if (seen.has(base)) {
      console.warn(`skip duplicate basename ${name}`);
      continue;
    }
    seen.add(base);
    const dest = path.join(outDir, `${base}.png`);
    try {
      const src = await raster(path.join(coinDir, name));
      await writePng(unify(src, SIZE), dest);
      console.log(`ok ${name}`);
    } catch (error) {
      failed++;
      console.error(`fail ${name}: ${error instanceof Error ? error.message : error}`);
      await writePng(drawDefault(SIZE), dest);
    }
  }
  await writePng(drawDefault(SIZE), path.join(outDir, 'default.png'));

  const mapPath = path.join(root, 'src', 'data', 'coin-files.ts');
  const map = await readFile(mapPath, 'utf8');
  const next = map.replaceAll(/"([^"]+\.(?:png|svg))"/gi, (_, file) => {
    const base = path.basename(file, path.extname(file)).toLowerCase();
    return `"unified/${base}.png"`;
  });
  if (next === map) throw new Error('coin-files.ts did not change');
  await writeFile(mapPath, next);

  const picks = [
    'btc.png',
    'eth.png',
    'sol.png',
    'doge.png',
    'sui.svg',
    'hype.svg',
    'pepe.svg',
    '0g.svg',
    'apex.svg',
    'bera.svg',
    'zk.svg',
    'w.svg',
    'fartcoin.svg',
    'pump.svg',
    'bnb.png',
    'ada.png',
  ];
  const cell = 72;
  const cols = 8;
  const rows = Math.ceil(picks.length / cols);
  const sheet = sharp({
    create: { width: cols * cell, height: rows * cell * 2, channels: 4, background: { r: 11, g: 14, b: 17, alpha: 1 } },
  });
  const composites = [];
  for (let index = 0; index < picks.length; index++) {
    const name = picks[index];
    const x = (index % cols) * cell;
    const y = Math.floor(index / cols) * cell * 2;
    const original = path.join(coinDir, name);
    const unified = path.join(outDir, `${path.basename(name, path.extname(name)).toLowerCase()}.png`);
    try {
      composites.push({ input: await sharp(original).resize(cell, cell, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), left: x, top: y });
      composites.push({ input: await sharp(unified).resize(cell, cell).png().toBuffer(), left: x, top: y + cell });
    } catch (error) {
      console.warn(`sheet skip ${name}: ${error instanceof Error ? error.message : error}`);
    }
  }
  await sheet.composite(composites).png().toFile(path.join(root, 'scripts', 'coin-sheet.png'));
  console.log(`done ${seen.size} icons, ${failed} failed`);
}

await main();
