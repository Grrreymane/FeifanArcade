(() => {
  const GAMES = window.GAMES || [];
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const src = (g, f) => `../assets/${g.slug}/${f}`;
  const fmt = n => Math.round(n).toLocaleString('zh-CN');
  const read = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };

  // Easter egg: the games live on the same origin, so we can peek at the visitor's own saves.
  // Each reader returns a short line, or null if this browser has never played the game.
  const MOUSE_REALMS = [[50, '大乘期'], [40, '化神期'], [30, '元婴期'], [20, '金丹期'], [10, '筑基期'], [1, '炼气期']];
  const SAVES = {
    fishy() {
      const dex = read('sea-monster-dex');
      const best = +read('sea-monster-best') || 0;
      const n = dex ? Object.keys(dex.fish || {}).length + Object.keys(dex.boss || {}).length : 0;
      if (!n && !best) return null;
      return n >= 45 ? `图鉴全收集！单局最高 ${fmt(best)} 金币` : `图鉴 ${n}/45 · 单局最高 ${fmt(best)} 金币`;
    },
    rebirthday() {
      const m = read('rl-meta');
      if (!m || !m.lives) return read('rl-run') ? '第一世还没过完…' : null;
      return `已重开 ${m.lives} 次人生 · 最长活到 ${m.best || 0} 岁`;
    },
    mouse() {
      const s = read('mouse_cultivation_save_v4') || read('mouse_cultivation_save_v3');
      if (!s || !s.level) return null;
      const realm = MOUSE_REALMS.find(([lv]) => s.level >= lv)[1];
      return `鼠鼠已修到${realm} Lv.${s.level}` + (s.killCount ? ` · 斩妖 ${fmt(s.killCount)} 只` : '');
    },
    drained() {
      const e = read('token-four-nights-v4.endings');
      const n = e && Array.isArray(e.endings) ? e.endings.length : 0;
      if (n) return n >= 6 ? '六个结局全部解锁！' : `已解锁结局 ${n}/6`;
      return Object.keys(localStorage).some(k => k.startsWith('token-four-nights-v4.')) ? '四个夜晚还没过完…' : null;
    },
    paw() {
      const w = read('all-under-paw-w');
      if (!w || typeof w.t !== 'number') return null;
      const y = 262 - Math.floor(w.t / 4);
      const rank = ['商贾', '舍人', '客卿', '相邦', '仲父', '秦王', '皇帝'][w.rank || 0] || '商贾';
      return `狸家已到${y > 0 ? '前 ' + y : '公元 ' + (1 - y)} 年 · 官至${rank}`;
    },
    // Lightspeed Escape lives on another domain (1gp-studio.github.io), so its save can't be read from here.
  };
  const NEW = { fishy: '还没下过竿 · 投个币试试？', rebirthday: '还没投过胎 · 投个币试试？', mouse: '鼠鼠还在等你 · 投个币试试？', drained: '零还饿着肚子 · 投个币试试？', paw: '狸家还没开张 · 投个币试试？' };

  let played = 0;
  const cabinet = g => {
    const th = g.theme || {};
    const reader = SAVES[saveKey(g)];
    const line = reader ? reader() : null;
    if (line) played++;
    const frames = g.cabinet || [];
    const imgs = frames.map((f, i) => `<img src="${src(g, f)}" alt="" loading="lazy"${i ? '' : ' class="on"'}>`).join('');
    return `
    <article class="cab" style="--c1:${th.c1};--c2:${th.c2};--c3:${th.c3}">
      <div class="cab-marquee"><span class="t${g.title.zh.length > 6 ? ' long' : ''}">${esc(g.title.zh)}</span><span class="e">${esc(g.title.en.toUpperCase())}</span></div>
      <div class="cab-body">
        <div class="cab-screen" tabindex="0" role="button" data-play="${g.slug}" aria-label="开玩 ${esc(g.title.zh)}">
          ${imgs}
          <div class="play-overlay">点击<br>开始游戏</div>
        </div>
      </div>
      <div class="cab-panel" aria-hidden="true"><span class="stick"></span><span class="b"></span><span class="b"></span></div>
      <div class="cab-front">
        <p class="cab-tag">${esc(g.tagline.zh)}</p>
        <p class="howto"><b>怎么玩</b>${esc(g.howto ? g.howto.zh : '')}</p>
        ${g.tip && !reader
          ? `<div class="led has tip"><span>小贴士</span>${esc(g.tip.zh)}</div>`
          : `<div class="led${line ? ' has' : ''}"><span>${line ? '你的存档' : 'NEW'}</span>${esc(line || NEW[saveKey(g)] || '')}</div>`}
        <button class="btn" type="button" data-play="${g.slug}"><span class="coin-ico"></span>投币开玩</button>
      </div>
    </article>`;
  };
  function saveKey(g) { return { 'fishy-tails': 'fishy', rebirthday: 'rebirthday', 'mouse-cultivation': 'mouse', 'drained-by-me': 'drained', 'all-under-paw': 'paw' }[g.slug]; }

  function render() {
    played = 0;
    $('#cabinets').innerHTML = GAMES.map(cabinet).join('');
    const withSaves = GAMES.filter(g => SAVES[saveKey(g)]).length;
    const greet = played === 0
      ? '欢迎光临～这是我下班后捣鼓的几个像素小游戏。点屏幕就能玩，手机电脑都行，玩得开心！'
      : played === withSaves
        ? '都玩过了？太给面子了！下面是你在每台机子上的存档～'
        : `欢迎回来！你已经玩过 ${played}/${withSaves} 台，剩下的也去试试？下面能看到你的存档～`;
    $('#greet').textContent = greet;
    $('#coins').textContent = `CREDIT ${played}`;
    document.querySelectorAll('.bulbs').forEach(b => { b.innerHTML = '<i></i>'.repeat(14); });
    slideshows();
  }

  let timers = [];
  function slideshows() {
    timers.forEach(clearInterval); timers = [];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.cab-screen').forEach((scr, n) => {
      const imgs = [...scr.querySelectorAll('img')];
      if (imgs.length < 2) return;
      let i = 0;
      setTimeout(() => timers.push(setInterval(() => {
        imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on');
      }, 2600)), n * 700);
    });
  }

  // ---------- play ----------
  const player = $('#player'), frame = $('#player-frame');
  function play(slug) {
    const g = GAMES.find(x => x.slug === slug);
    if (!g) return;
    // On phones (often inside WeChat) just go to the game; back returns here with the save updated.
    if (matchMedia('(max-width: 700px), (pointer: coarse)').matches) { location.href = g.play_url; return; }
    $('#player-title').textContent = g.title.zh;
    $('#player-ext').href = g.play_url;
    frame.src = g.play_url;
    player.classList.toggle('wide', g.frame === 'wide');
    player.hidden = false;
    document.body.classList.add('locked');
  }
  function close() {
    player.hidden = true;
    document.body.classList.remove('locked');
    frame.src = 'about:blank';
    render(); // saves may have changed while playing
  }

  document.addEventListener('click', e => {
    const p = e.target.closest('[data-play]');
    if (p) { e.preventDefault(); play(p.dataset.play); return; }
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !player.hidden) close();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.cab-screen')) { e.preventDefault(); play(e.target.dataset.play); }
  });
  // Coming back from a game on mobile (bfcache) — refresh the save lines.
  window.addEventListener('pageshow', e => { if (e.persisted) render(); });

  render();
})();
