<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Candle } from '../lib/candles';
import { formatPrice } from '../lib/format';

const props = defineProps<{
  candles: Candle[];
  interval: string;
  mark?: number;
}>();

const windowCount = ref(0);
const hover = ref<{ index: number; x: number; y: number } | null>(null);

const stepMinutes: Record<string, number> = {
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1H': 60,
  '4H': 240,
  '24H': 1440,
};

const visible = computed(() => {
  const bars = props.candles;
  const size = Math.max(20, Math.min(bars.length, windowCount.value || bars.length));
  const start = bars.length - size;
  return { bars: bars.slice(start), start, size };
});

const frame = computed(() => {
  const bars = visible.value.bars;
  const width = 860;
  const padL = 8;
  const padR = 78;
  const padT = 16;
  const priceH = 236;
  const gap = 14;
  const volH = 52;
  const height = padT + priceH + gap + volH + 24;
  const plotW = width - padL - padR;
  const mark = props.mark ?? bars[bars.length - 1].close;
  const hi = Math.max(...bars.map((bar) => bar.high), mark);
  const lo = Math.min(...bars.map((bar) => bar.low), mark);
  const pad = (hi - lo) * 0.08 || hi * 0.01;
  const top = hi + pad;
  const span = hi - lo + pad * 2 || 1;
  const yOf = (value: number) => padT + ((top - value) / span) * priceH;
  const slot = plotW / bars.length;
  const bodyW = Math.max(3.5, Math.min(9, slot * 0.62));
  const maxVol = Math.max(...bars.map((bar) => bar.volume));
  const volTop = padT + priceH + gap;
  const minutes = stepMinutes[props.interval] ?? 60;
  const end = Date.UTC(2026, 10, 6, 6, 0);
  const total = props.candles.length;

  const sma = bars.map((_, index) => {
    const slice = bars.slice(Math.max(0, index - 11), index + 1);
    return slice.reduce((sum, bar) => sum + bar.close, 0) / slice.length;
  });

  const candles = bars.map((bar, index) => {
    const x = padL + slot * index + slot / 2;
    const up = bar.close >= bar.open;
    const yOpen = yOf(bar.open);
    const yClose = yOf(bar.close);
    const absolute = visible.value.start + index;
    const at = new Date(end - (total - 1 - absolute) * minutes * 60_000);
    return {
      x,
      up,
      yHigh: yOf(bar.high),
      yLow: yOf(bar.low),
      y: Math.min(yOpen, yClose),
      h: Math.max(1.4, Math.abs(yClose - yOpen)),
      vol: (bar.volume / maxVol) * volH,
      volY: volTop + volH - (bar.volume / maxVol) * volH,
      open: bar.open,
      close: bar.close,
      high: bar.high,
      low: bar.low,
      volume: bar.volume,
      time: at.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }),
    };
  });

  const levels = Array.from({ length: 5 }, (_, index) => {
    const value = top - (span * index) / 4;
    return { value, y: yOf(value) };
  });

  const stamps = [0, Math.floor((bars.length - 1) / 2), bars.length - 1].map((index) => ({
    label: candles[index].time,
    x: candles[index].x,
  }));

  const smaPath = sma
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${padL + slot * index + slot / 2} ${yOf(value).toFixed(2)}`)
    .join(' ');

  const last = bars[bars.length - 1];
  return {
    width,
    height,
    padL,
    padR,
    padT,
    priceH,
    top,
    span,
    slot,
    candles,
    bodyW,
    levels,
    stamps,
    smaPath,
    volTop,
    lastY: yOf(mark),
    lastUp: mark >= last.open,
    mark,
    axisX: width - padR + 6,
    plotRight: width - padR,
  };
});

const tip = computed(() => {
  if (!hover.value) return null;
  const bar = frame.value.candles[hover.value.index];
  if (!bar) return null;
  const price = frame.value.top - ((hover.value.y - frame.value.padT) / frame.value.priceH) * frame.value.span;
  return { ...bar, price };
});

function onWheel(event: WheelEvent) {
  const current = windowCount.value || props.candles.length;
  const step = event.deltaY > 0 ? 10 : -10;
  windowCount.value = Math.max(20, Math.min(props.candles.length, current + step));
  hover.value = null;
}

function onMove(event: MouseEvent) {
  const svg = event.currentTarget as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * frame.value.width;
  const y = ((event.clientY - rect.top) / rect.height) * frame.value.height;
  const index = Math.round((x - frame.value.padL) / frame.value.slot - 0.5);
  if (index < 0 || index >= frame.value.candles.length || y < frame.value.padT || y > frame.value.volTop) {
    hover.value = null;
    return;
  }
  hover.value = { index, x: frame.value.candles[index].x, y };
}
</script>

<template>
  <div class="relative h-full min-h-[280px]" @wheel.prevent="onWheel">
    <svg
      :viewBox="`0 0 ${frame.width} ${frame.height}`"
      class="h-full min-h-[280px] w-full"
      role="img"
      aria-label="Price chart"
      @mousemove="onMove"
      @mouseleave="hover = null"
    >
      <line
        v-for="level in frame.levels"
        :key="level.y"
        x1="0"
        :x2="frame.plotRight"
        :y1="level.y"
        :y2="level.y"
        stroke="var(--line)"
      />
      <line x1="0" :x2="frame.plotRight" :y1="frame.volTop" :y2="frame.volTop" stroke="var(--line)" />
      <g v-for="(bar, index) in frame.candles" :key="index">
        <line :x1="bar.x" :x2="bar.x" :y1="bar.yHigh" :y2="bar.yLow" :stroke="bar.up ? 'var(--bid)' : 'var(--ask)'" stroke-width="1.25" />
        <rect :x="bar.x - frame.bodyW / 2" :y="bar.y" :width="frame.bodyW" :height="bar.h" :fill="bar.up ? 'var(--bid)' : 'var(--ask)'" rx="0.6" />
        <rect :x="bar.x - frame.bodyW / 2" :y="bar.volY" :width="frame.bodyW" :height="bar.vol" :fill="bar.up ? 'var(--bid)' : 'var(--ask)'" opacity="0.45" rx="0.6" />
      </g>
      <path :d="frame.smaPath" fill="none" stroke="#e0b84d" stroke-width="1.35" />
      <line x1="0" :x2="frame.plotRight" :y1="frame.lastY" :y2="frame.lastY" :stroke="frame.lastUp ? 'var(--bid)' : 'var(--ask)'" stroke-dasharray="3 3" stroke-width="1" />
      <g v-if="hover && tip">
        <line :x1="hover.x" :x2="hover.x" :y1="frame.padT" :y2="frame.volTop" stroke="#eaecef" stroke-opacity="0.75" stroke-dasharray="3 3" />
        <line :x1="0" :x2="frame.plotRight" :y1="hover.y" :y2="hover.y" stroke="#eaecef" stroke-opacity="0.75" stroke-dasharray="3 3" />
        <rect :x="frame.axisX - 4" :y="hover.y - 9" width="70" height="18" rx="3" fill="var(--ink)" />
        <text :x="frame.axisX" :y="hover.y + 4" fill="var(--bg)" font-size="11" font-weight="700" font-family="Segoe UI, sans-serif">
          {{ formatPrice(tip.price) }}
        </text>
      </g>
      <g v-for="level in frame.levels" :key="`p${level.y}`">
        <text v-if="Math.abs(level.y - frame.lastY) > 16" :x="frame.axisX" :y="level.y + 3" fill="var(--muted)" font-size="11" font-family="Segoe UI, sans-serif">
          {{ formatPrice(level.value) }}
        </text>
      </g>
      <rect :x="frame.axisX - 4" :y="frame.lastY - 9" width="70" height="18" rx="3" :fill="frame.lastUp ? 'var(--bid)' : 'var(--ask)'" />
      <text :x="frame.axisX" :y="frame.lastY + 4" :fill="frame.lastUp ? '#04140e' : '#ffffff'" font-size="11" font-weight="700" font-family="Segoe UI, sans-serif">
        {{ formatPrice(frame.mark) }}
      </text>
      <text v-for="stamp in frame.stamps" :key="stamp.label + stamp.x" :x="stamp.x" :y="frame.height - 6" fill="var(--muted)" font-size="11" text-anchor="middle" font-family="Segoe UI, sans-serif">
        {{ stamp.label }}
      </text>
    </svg>
    <div
      v-if="tip"
      class="pointer-events-none absolute z-10 min-w-40 rounded-lg border border-line bg-elev/95 px-3 py-2 text-[11px] shadow-lg"
      :style="{ left: '12px', top: '12px' }"
    >
      <p class="font-semibold text-ink">{{ tip.time }} UTC</p>
      <dl class="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 num text-muted">
        <div>O <span class="text-ink">{{ formatPrice(tip.open) }}</span></div>
        <div>H <span class="text-bid">{{ formatPrice(tip.high) }}</span></div>
        <div>L <span class="text-ask">{{ formatPrice(tip.low) }}</span></div>
        <div>C <span class="text-ink">{{ formatPrice(tip.close) }}</span></div>
        <div class="col-span-2">Vol <span class="text-ink">{{ tip.volume.toFixed(1) }}</span></div>
      </dl>
    </div>
  </div>
</template>
