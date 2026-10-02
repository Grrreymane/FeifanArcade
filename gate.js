// Password gate for the portfolio edition. Decrypts locked.js (see tools/lock.mjs) and runs it.
(async () => {
  const L = window.LOCKED;
  const gate = document.getElementById('gate');
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-pw');
  const err = document.getElementById('gate-err');
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const toB64 = u => btoa(String.fromCharCode(...u));
  const REMEMBER = 'fa-key-' + L.salt; // a new password gets a new salt, so old remembered keys stop working

  async function derive(pw) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: b64(L.salt), iterations: L.iter, hash: 'SHA-256' }, base, 256));
  }
  async function open(raw) {
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(L.iv) }, key, b64(L.ct));
    return new TextDecoder().decode(pt);
  }
  function run(code) {
    gate.remove();
    document.body.classList.remove('gated');
    const s = document.createElement('script');
    s.textContent = code;
    document.body.appendChild(s);
  }

  try {
    const saved = localStorage.getItem(REMEMBER);
    if (saved) { run(await open(b64(saved))); return; }
  } catch {}

  gate.hidden = false;
  input.focus();
  input.addEventListener('input', () => { err.textContent = ''; });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!input.value) { err.textContent = '先输入密码 · Enter the password first'; return; }
    form.classList.add('busy');
    try {
      const raw = await derive(input.value);
      const code = await open(raw);
      try { localStorage.setItem(REMEMBER, toB64(raw)); } catch {}
      run(code);
    } catch {
      form.classList.remove('busy');
      err.textContent = '密码不对，再试一次 · Wrong password, try again';
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      input.select();
    }
  });
})();
