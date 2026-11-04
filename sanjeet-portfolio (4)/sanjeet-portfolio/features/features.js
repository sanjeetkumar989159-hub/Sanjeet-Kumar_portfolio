/*
  Added features (loaded after script.js). Plain JavaScript, no build step, works from file:// too.
  This file never edits the text, layout or styling of existing content. It only adds new elements,
  plus invisible accessibility attributes on a few existing ones.
*/
(function () {
  'use strict';

  var CFG = window.PORTFOLIO_CONFIG || {};
  var DATA = window.PORTFOLIO_DATA || {};
  var F = window.PORTFOLIO_FACTS || { faq: [], skills: [], columns: [], notListed: [], links: {} };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(tag, a, kids) {
    var n = document.createElement(tag);
    a = a || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v == null || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c != null && c !== false) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function safeHttp(u) {
    if (!u || typeof u !== 'string') return '';
    try { var x = new URL(u, location.href); return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : ''; } catch (e) { return ''; }
  }
  function store(k, v) {
    try { if (v === undefined) return window.localStorage.getItem(k); window.localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function onVisible(el, fn, margin) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
    }, { rootMargin: margin || '300px 0px' });
    io.observe(el);
  }
  function makeSection(id, title, soft) {
    var body = h('div');
    var label = h('h2', { class: 'label fx-label in', id: id + 'Title', text: title });
    var sec = h('section', { class: 'sec fx-sec' + (soft ? ' soft' : ''), id: id, 'aria-labelledby': id + 'Title', 'data-ghost': title }, [
      h('div', { class: 'wrap' }, [h('div', { class: 'sec-grid' }, [label, body])])
    ]);
    return { sec: sec, body: body };
  }

  /* ---------------------------------------------------------------- analytics */
  function privacyOptOut() {
    return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  }
  var provider = '';
  function track(name, props) {
    try {
      if (provider === 'plausible' && window.plausible) window.plausible(name, props ? { props: props } : undefined);
      else if (provider === 'umami' && window.umami && window.umami.track) window.umami.track(name, props);
      else if (provider === 'ga4' && window.gtag) window.gtag('event', name, props || {});
    } catch (e) { /* analytics must never break the page */ }
  }
  function loadAnalytics() {
    var a = CFG.analytics || {};
    if (!a.provider || !a.id || privacyOptOut()) return;
    var s = document.createElement('script');
    s.async = true;
    if (a.provider === 'plausible') {
      s.defer = true; s.setAttribute('data-domain', a.id); s.src = safeHttp(a.src) || 'https://plausible.io/js/script.js';
      window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    } else if (a.provider === 'umami') {
      s.defer = true; s.setAttribute('data-website-id', a.id); s.src = safeHttp(a.src) || 'https://cloud.umami.is/script.js';
    } else if (a.provider === 'ga4' && /^G-[A-Z0-9]+$/i.test(a.id)) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', a.id, { anonymize_ip: true });
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(a.id);
    } else { return; }
    provider = a.provider;
    document.head.appendChild(s);
  }
  (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(loadAnalytics);
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-fx-track]') : null;
    if (t) track(t.getAttribute('data-fx-track'));
  });

  /* ---------------------------------------------------------------- accessibility (invisible) */
  $$('a[target="_blank"]').forEach(function (a) {
    if (a.hasAttribute('aria-label') || a.querySelector('.sr')) return;
    a.appendChild(h('span', { class: 'sr', text: ' (opens in a new tab)' }));
  });
  (function focusReturn() {
    var lb = document.getElementById('lb'), pal = document.getElementById('pal');
    var last = null;
    document.addEventListener('click', function (e) { var z = e.target.closest ? e.target.closest('[data-zoom], #kbtn, .fx-dash-img') : null; if (z) last = z; }, true);
    function watch(node, trapSel) {
      if (!node || !window.MutationObserver) return;
      new MutationObserver(function () {
        if (node.hidden && last && document.contains(last)) { try { last.focus({ preventScroll: true }); } catch (e) {} }
      }).observe(node, { attributes: true, attributeFilter: ['hidden'] });
      node.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || node.hidden) return;
        var f = $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', node).filter(function (x) { return x.offsetParent !== null || x === document.activeElement; });
        if (!f.length) return;
        var first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      });
    }
    watch(lb); watch(pal);
  })();
  $$('img:not([decoding])').forEach(function (i) { i.decoding = 'async'; });

  /* ---------------------------------------------------------------- recruiter section */
  (function recruiter() {
    var av = $('#fxAvail');
    var a = CFG.availability || {};
    if (av && a.status) av.textContent = a.status + (a.note ? ' · ' + a.note : '');
    var cal = safeHttp(a.calendarUrl || '');
    var acts = $('#fxRecruitActions');
    if (acts && cal) acts.appendChild(h('a', { class: 'btn ghost', href: cal, target: '_blank', rel: 'noopener', 'data-fx-track': 'book_call', text: 'Book a call ↗' }));
    var tm = $('#fxTime');
    function tick() {
      if (!tm) return;
      try { tm.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST'; } catch (e) {}
    }
    tick(); setInterval(tick, 30000);
  })();

  /* ---------------------------------------------------------------- QR code (library loads on demand) */
  (function qr() {
    var fig = $('#fxQr'), box = $('#fxQrBox');
    if (!fig || !box) return;
    var url = safeHttp(CFG.siteUrl || '');
    if (!url && /^https?:$/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname)) url = location.origin + location.pathname.replace(/index\.html$/, '');
    if (!url) return; /* a QR code that points at a file on this computer would be useless */
    var q = null;
    $('#fxQrUrl').textContent = url.replace(/^https?:\/\//, '');
    function draw() {
      try {
        q = window.qrcode(0, 'M'); q.addData(url); q.make();
        box.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
        var svg = $('svg', box); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'QR code that opens ' + url);
        fig.hidden = false; var sn = $('.fx-snap'); if (sn) sn.classList.add('has-qr');
      } catch (e) { fig.hidden = true; }
    }
    onVisible(fig.parentNode || fig, function () {
      var s = document.createElement('script'); s.src = 'features/vendor/qrcode.min.js'; s.onload = draw; document.head.appendChild(s);
    }, '400px 0px');
    function download(name, blob) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
    var bSvg = $('#fxQrSvg'), bPng = $('#fxQrPng');
    if (bSvg) bSvg.addEventListener('click', function () {
      if (!q) return;
      download('sanjeet-kumar-portfolio-qr.svg', new Blob([q.createSvgTag({ cellSize: 10, margin: 4 })], { type: 'image/svg+xml' }));
      track('qr_download');
    });
    if (bPng) bPng.addEventListener('click', function () {
      if (!q) return;
      var n = q.getModuleCount(), cell = 12, m = 4, size = (n + m * 2) * cell, c = document.createElement('canvas');
      c.width = c.height = size; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, size, size); x.fillStyle = '#111';
      for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + m) * cell, (r + m) * cell, cell, cell);
      c.toBlob(function (b) { if (b) download('sanjeet-kumar-portfolio-qr.png', b); track('qr_download'); }, 'image/png');
    });
  })();

  /* ---------------------------------------------------------------- skills explorer */
  (function skills() {
    var anchor = $('#skills');
    if (!anchor || !F.skills.length) return;
    var made = makeSection('skills-map', 'Skills in practice', false), body = made.body;
    body.appendChild(h('p', { class: 'lead', text: 'Select a skill to see where it shows up in my internship, projects, problem solving and certificates. Only documented evidence is listed; there are no self-rated percentages.' }));
    var groups = []; F.skills.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
    var bar = h('div', { class: 'fx-bar', role: 'group', 'aria-label': 'Filter skills by group' });
    var chipBtns = [];
    function chip(label, value) {
      var b = h('button', { class: 'fx-chip', type: 'button', 'aria-pressed': value === '' ? 'true' : 'false', text: label });
      b.addEventListener('click', function () {
        chipBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        items.forEach(function (it) { it.li.classList.toggle('fx-hide', !!value && it.skill.group !== value); });
      });
      chipBtns.push(b); bar.appendChild(b);
    }
    chip('All', ''); groups.forEach(function (g) { chip(g, g); });
    body.appendChild(bar);
    var legend = h('p', { class: 'fx-legend' }, [h('span', {}, [h('i', { class: 'fx-dot on' }), 'Evidence found']), h('span', {}, [h('i', { class: 'fx-dot' }), 'Not documented'])]);
    legend.appendChild(h('span', { text: 'Dots in order: ' + F.columns.map(function (c) { return c.label; }).join(' · ') }));
    body.appendChild(legend);
    var ul = h('ul', { class: 'fx-skills' }), items = [];
    F.skills.forEach(function (s, i) {
      var pid = 'fxSk' + i, ev = s.evidence || {}, marks = h('span', { class: 'fx-marks' });
      var have = [];
      F.columns.forEach(function (c) {
        var on = !!ev[c.id]; if (on) have.push(c.label);
        marks.appendChild(h('i', { class: 'fx-dot' + (on ? ' on' : ''), title: c.label + (on ? ': evidence found' : ': not documented'), 'aria-hidden': 'true' }));
      });
      var btn = h('button', { class: 'fx-skill', type: 'button', 'aria-expanded': 'false', 'aria-controls': pid }, [
        h('span', { class: 'fx-skill-name' }, [s.name, h('small', { text: s.group })]),
        marks,
        h('span', { class: 'sr', text: have.length ? 'Evidence in: ' + have.join(', ') : 'No specific evidence documented' })
      ]);
      var panel = h('div', { class: 'fx-panel', id: pid, hidden: true });
      if (have.length) {
        var evl = h('ul', { class: 'fx-ev' });
        F.columns.forEach(function (c) {
          if (!ev[c.id]) return;
          evl.appendChild(h('li', {}, [h('b', { text: c.label }), ev[c.id] + ' ', h('a', { href: c.href, text: 'See section →' })]));
        });
        panel.appendChild(evl);
      } else {
        panel.appendChild(h('p', { class: 'fx-none', text: 'Listed on my CV. There is no specific project, internship task or certificate on this page that demonstrates it yet, so I am not claiming one.' }));
      }
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true'); panel.hidden = open;
      });
      var li = h('li', {}, [btn, panel]); ul.appendChild(li); items.push({ li: li, skill: s });
    });
    body.appendChild(ul);
    anchor.parentNode.insertBefore(made.sec, anchor.nextSibling);
  })();

  /* ---------------------------------------------------------------- project filters + search */
  (function projectTools() {
    var sec = $('#projects'); if (!sec) return;
    var arts = $$('article.item', sec); if (arts.length < 2) return;
    var col = arts[0].parentNode;
    var CATS = { 'India Weather Analysis 2026': ['Data analysis', 'Python', 'API'], 'LifeFlow Blood Bank': ['Web app'] };
    var all = [];
    var meta = arts.map(function (a) {
      var t = (($('h3', a) || {}).textContent || '').trim();
      var chips = $$('.chip', a).map(function (c) { return c.textContent.trim(); });
      var cats = CATS[t] || chips.slice(0, 2);
      cats.forEach(function (c) { if (all.indexOf(c) < 0) all.push(c); });
      return { el: a, cats: cats, text: (a.textContent || '').toLowerCase().replace(/\s+/g, ' ') };
    });
    var state = { cat: '', q: '' };
    var bar = h('div', { class: 'fx-bar', role: 'group', 'aria-label': 'Filter projects by category' });
    var btns = [];
    function mk(label, v) {
      var b = h('button', { class: 'fx-chip', type: 'button', 'aria-pressed': v === '' ? 'true' : 'false', text: label });
      b.addEventListener('click', function () { state.cat = v; btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); apply(); });
      btns.push(b); bar.appendChild(b);
    }
    mk('All', ''); all.forEach(function (c) { mk(c, c); });
    var input = h('input', { type: 'search', id: 'fxProjSearch', placeholder: 'e.g. Pandas, OTP, inventory', autocomplete: 'off', spellcheck: 'false' });
    var count = h('p', { class: 'fx-count', role: 'status', 'aria-live': 'polite' });
    var empty = h('p', { class: 'fx-empty fx-hide', text: 'No project matches that filter. Try another category or clear the search.' });
    var tools = h('div', { class: 'fx-tools' }, [
      h('div', { class: 'fx-search' }, [h('label', { for: 'fxProjSearch', text: 'Search projects' }), input]),
      bar, count
    ]);
    col.insertBefore(empty, arts[0]); col.insertBefore(tools, empty);
    function apply() {
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean), shown = 0, first = true;
      meta.forEach(function (m) {
        var ok = (!state.cat || m.cats.indexOf(state.cat) > -1) && terms.every(function (t) { return m.text.indexOf(t) > -1; });
        m.el.classList.toggle('fx-hide', !ok);
        m.el.classList.toggle('fx-first', ok && first);
        if (ok) { shown++; first = false; }
      });
      empty.classList.toggle('fx-hide', shown > 0);
      count.textContent = shown + ' of ' + meta.length + ' projects shown';
    }
    input.addEventListener('input', function () { state.q = input.value; apply(); });
    apply();
  })();

  /* ---------------------------------------------------------------- GitHub live statistics */
  (function github() {
    var box = $('#fxGh'); if (!box) return;
    var user = ((CFG.github || {}).username || '').trim();
    if (!/^[A-Za-z0-9-]{1,39}$/.test(user)) return;
    var stats = $('#fxGhStats'), langs = $('#fxGhLangs'), repos = $('#fxGhRepos'), state = $('#fxGhState'), link = $('#fxGhLink');
    if (link) link.href = 'https://github.com/' + user;
    box.hidden = false;
    var KEY = 'fx_gh_v1_' + user.toLowerCase(), TTL = 30 * 60 * 1000;
    function fmt(d) { try { return new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
    function render(d, cached) {
      var own = d.repos.filter(function (r) { return !r.fork; });
      var stars = own.reduce(function (n, r) { return n + (r.stargazers_count || 0); }, 0);
      var vals = [d.user.public_repos, d.user.followers, stars, d.user.following];
      $$('li b', stats).forEach(function (b, i) {
        var to = +vals[i] || 0, t0 = null;
        if (reduce || to === 0) { b.textContent = to; return; }
        (function step(t) { if (t0 === null) t0 = t; var p = Math.min((t - t0) / 800, 1); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
      var count = {}; own.forEach(function (r) { if (r.language) count[r.language] = (count[r.language] || 0) + 1; });
      langs.innerHTML = '';
      Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 6).forEach(function (l) { langs.appendChild(h('li', { class: 'chip', text: l + ' · ' + count[l] + (count[l] === 1 ? ' repo' : ' repos') })); });
      langs.hidden = !langs.children.length;
      repos.innerHTML = '';
      own.slice().sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); }).slice(0, 4).forEach(function (r) {
        repos.appendChild(h('li', {}, [
          h('span', { class: 'when', text: 'Updated ' + fmt(r.pushed_at) }),
          h('span', { class: 'what' }, [h('a', { href: safeHttp(r.html_url), target: '_blank', rel: 'noopener', text: r.name }), r.description ? h('small', { text: r.description }) : null]),
          h('span', { class: 'when', text: (r.language ? r.language + ' · ' : '') + '★ ' + (r.stargazers_count || 0) })
        ]));
      });
      repos.hidden = !repos.children.length;
      state.textContent = 'Public data from the GitHub API' + (cached ? ' (cached, refreshes every 30 minutes)' : '') + '.';
      box.setAttribute('data-state', 'ready');
    }
    function fail() {
      $$('li b', stats).forEach(function (b) { b.textContent = '—'; });
      state.textContent = 'Live statistics are unavailable right now (the GitHub API may be rate-limited or offline). The profile link below still works.';
      box.setAttribute('data-state', 'error');
    }
    function getJSON(u) { return fetch(u, { headers: { Accept: 'application/vnd.github+json' } }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
    function load() {
      var c = null; try { c = JSON.parse(store(KEY) || 'null'); } catch (e) {}
      if (c && Date.now() - c.t < TTL) { render(c.d, true); return; }
      if (!window.fetch) { c ? render(c.d, true) : fail(); return; }
      Promise.all([getJSON('https://api.github.com/users/' + user), getJSON('https://api.github.com/users/' + user + '/repos?per_page=100&sort=pushed&type=owner')])
        .then(function (res) { var d = { user: res[0], repos: res[1] }; store(KEY, JSON.stringify({ t: Date.now(), d: d })); render(d, false); })
        .catch(function () { c ? render(c.d, true) : fail(); });
    }
    onVisible(box, load);
  })();

  /* ---------------------------------------------------------------- dashboards gallery (only with real data) */
  (function dashboards() {
    var list = (DATA.dashboards || []).filter(function (d) { return d && d.title && d.description && d.image && d.imageAlt; });
    var anchor = $('#dsa'); if (!list.length || !anchor) return;
    var made = makeSection('dashboards', 'Dashboards', false), body = made.body;
    body.appendChild(h('p', { class: 'lead', text: 'Power BI dashboards. Select a screenshot to enlarge it.' }));
    var tags = []; list.forEach(function (d) { (d.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });
    var grid = h('div', { class: 'fx-gallery' }), cards = [];
    if (tags.length > 1) {
      var bar = h('div', { class: 'fx-bar', role: 'group', 'aria-label': 'Filter dashboards' }), bs = [];
      ['All'].concat(tags).forEach(function (t, i) {
        var b = h('button', { class: 'fx-chip', type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false', text: t });
        b.addEventListener('click', function () { bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); cards.forEach(function (c) { c.el.classList.toggle('fx-hide', i > 0 && (c.d.tags || []).indexOf(t) < 0); }); });
        bs.push(b); bar.appendChild(b);
      });
      body.appendChild(bar);
    }
    list.forEach(function (d) {
      var src = safeHttp(d.image);
      var img = h('img', { src: src, alt: d.imageAlt, loading: 'lazy', decoding: 'async' });
      var imgBtn = h('button', { class: 'fx-dash-img', type: 'button', 'aria-label': 'Enlarge screenshot: ' + d.title }, [img]);
      imgBtn.addEventListener('click', function () {
        var lb = $('#lb'), li = $('#lbImg'), cap = $('#lbCap'); if (!lb) return;
        li.src = img.src; li.alt = d.imageAlt; cap.textContent = d.title; lb.hidden = false; $('#lbX').focus();
      });
      var info = h('div', {}, [h('h3', { text: d.title }), h('p', { text: d.description })]);
      var tl = (d.tools || []).concat(d.tags || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
      if (tl.length) info.appendChild(h('ul', { class: 'chips' }, tl.map(function (t) { return h('li', { class: 'chip soft', text: t }); })));
      var acts = h('div', { class: 'fx-actions' });
      var embed = typeof d.embedUrl === 'string' && d.embedUrl.indexOf('https://app.powerbi.com/') === 0 ? d.embedUrl : '';
      if (embed) {
        var ob = h('button', { class: 'btn small', type: 'button', text: 'Open interactive' });
        ob.addEventListener('click', function () { openEmbed(d.title, embed, ob); }); acts.appendChild(ob);
      }
      var su = safeHttp(d.sourceUrl || ''); if (su) acts.appendChild(h('a', { class: 'btn ghost small', href: su, target: '_blank', rel: 'noopener', text: 'Source ↗' }));
      if (acts.children.length) info.appendChild(acts);
      var card = h('article', { class: 'fx-dash' }, [imgBtn, info]); grid.appendChild(card); cards.push({ el: card, d: d });
    });
    body.appendChild(grid);
    anchor.parentNode.insertBefore(made.sec, anchor);
    var overlay = null;
    function openEmbed(title, url, opener) {
      if (!overlay) {
        var x = h('button', { class: 'lb-x', type: 'button', text: 'Close ✕' });
        overlay = h('div', { class: 'fx-embed', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Interactive dashboard' }, [h('iframe', { title: 'Interactive Power BI dashboard', allowfullscreen: true, sandbox: 'allow-scripts allow-same-origin allow-popups' }), x]);
        function close() { overlay.hidden = true; $('iframe', overlay).removeAttribute('src'); if (overlay._o) overlay._o.focus(); }
        x.addEventListener('click', close);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
        document.body.appendChild(overlay);
      }
      overlay._o = opener; $('iframe', overlay).title = 'Interactive dashboard: ' + title; $('iframe', overlay).src = url; overlay.hidden = false; $('.lb-x', overlay).focus();
    }
  })();

  /* ---------------------------------------------------------------- testimonials (only with real data) */
  (function testimonials() {
    var list = (DATA.testimonials || []).filter(function (t) { return t && t.quote && t.name; });
    var anchor = $('#contact'); if (!list.length || !anchor) return;
    var made = makeSection('testimonials', 'Testimonials', false), ul = h('ul', { class: 'fx-quotes' });
    list.forEach(function (t) {
      var who = [t.role, t.org].filter(Boolean).join(', '), lk = safeHttp(t.link || '');
      var cap = h('figcaption', {}, [h('b', { text: t.name }), who ? who : null]);
      if (lk) { cap.appendChild(document.createElement('br')); cap.appendChild(h('a', { href: lk, target: '_blank', rel: 'noopener', text: 'Verify ↗' })); }
      ul.appendChild(h('li', {}, [h('figure', { class: 'fx-quote' }, [h('blockquote', { text: t.quote }), cap])]));
    });
    made.body.appendChild(ul);
    anchor.parentNode.insertBefore(made.sec, anchor);
  })();

  /* ---------------------------------------------------------------- contact form */
  (function form() {
    var f = $('#fxForm'); if (!f) return;
    f.noValidate = true;
    var fld = { name: $('#fxName'), email: $('#fxEmail'), subject: $('#fxSubject'), message: $('#fxMessage') };
    var status = $('#fxStatus'), send = $('#fxSend'), counter = $('#fxCount');
    function err(k) { return $('#fx' + k.charAt(0).toUpperCase() + k.slice(1) + 'Err'); }
    var rules = {
      name: function (v) { return v.length < 2 ? 'Please enter your name (at least 2 characters).' : v.length > 80 ? 'Name is too long (80 characters max).' : ''; },
      email: function (v) { return !v ? 'Please enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'That email address does not look right.' : ''; },
      subject: function (v) { return v.length > 120 ? 'Subject is too long (120 characters max).' : ''; },
      message: function (v) { return v.length < 10 ? 'Please write at least 10 characters.' : v.length > 2000 ? 'Message is too long (2000 characters max).' : ''; }
    };
    function check(k, show) {
      var m = rules[k](fld[k].value.trim());
      if (show) { err(k).textContent = m; if (m) fld[k].setAttribute('aria-invalid', 'true'); else fld[k].removeAttribute('aria-invalid'); }
      return m;
    }
    Object.keys(fld).forEach(function (k) {
      fld[k].addEventListener('blur', function () { check(k, true); });
      fld[k].addEventListener('input', function () { if (fld[k].getAttribute('aria-invalid')) check(k, true); });
    });
    fld.message.addEventListener('input', function () { counter.textContent = fld.message.value.length + ' / 2000'; });
    function say(kind, nodes) {
      status.hidden = false; status.setAttribute('data-s', kind); status.innerHTML = '';
      (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { status.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
    }
    var to = (CFG.contact || {}).email || 'sumitkumar989159@gmail.com';
    function mailtoLink(v) {
      var subj = v.subject || ('Portfolio message from ' + v.name);
      return 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(v.message + '\n\n— ' + v.name + ' (' + v.email + ')');
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = true;
      var bad = Object.keys(fld).filter(function (k) { return check(k, true); });
      if (bad.length) { fld[bad[0]].focus(); say('err', 'Please fix the ' + (bad.length === 1 ? 'field' : bad.length + ' fields') + ' marked above.'); return; }
      if ($('#fxHp').value) { say('ok', 'Thanks! Your message was sent.'); f.reset(); return; } /* honeypot: bots only */
      var last = +store('fx_form_last') || 0;
      if (Date.now() - last < 20000) { say('err', 'Please wait a few seconds before sending another message.'); return; }
      var v = {}; Object.keys(fld).forEach(function (k) { v[k] = fld[k].value.trim(); });
      var ep = safeHttp((CFG.contact || {}).formEndpoint || '');
      if (!ep) {
        store('fx_form_last', String(Date.now()));
        say('ok', ['Your email app should open with the message filled in. If it does not, write to ', h('a', { href: 'mailto:' + to, text: to }), ' directly.']);
        track('contact_submit', { method: 'mailto' });
        window.location.href = mailtoLink(v);
        return;
      }
      send.disabled = true; send.textContent = 'Sending…';
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
      fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: v.name, email: v.email, subject: v.subject, message: v.message, _replyto: v.email }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error(r.status); store('fx_form_last', String(Date.now())); say('ok', 'Thanks, ' + v.name.split(' ')[0] + '! Your message was sent. I will reply to ' + v.email + '.'); track('contact_submit', { method: 'endpoint' }); f.reset(); counter.textContent = '0 / 2000'; })
        .catch(function () { say('err', ['The message could not be sent. ', h('a', { href: mailtoLink(v), text: 'Send it from your email app instead →' })]); })
        .then(function () { clearTimeout(timer); send.disabled = false; send.textContent = 'Send message'; });
    });
  })();

  /* ---------------------------------------------------------------- back to top (with scroll progress ring) */
  (function backToTop() {
    var NS = 'http://www.w3.org/2000/svg';
    var ring = document.createElementNS(NS, 'svg'); ring.setAttribute('class', 'fx-ring'); ring.setAttribute('viewBox', '0 0 52 52'); ring.setAttribute('aria-hidden', 'true');
    ['bg', 'fg'].forEach(function (c) { var k = document.createElementNS(NS, 'circle'); k.setAttribute('class', c); k.setAttribute('cx', '26'); k.setAttribute('cy', '26'); k.setAttribute('r', '23'); ring.appendChild(k); });
    var arrow = document.createElementNS(NS, 'svg'); arrow.setAttribute('viewBox', '0 0 24 24'); arrow.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M12 20V5M5 12l7-7 7 7'); arrow.appendChild(p);
    var b = h('button', { class: 'fx-top', type: 'button', 'aria-label': 'Back to top' }); b.appendChild(ring); b.appendChild(arrow);
    document.body.appendChild(b);
    var fg = $('.fg', ring), ticking = false;
    function upd() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight, pr = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      fg.style.strokeDashoffset = (144.5 * (1 - pr)).toFixed(1);
      b.classList.toggle('show', window.scrollY > window.innerHeight * 1.2);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd); upd();
    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var top = document.getElementById('top'); if (top) { top.setAttribute('tabindex', '-1'); top.focus({ preventScroll: true }); }
    });
  })();

  /* ---------------------------------------------------------------- portfolio assistant (local FAQ, optional endpoint) */
  (function assistant() {
    if (!F.faq.length) return;
    var CTX = { CFG: CFG, DATA: DATA };
    var WEAK = { sanjeet: 1, hi: 1, hey: 1, hello: 1, know: 1, work: 1, time: 1, where: 1, live: 1, code: 1, made: 1, tech: 1, source: 1, report: 1, reports: 1, course: 1, bi: 1, git: 1, join: 1, looking: 1, connect: 1, message: 1, talk: 1, call: 1, based: 1, study: 1 };
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function has(q, key) { return new RegExp('(^|[^a-z0-9+#])' + esc(key) + '($|[^a-z0-9+#])').test(q); }
    function norm(s) { return ' ' + s.toLowerCase().replace(/[?!,;:"]/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
    function listed() { return F.skills.map(function (s) { return s.name; }).join(', '); }
    function skillReply(s) {
      var ev = s.evidence || {}, parts = [];
      F.columns.forEach(function (c) { if (ev[c.id]) parts.push(ev[c.id]); });
      var links = F.columns.filter(function (c) { return ev[c.id]; }).map(function (c) { return { label: c.label, href: c.href }; });
      if (!parts.length) return { text: s.name + ' is listed in the skills on Sanjeet\'s CV. This portfolio doesn\'t document a specific project, internship task or certificate for it, so I can\'t say more than that.', links: [{ label: 'Skills explorer', href: '#skills-map' }] };
      return { text: s.name + ': ' + parts.join(' '), links: links };
    }
    function answer(raw) {
      var q = norm(raw), best = null, bestScore = 0;
      F.faq.forEach(function (e) {
        var sc = 0; e.keys.forEach(function (k) { if (has(q, k)) sc += WEAK[k] ? 1 : (k.indexOf(' ') > -1 ? 3 : 2); });
        if (sc > bestScore) { bestScore = sc; best = e; }
      });
      var skill = null;
      F.skills.forEach(function (s) { s.aliases.forEach(function (a) { if (!skill && has(q, a)) skill = s; }); });
      if (skill && bestScore <= 4) return skillReply(skill);
      var unk = null;
      F.notListed.forEach(function (n) { if (!unk && has(q, n)) unk = n; });
      if (unk && bestScore < 3) return { text: '"' + unk + '" isn\'t listed on Sanjeet\'s CV or anywhere on this portfolio, so I can\'t say he has it. What is listed: ' + listed() + '. If it matters for a role, please ask him directly.', links: [{ label: 'Contact', href: '#contact' }] };
      if (best && bestScore >= 2) {
        var t = typeof best.answer === 'function' ? best.answer(CTX) : best.answer;
        return { text: t, links: best.links || [] };
      }
      return { text: 'I don\'t have that on this portfolio, and I won\'t guess. I can talk about skills, projects, experience, education, certificates, the resume or how to get in touch.', links: [{ label: 'Contact', href: '#contact' }, { label: 'Resume (PDF)', href: F.links.resume, ext: true }] };
    }

    var btn = h('button', { class: 'fx-ai-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'fxAi' }, [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Ask about Sanjeet' })]);
    var log = h('div', { class: 'fx-ai-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversation' });
    var input = h('input', { type: 'text', id: 'fxAiIn', placeholder: 'Ask about skills, projects, resume…', maxlength: '200', autocomplete: 'off', 'aria-label': 'Your question' });
    var x = h('button', { class: 'fx-ai-x', type: 'button', text: 'Close' });
    var sug = h('div', { class: 'fx-ai-sug' });
    ['Skills', 'Projects', 'Experience', 'Certificates', 'Resume', 'Contact'].forEach(function (s) {
      var b = h('button', { type: 'button', text: s }); b.addEventListener('click', function () { ask(s === 'Skills' ? 'What are his skills?' : s === 'Contact' ? 'How can I contact him?' : s === 'Resume' ? 'Where is the resume?' : 'Tell me about ' + s.toLowerCase()); }); sug.appendChild(b);
    });
    var panel = h('div', { class: 'fx-ai', id: 'fxAi', role: 'dialog', 'aria-label': 'Portfolio assistant', hidden: true }, [
      h('div', { class: 'fx-ai-head' }, [h('div', {}, [h('b', { text: 'Portfolio assistant' }), h('small', { text: 'Answers only from this site' })]), x]),
      log, sug,
      h('form', { class: 'fx-ai-form' }, [input, h('button', { type: 'submit', text: 'Ask' })])
    ]);
    document.body.appendChild(btn); document.body.appendChild(panel);
    var greeted = false;
    function bubble(text, me, links) {
      var m = h('div', { class: 'fx-msg' + (me ? ' me' : '') }, [h('span', { text: text })]);
      if (links && links.length) {
        var box = h('div', { class: 'fx-msg-links' });
        links.forEach(function (l) {
          var a = h('a', { href: l.href, text: l.label + (l.ext ? ' ↗' : '') });
          if (l.ext) { a.target = '_blank'; a.rel = 'noopener'; }
          if (l.download) a.setAttribute('download', '');
          if (l.href.charAt(0) === '#') a.addEventListener('click', close);
          box.appendChild(a);
        });
        m.appendChild(box);
      }
      log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
    }
    function reply(r) { bubble(r.text, false, r.links); }
    function ask(text) {
      text = (text || '').trim(); if (!text) return;
      bubble(text, true); input.value = '';
      var ep = safeHttp((CFG.assistant || {}).endpoint || '');
      track('assistant_question');
      if (!ep || !window.fetch) { reply(answer(text)); return; }
      var wait = bubble('Thinking…', false);
      var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
      fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text.slice(0, 200) }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { if (!j || typeof j.answer !== 'string' || !j.answer) throw new Error('empty'); wait.remove(); bubble(j.answer, false); })
        .catch(function () { wait.remove(); reply(answer(text)); })
        .then(function () { clearTimeout(t); });
    }
    function open() {
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
      if (!greeted) { greeted = true; bubble('Hi! I answer questions using only the information on this portfolio, and I\'ll say so when something isn\'t here. Try one of the suggestions below.', false); }
      input.focus(); track('assistant_open');
    }
    function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () { if (panel.hidden) open(); else { close(); btn.focus(); } });
    x.addEventListener('click', function () { close(); btn.focus(); });
    $('form', panel).addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); btn.focus(); return; }
      if (e.key !== 'Tab') return;
      var f = $$('button, input', panel).filter(function (n) { return !n.disabled; }), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();
})();
