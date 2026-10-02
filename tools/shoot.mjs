// Headless Chrome screenshot runner (no dependencies).
// Usage: node --experimental-websocket tools/shoot.mjs <recipe.mjs>
// A recipe default-exports { url, width, height, dpr, mobile (default true: touch + mobile viewport), steps: [...] }.
// Steps: { wait: ms } | { eval: "js" } | { click: [x, y] } | { tap: [x, y] }
//        | { key: "Space" } | { shot: "out/path.png", clip?: {x,y,width,height} }
//        | { hold: [x, y], ms }
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const recipe = (await import(pathToFileURL(resolve(process.argv[2])).href)).default;
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(resolve(tmpdir(), 'shoot-'));
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars',
  '--allow-file-access-from-files', 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    target = list.find(t => t.type === 'page');
  } catch {}
}
if (!target) { chrome.kill(); throw new Error('chrome did not start'); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++seq; pending.set(id, m => m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result));
  ws.send(JSON.stringify({ id, method, params }));
});

const { width = 390, height = 844, dpr = 2, mobile = true } = recipe;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile });
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
if (recipe.before) await send('Page.addScriptToEvaluateOnNewDocument', { source: recipe.before });
await send('Page.navigate', { url: recipe.url });
await sleep(recipe.loadWait ?? 1500);

const mouse = async (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
const touch = async (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
for (const s of recipe.steps) {
  if (s.wait) await sleep(s.wait);
  else if (s.eval) {
    const r = await send('Runtime.evaluate', { expression: s.eval, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) console.error('eval error:', r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    else if (r.result?.value !== undefined) console.log('eval →', JSON.stringify(r.result.value).slice(0, 400));
  } else if (s.click) { await mouse('mouseMoved', ...s.click); await mouse('mousePressed', ...s.click); await sleep(60); await mouse('mouseReleased', ...s.click); }
  else if (s.tap) { await touch('touchStart', ...s.tap); await sleep(60); await touch('touchEnd', ...s.tap); }
  else if (s.hold) { await mouse('mousePressed', ...s.hold); await sleep(s.ms ?? 800); await mouse('mouseReleased', ...s.hold); }
  else if (s.key) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: s.key, code: s.key });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: s.key, code: s.key });
  } else if (s.shot) {
    const params = { format: 'png', captureBeyondViewport: false };
    if (s.clip) params.clip = { ...s.clip, scale: 1 };
    const { data } = await send('Page.captureScreenshot', params);
    const out = resolve(s.shot); mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, Buffer.from(data, 'base64')); console.log('saved', out);
  }
}
ws.close(); chrome.kill();
process.exit(0);
