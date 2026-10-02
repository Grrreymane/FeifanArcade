(() => {
  const GAMES = window.GAMES || [];
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app');

  // Per-cabinet colours (c1 accent, c2 shadow accent, c3 cabinet body) live in each game's data.json.
  const THEME = Object.fromEntries(GAMES.map(g => [g.slug, g.theme || {}]));

  const STR = {
    brand: { zh: '非凡街机厅', en: 'Feifan Arcade' },
    'nav.games': { zh: '游戏', en: 'Games' },
    foot: { zh: '所有游戏均可在浏览器中直接游玩', en: 'Every game here runs right in your browser' },
    'player.newtab': { zh: '新窗口打开 ↗', en: 'Open in new tab ↗' },
    'player.hint': { zh: '竖屏游戏 · 用鼠标点击操作 · Esc 关闭', en: 'Portrait game · click to play · Esc to close' },
    'hero.sub': { zh: 'FEIFAN ARCADE', en: '' },
    'hero.intro': {
      zh: '这里有三台街机：每一款都是能直接玩的完整像素小游戏。投个币试试，或者点「看作品」看截图、美术细节和开发笔记。',
      en: 'Three cabinets, three small but complete pixel games you can play right now. Insert a coin, or open Details for screenshots, art sheets and dev notes.',
    },
    'hero.insert': { zh: 'INSERT COIN ▸', en: 'INSERT COIN ▸' },
    'cab.play': { zh: '投币开玩', en: 'Play' },
    'cab.more': { zh: '看作品', en: 'Details' },
    'cab.hover': { zh: '点击<br>开始游戏', en: 'Click<br>to play' },
    'g.back': { zh: '← 回到街机厅', en: '← Back to the arcade' },
    'g.play': { zh: '投币开玩', en: 'Play now' },
    'g.live': { zh: '独立页面 ↗', en: 'Standalone page ↗' },
    'g.shots': { zh: '游戏截图', en: 'Screenshots' },
    'g.shots.sub': { zh: '不想玩？往右滑，把整个游戏看一遍', en: 'No time to play? Scroll through the whole game here' },
    'g.art': { zh: '美术细节', en: 'Art up close' },
    'g.art.sub': { zh: '所有像素图按原始像素放大，未做平滑处理', en: 'All sprites shown at integer scale, no smoothing' },
    'g.palette': { zh: '主色板', en: 'Core palette' },
    'g.notes': { zh: '开发笔记', en: 'Dev notes' },
    'g.role': { zh: '我的角色', en: 'My role' },
    'g.features': { zh: '玩法一览', en: 'At a glance' },
    'g.timeline': { zh: '开发时间线', en: 'Timeline' },
    'g.next': { zh: '下一台', en: 'Next cabinet' },
  };

  let lang = 'zh';
  try { lang = localStorage.getItem('fa-lang') || ((navigator.language || '').startsWith('zh') ? 'zh' : 'en'); } catch {}
  const t = k => (STR[k] ? STR[k][lang] : k);
  const L = o => (o && typeof o === 'object' ? (o[lang] ?? o.zh ?? '') : (o ?? ''));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const src = (g, f) => `assets/${g.slug}/${f}`;

  function applyStatic() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.title = lang === 'zh' ? '非凡街机厅 · Feifan Arcade' : 'Feifan Arcade';
  }

  // ---------- home ----------
  function cabinet(g) {
    const th = THEME[g.slug] || {};
    // Cabinet screens are 9:16, so each game lists portrait frames in `cabinet`.
    const frames = g.cabinet || (g.shots || []).slice(0, 6).map(s => s.file);
    const imgs = frames.length ? frames.map((f, i) => `<img src="${src(g, f)}" alt="" loading="lazy"${i ? '' : ' class="on"'}>`).join('')
      : `<img class="on" src="${src(g, g.cover)}" alt="">`;
    return `
    <article class="cab" style="--c1:${th.c1};--c2:${th.c2};--c3:${th.c3}">
      <div class="cab-marquee"><span class="t">${esc(L(g.title))}</span><span class="e">${esc(g.title.en.toUpperCase())}</span></div>
      <div class="cab-body">
        <div class="cab-screen" tabindex="0" role="button" data-play="${g.slug}" aria-label="${esc(t('cab.play'))}: ${esc(L(g.title))}">
          ${imgs}
          <div class="play-overlay">${t('cab.hover')}</div>
        </div>
      </div>
      <div class="cab-panel" aria-hidden="true"><span class="stick"></span><span class="b"></span><span class="b"></span></div>
      <div class="cab-front">
        <p class="cab-tag">${esc(L(g.tagline))}</p>
        <div class="cab-actions">
          <button class="btn" type="button" data-play="${g.slug}"><span class="coin-ico"></span>${t('cab.play')}</button>
          <a class="btn ghost" href="#/${g.slug}">${t('cab.more')}</a>
        </div>
        <div class="cab-slot" aria-hidden="true"><i></i><i></i></div>
      </div>
    </article>`;
  }

  function renderHome() {
    const bulbs = '<i></i>'.repeat(14);
    app.innerHTML = `
    <section class="hero">
      <div class="wrap">
        <div class="marquee-sign">
          <div class="bulbs">${bulbs}</div>
          <h1 class="h-display">${t('brand')}</h1>
          <div class="sub">FEIFAN ARCADE</div>
          <div class="bulbs">${bulbs}</div>
        </div>
        <p class="hero-intro">${t('hero.intro')}</p>
        <div class="insert">${t('hero.insert')}</div>
      </div>
    </section>
    <section class="floor"><div class="wrap"><div class="cabinets">${GAMES.map(cabinet).join('')}</div></div></section>
`;
    startSlideshows();
  }

  let timers = [];
  function startSlideshows() {
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

  // ---------- game detail ----------
  let gallery = [];
  function renderGame(g) {
    timers.forEach(clearInterval); timers = [];
    const th = THEME[g.slug] || {};
    const idx = GAMES.indexOf(g);
    const others = [GAMES[(idx + 1) % GAMES.length], GAMES[(idx + 2) % GAMES.length]].filter(o => o && o !== g);
    gallery = [
      ...(g.shots || []).map(s => ({ src: src(g, s.file), cap: L(s.caption) })),
      ...(g.art || []).map(s => ({ src: src(g, s.file), cap: L(s.caption) })),
    ];
    const nShots = (g.shots || []).length;
    const stats = (g.stats || []).map(s => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(L(s.label))}</span></div>`).join('');
    const dims = x => (x.w ? ` width="${x.w}" height="${x.h}"` : '');
    const shots = (g.shots || []).map((s, i) => `
      <figure class="shot" data-lb="${i}" style="--ar:${s.w ? s.w / s.h : 0.5625}"><div class="frame"><img src="${src(g, s.file)}"${dims(s)} alt="${esc(L(s.caption))}" loading="lazy"></div><figcaption>${esc(L(s.caption))}</figcaption></figure>`).join('');
    // Wide sheets take a full row; a half-width sheet left without a partner does too.
    const artList = g.art || [];
    const isWide = a => a.w / a.h > 1.9;
    const full = [];
    for (let i = 0, col = 0; i < artList.length; i++) {
      if (isWide(artList[i])) { full[i] = true; col = 0; continue; }
      const next = artList[i + 1];
      full[i] = col === 0 && (!next || isWide(next));
      col = full[i] ? 0 : 1 - col;
    }
    const art = artList.map((a, i) => `
      <figure class="art-item${full[i] ? ' wide' : ''}" data-lb="${nShots + i}"><div class="frame"><img src="${src(g, a.file)}"${dims(a)} alt="${esc(L(a.caption))}" loading="lazy"></div><figcaption>${esc(L(a.caption))}</figcaption></figure>`).join('');
    const palette = (g.palette || []).map(c => `<span style="background:${c}" title="${c}"></span>`).join('');
    const notes = (g.dev_notes || []).map(n => `<article class="note"><h3>${esc(L(n.title))}</h3><p>${esc(L(n.body))}</p></article>`).join('');
    const feats = (g.features || []).map(f => `<li>${esc(L(f))}</li>`).join('');
    const tl = (g.timeline || []).map(x => `<li><time>${esc(x.date)}</time>${esc(L(x))}</li>`).join('');
    const next = others.map(o => `<a href="#/${o.slug}"><img src="${src(o, o.cover)}" alt=""><span><small>${t('g.next')}</small><strong>${esc(L(o.title))}</strong></span></a>`).join('');

    app.innerHTML = `
    <div style="--g1:${th.c1};--g2:${th.c2}">
    <section class="g-hero"><div class="wrap">
      <a class="back" href="#/">${t('g.back')}</a>
      <div class="g-hero-grid">
        <div class="g-cover"><img src="${src(g, g.cover)}" alt="${esc(L(g.title))}"></div>
        <div>
          <h1 class="h-display g-title">${esc(L(g.title))}</h1>
          <p class="g-alt">${esc(g.title.en.toUpperCase())}</p>
          <p class="g-tagline">${esc(L(g.tagline))}</p>
          <p class="g-genre">${esc(L(g.genre))}</p>
          <p class="g-summary">${esc(L(g.summary))}</p>
          <div class="g-cta">
            <button class="btn" type="button" data-play="${g.slug}"><span class="coin-ico"></span>${t('g.play')}</button>
            <a class="btn ghost" href="${esc(g.play_url)}" target="_blank" rel="noopener">${t('g.live')}</a>
          </div>
        </div>
      </div>
      ${stats ? `<div class="stats">${stats}</div>` : ''}
    </div></section>

    ${shots ? `<section class="sec"><div class="wrap">
      <div class="sec-head"><h2 class="h-display">${t('g.shots')}</h2><p>${t('g.shots.sub')}</p></div>
      <div class="shots">${shots}</div>
    </div></section>` : ''}

    ${art || palette ? `<section class="sec"><div class="wrap">
      <div class="sec-head"><h2 class="h-display">${t('g.art')}</h2><p>${t('g.art.sub')}</p></div>
      <div class="art-grid">${art}</div>
      ${palette ? `<p class="eyebrow" style="margin-top:34px">${t('g.palette')}</p><div class="palette">${palette}</div>` : ''}
    </div></section>` : ''}

    <section class="sec"><div class="wrap two-col">
      <div>
        <div class="sec-head"><h2 class="h-display">${t('g.notes')}</h2></div>
        <div class="notes">${notes}</div>
      </div>
      <aside>
        ${g.role ? `<div class="side-card"><h3>${t('g.role')}</h3><p>${esc(L(g.role))}</p></div>` : ''}
        ${feats ? `<div class="side-card"><h3>${t('g.features')}</h3><ul class="features">${feats}</ul></div>` : ''}
        ${tl ? `<div class="side-card"><h3>${t('g.timeline')}</h3><ol class="timeline">${tl}</ol></div>` : ''}
      </aside>
    </div></section>

    <section class="next"><div class="wrap next-grid">${next}</div></section>
    </div>`;
  }

  // ---------- router ----------
  function route() {
    const path = location.hash.replace(/^#\/?/, '');
    const g = GAMES.find(x => x.slug === path);
    document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + path || (a.getAttribute('href') === '#/' && !path)));
    if (g) renderGame(g);
    else renderHome();
    window.scrollTo(0, 0);
    if (g) document.title = `${L(g.title)} · ${t('brand')}`;
    else applyStatic();
  }

  // ---------- player ----------
  const player = $('#player'), frame = $('#player-frame');
  let lastFocus = null;
  function openModal(m) { lastFocus = document.activeElement; m.hidden = false; document.body.classList.add('locked'); m.querySelector('[data-close].player-x, .player-x')?.focus(); }
  function closeModal(m) { m.hidden = true; document.body.classList.remove('locked'); if (m === player) frame.src = 'about:blank'; lastFocus?.focus?.(); }
  function play(slug) {
    const g = GAMES.find(x => x.slug === slug);
    if (!g) return;
    // Phones get the real thing full-screen instead of a phone inside a phone.
    if (matchMedia('(max-width: 700px), (pointer: coarse)').matches) { window.open(g.play_url, '_blank', 'noopener'); return; }
    $('#player-title').textContent = L(g.title);
    $('#player-ext').href = g.play_url;
    frame.src = g.play_url;
    openModal(player);
  }

  // ---------- lightbox ----------
  const lb = $('#lightbox');
  let lbi = 0;
  function showLb(i) {
    if (!gallery.length) return;
    lbi = (i + gallery.length) % gallery.length;
    $('#lb-img').src = gallery[lbi].src;
    $('#lb-img').alt = gallery[lbi].cap;
    $('#lb-cap').textContent = gallery[lbi].cap;
  }

  document.addEventListener('click', e => {
    const p = e.target.closest('[data-play]');
    if (p) { e.preventDefault(); play(p.dataset.play); return; }
    const f = e.target.closest('[data-lb]');
    if (f) { showLb(+f.dataset.lb); openModal(lb); return; }
    if (e.target.closest('[data-close]')) { closeModal(e.target.closest('.modal')); return; }
    if (e.target.closest('.lb-prev')) showLb(lbi - 1);
    if (e.target.closest('.lb-next')) showLb(lbi + 1);
    if (e.target.closest('#lang')) {
      lang = lang === 'zh' ? 'en' : 'zh';
      try { localStorage.setItem('fa-lang', lang); } catch {}
      const y = scrollY; applyStatic(); route(); scrollTo(0, y);
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!player.hidden) closeModal(player); if (!lb.hidden) closeModal(lb); }
    if (!lb.hidden && e.key === 'ArrowLeft') showLb(lbi - 1);
    if (!lb.hidden && e.key === 'ArrowRight') showLb(lbi + 1);
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.cab-screen')) { e.preventDefault(); play(e.target.dataset.play); }
  });

  window.addEventListener('hashchange', route);
  applyStatic();
  route();
})();
