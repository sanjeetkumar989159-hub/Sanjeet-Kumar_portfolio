(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* Set these when a walking video / full-body image is available.
     The video plays unmirrored; its own audio is used if it has any. */
  var MEDIA = { video: "", image: "", audio: "" };

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pre = document.getElementById('pre');
  var bar = document.getElementById('preBar');
  var pct = document.getElementById('prePct');
  var walker = document.getElementById('walker');
  var stage = document.getElementById('stage');
  var tilt = document.getElementById('tilt');
  var hero = document.getElementById('top');
  var soundBtn = document.getElementById('sound');

  /* Preloader letters */
  var nameBox = document.getElementById('preName');
  'SANJEET KUMAR'.split('').forEach(function (c, i) {
    var s = document.createElement('span');
    s.style.setProperty('--i', i);
    s.textContent = c === ' ' ? ' ' : c;
    nameBox.appendChild(s);
  });

  /* Hero name: split into letters for the staggered rise */
  var h1 = document.querySelector('.name');
  h1.setAttribute('aria-label', 'Sanjeet Kumar');
  var k = 0;
  h1.querySelectorAll('.ln').forEach(function (ln) {
    var t = ln.textContent; ln.textContent = ''; ln.setAttribute('aria-hidden', 'true');
    t.split('').forEach(function (ch) {
      var c = document.createElement('span'); c.className = 'c'; c.style.setProperty('--k', k++); c.textContent = ch; ln.appendChild(c);
    });
  });

  /* Honest progress: each real milestone moves the line */
  var prog = 0;
  function setProg(v) { prog = Math.max(prog, v); bar.style.transform = 'scaleX(' + prog + ')'; pct.textContent = Math.round(prog * 100) + '%'; }
  setProg(0.15);
  var minTime = new Promise(function (r) { setTimeout(r, reduce ? 0 : 2300); });
  var fontsDone = (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setProg(0.6); });
  var img = document.getElementById('portrait');
  var imgDone = new Promise(function (r) {
    if (img.complete) r(); else { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }
  }).then(function () { setProg(0.85); });
  var loadDone = new Promise(function (r) {
    if (document.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true });
  }).then(function () { setProg(1); });
  var cap = new Promise(function (r) { setTimeout(r, 4500); });

  /* Optional video replaces the portrait in the same slot */
  function setupMedia() {
    if (!MEDIA.video) return;
    var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-label', 'Sanjeet Kumar walking in');
    v.src = MEDIA.video;
    v.addEventListener('error', function () { walker.replaceChildren(tilt); });
    tilt.replaceChildren(v);
  }

  function arrive() { stage.classList.add('arrived'); walker.classList.add('arrived'); document.body.classList.add('arrived'); }
  function startWalk() {
    var vid = walker.querySelector('video');
    if (vid) vid.play().catch(function () {});
    if (reduce || !walker.animate) { walker.style.visibility = 'visible'; arrive(); return; }
    var sr = stage.getBoundingClientRect();
    var wr = walker.getBoundingClientRect();
    var dist = Math.max(wr.right - sr.left, 0) + 30;
    walker.style.visibility = 'visible';
    var a = walker.animate(
      [{ transform: 'translateX(' + (-dist) + 'px)', filter: 'blur(10px)' }, { transform: 'translateX(0)', filter: 'blur(0px)' }],
      { duration: 3200, delay: 250, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'both' }
    );
    setTimeout(arrive, 1900);
    a.onfinish = function () { a.cancel(); };
  }

  var started = false;
  function begin(withVoice) {
    if (started) return;
    started = true;
    setProg(1);
    setupMedia();
    root.classList.add('go');
    setTimeout(function () { h1.classList.add('settled'); }, 2800);
    if (withVoice) playIntro();
    if (reduce) { pre.remove(); startWalk(); return; }
    pre.classList.add('out');
    setTimeout(function () { pre.remove(); }, 1800);
    startWalk();
  }
  var gate = document.getElementById('gate'), preLabel = document.getElementById('preLabel');
  function ready() {
    setProg(1);
    preLabel.textContent = 'READY';
    if (!window.speechSynthesis && !MEDIA.audio) { begin(false); return; }
    gate.hidden = false;
    var auto = setTimeout(function () { begin(false); }, 12000);
    var ev = document.getElementById('enterVoice');
    ev.addEventListener('click', function () { clearTimeout(auto); begin(true); });
    document.getElementById('enterSilent').addEventListener('click', function () { clearTimeout(auto); begin(false); });
    try { ev.focus({ preventScroll: true }); } catch (e) {}
  }
  Promise.race([Promise.all([minTime, fontsDone, imgDone, loadDone]), cap]).then(ready);

  /* Portrait tilt follows the pointer */
  if (fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      tilt.style.setProperty('--tx', (x * 14).toFixed(1) + 'px');
    });
    hero.addEventListener('pointerleave', function () {
      tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--tx', '0px');
    });
  }

  /* Introduction voice with live captions */
  var INTRO_TEXT = "Hello, and welcome to my portfolio. I'm Sanjeet Kumar, a data analyst and computer science student at SAGE University Bhopal. I work with Python, SQL and Power BI to turn raw data into clear, visual insights. I recently completed a data analytics internship at Codec Technologies, and I'm certified by IBM in Docker Essentials. Explore my projects, and let's connect.";
  var SAY = { SQL: 'S Q L', SAGE: 'Sage', BI: 'B I' };
  var words = INTRO_TEXT.split(' '), speakText = '', offs = [];
  words.forEach(function (w) {
    var core = w.replace(/[.,!?]/g, ''), say = SAY[core] ? w.replace(core, SAY[core]) : w;
    if (speakText) speakText += ' ';
    offs.push(speakText.length); speakText += say;
  });
  var capEl = document.getElementById('caption'), soundLabel = soundBtn.querySelector('b');
  words.forEach(function (w) { var sp = document.createElement('span'); sp.textContent = w + ' '; capEl.appendChild(sp); });
  function setWord(n) {
    Array.prototype.forEach.call(capEl.children, function (sp, i) { sp.classList.toggle('on', i <= n); sp.classList.toggle('cur', i === n); });
  }
  var speaking = false, timers = [], audioEl = null;
  function resetUi() {
    timers.forEach(clearTimeout); timers = []; speaking = false;
    soundBtn.classList.remove('speaking'); soundBtn.setAttribute('aria-pressed', 'false'); soundLabel.textContent = 'Play introduction';
  }
  function stopIntro() { try { speechSynthesis.cancel(); } catch (e) {} if (audioEl) { audioEl.pause(); audioEl = null; } resetUi(); }
  function finish() { resetUi(); setWord(words.length); }
  function startTimed(total) { var per = total / words.length; words.forEach(function (w, i) { timers.push(setTimeout(function () { setWord(i); }, i * per)); }); }
  function pickVoice() {
    var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [], best = null, bs = -1;
    vs.forEach(function (v) {
      if (!/^en/i.test(v.lang)) return;
      var sc = (/en[-_]IN/i.test(v.lang) ? 4 : /en[-_]GB/i.test(v.lang) ? 3 : /en[-_]US/i.test(v.lang) ? 2 : 1) * 10;
      if (/(natural|neural|online|premium|enhanced|google)/i.test(v.name)) sc += 4;
      if (/(male|ryan|prabhat|ravi|daniel|guy|david|mark|george|james|aaron|arthur)/i.test(v.name)) sc += 5;
      if (/(female|zira|heera|samantha|susan|hazel|aria|jenny|libby|sonia|neerja)/i.test(v.name)) sc -= 6;
      if (sc > bs) { bs = sc; best = v; }
    });
    return best;
  }
  if (window.speechSynthesis) { speechSynthesis.onvoiceschanged = function () {}; speechSynthesis.getVoices(); }
  function playIntro() {
    if (speaking) { stopIntro(); return; }
    var vid = walker.querySelector('video');
    if (vid && !MEDIA.audio) { vid.currentTime = 0; vid.muted = false; vid.play().catch(function () {}); return; }
    capEl.hidden = false; setWord(-1);
    speaking = true; soundBtn.classList.add('speaking'); soundBtn.setAttribute('aria-pressed', 'true'); soundLabel.textContent = 'Stop';
    if (MEDIA.audio) {
      audioEl = new Audio(MEDIA.audio); audioEl.onended = finish;
      audioEl.addEventListener('loadedmetadata', function () { startTimed(audioEl.duration * 1000); });
      audioEl.play().catch(finish); return;
    }
    var v = pickVoice(), gotB = false, chunks = [], re = /[^.!?]+[.!?]*\s*/g, m;
    while ((m = re.exec(speakText))) chunks.push({ t: m[0], base: m.index });
    try {
      speechSynthesis.cancel();
      chunks.forEach(function (c, ci) {
        var u = new SpeechSynthesisUtterance(c.t);
        if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-IN'; }
        u.rate = 0.95; u.pitch = 0.95;
        u.onboundary = function (e) {
          if (e.name && e.name !== 'word') return;
          gotB = true; var pos = c.base + e.charIndex, idx = 0;
          for (var k = 0; k < offs.length; k++) { if (offs[k] <= pos) idx = k; }
          setWord(idx);
        };
        if (ci === 0) u.onstart = function () { setTimeout(function () { if (!gotB && speaking) startTimed(words.length * 360); }, 800); };
        if (ci === chunks.length - 1) u.onend = finish;
        u.onerror = function (e) { if (e.error !== 'interrupted' && e.error !== 'canceled') finish(); };
        speechSynthesis.speak(u);
      });
    } catch (e) { finish(); }
  }
  if (!('speechSynthesis' in window) && !MEDIA.video && !MEDIA.audio) soundBtn.hidden = true;
  soundBtn.addEventListener('click', playIntro);
  window.addEventListener('pagehide', stopIntro);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopIntro(); });

  /* Scroll progress and dock */
  var sb = document.getElementById('scrollbar');
  var dock = document.getElementById('dock');
  var secs = Array.prototype.slice.call(document.querySelectorAll('.sec'));
  secs.forEach(function (sec) { var l = sec.querySelector('.label'); if (l) sec.setAttribute('data-ghost', l.textContent); });
  document.querySelectorAll('.chips').forEach(function (ul) { Array.prototype.forEach.call(ul.children, function (c, i) { c.style.setProperty('--n', i); }); });
  function onScroll() {
    if (!reduce) secs.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      sec.style.setProperty('--gx', ((r.top + r.height / 2 - window.innerHeight / 2) * -0.14).toFixed(1) + 'px');
    });
    var h = document.documentElement.scrollHeight - window.innerHeight;
    sb.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0).toFixed(4) + ')';
    dock.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    if (!reduce && hero) { hero.classList.add('par'); hero.style.setProperty('--hp', Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1).toFixed(3)); }
    if (!reduce) { var bwb = document.querySelector('.bigword'); if (bwb) { var rr = bwb.getBoundingClientRect(); bwb.firstElementChild.style.transform = 'translateX(' + (rr.top / window.innerHeight * -380 - 120).toFixed(1) + 'px)'; } }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Word-by-word statements */
  function splitWords(node, st) {
    Array.from(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var i = document.createElement('span'); i.textContent = part; i.style.transitionDelay = (st.i++ * 70) + 'ms';
          w.appendChild(i); frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) { splitWords(n, st); }
    });
  }
  document.querySelectorAll('.statement').forEach(function (el) { splitWords(el, { i: 0 }); });

  /* Reveal on scroll */
  document.querySelectorAll('.item, .facts, .stats, .rows li, .skill-group, .contact-list li, .lead, .big, .spec, .flow, .code, .cert, .proof').forEach(function (el) {
    el.setAttribute('data-r', '');
    var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.transitionDelay = ((sibs % 6) * 70) + 'ms';
  });
  var revealEls = document.querySelectorAll('[data-r], .statement, .label');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); if (e.target.classList.contains('label')) scramble(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Count-up numbers */
  function countUp(el) {
    var to = +el.getAttribute('data-count'), t0 = null;
    if (reduce) return;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to;
    }
    el.textContent = '0'; requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* Active section in the dock */
  if ('IntersectionObserver' in window) {
    var links = {};
    dock.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (id) { links[id].classList.toggle('on', id === e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var sec = document.getElementById(id); if (sec) so.observe(sec); });
  }

  /* Cursor ring and magnetic buttons (pointer devices only) */
  if (fine && !reduce) {
    var ring = document.getElementById('ring');
    var x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; ring.classList.add('on'); });
    var ringLab = ring.querySelector('em');
    [['.proof', 'View'], ['.cert', 'Verify'], ['.intro', 'Play'], ['a.btn[target]', 'Open'], ['.contact-list a.v', 'Open'], ['.kbtn', 'Jump']].forEach(function (m) {
      document.querySelectorAll(m[0]).forEach(function (el) { el.setAttribute('data-cursor', m[1]); });
    });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target : null, lab = t && t.closest('[data-cursor]');
      if (lab) { ringLab.textContent = lab.getAttribute('data-cursor'); ring.classList.add('lab'); ring.classList.remove('big'); }
      else { ring.classList.remove('lab'); ring.classList.toggle('big', !!(t && t.closest('a, button, .chip, .rows li'))); }
    });
    document.addEventListener('pointerleave', function () { ring.classList.remove('on'); });
    (function loop() { x += (tx - x) * 0.18; y += (ty - y) * 0.18; ring.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* Text scramble for section labels */
  function scramble(el) {
    var txt = el.textContent, glyphs = '01#/<>_+=', t0 = null;
    el.setAttribute('aria-label', txt);
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 700, 1), out = '';
      for (var i = 0; i < txt.length; i++) {
        out += (txt[i] === ' ' || i < txt.length * p) ? txt[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    requestAnimationFrame(step);
  }

  /* Data-grid background that reacts to the cursor */
  var cv = document.getElementById('grid'), cx = cv.getContext('2d');
  var gw = 0, gh = 0, mx = -999, my = -999, heroVisible = true;
  function sizeGrid() {
    var r = hero.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    gw = r.width; gh = r.height; cv.width = gw * dpr; cv.height = gh * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawGrid(t) {
    cx.clearRect(0, 0, gw, gh);
    var sp = 36;
    for (var y = sp / 2; y < gh; y += sp) {
      for (var x = sp / 2; x < gw; x += sp) {
        var d = Math.sqrt((x - mx) * (x - mx) + (y - my) * (y - my));
        var near = Math.max(0, 1 - d / 190);
        var wave = Math.max(0, (Math.sin(x * 0.012 + t * 0.0012) + Math.sin(y * 0.015 - t * 0.001)) * 0.5);
        cx.fillStyle = near > 0.05 ? 'rgba(255,48,56,' + (0.25 + near * 0.75).toFixed(2) + ')' : 'rgba(17,17,17,' + (0.1 + wave * 0.12).toFixed(2) + ')';
        cx.beginPath(); cx.arc(x, y, 1 + near * 3.2 + wave * 0.9, 0, 6.283); cx.fill();
      }
    }
  }
  sizeGrid();
  window.addEventListener('resize', function () { sizeGrid(); if (reduce) drawGrid(0); });
  if (reduce) { drawGrid(0); } else {
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', function () { mx = -999; my = -999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(hero);
    (function gloop(t) { if (heroVisible) drawGrid(t); requestAnimationFrame(gloop); })(0);
  }

  /* Ticker speeds up and reverses with scroll */
  var tick = document.querySelector('.ticker'), track = tick.querySelector('.track');
  if (!reduce) {
    tick.classList.add('js-tick');
    var txp = 0, lastY = window.scrollY, vel = 0, paused = false;
    tick.addEventListener('pointerenter', function () { paused = true; });
    tick.addEventListener('pointerleave', function () { paused = false; });
    (function tloop() {
      var y = window.scrollY; vel += ((y - lastY) - vel) * 0.12; lastY = y;
      var dir = vel < -1.5 ? -1 : 1, sp = paused ? 0 : 0.7 + Math.min(Math.abs(vel), 40) * 0.4;
      var half = track.firstElementChild.getBoundingClientRect().width || 1;
      txp -= dir * sp;
      if (txp <= -half) txp += half; if (txp > 0) txp -= half;
      track.style.transform = 'translateX(' + txp.toFixed(2) + 'px) skewX(' + Math.max(-12, Math.min(12, -vel * 0.25)).toFixed(2) + 'deg)';
      requestAnimationFrame(tloop);
    })();
  }

  /* Typed code sketch */
  var CODE = 'import requests\nimport pandas as pd\n\ncities = ["Lucknow", "Patna", "Ranchi", "Bhopal"]  # state capitals\nrows = []\n\nfor city in cities:\n    data = requests.get(API_URL, params={"q": city}).json()\n    rows.append({\n        "city": city,\n        "temp": data["main"]["temp"],\n        "humidity": data["main"]["humidity"],\n    })\n\ndf = pd.DataFrame(rows)\ndf.to_csv("india_weather_2026.csv", index=False)';
  var codeOut = document.getElementById('codeOut');
  function hl(src) {
    var esc = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc.replace(/(#[^\n]*)|("[^"\n]*"?)|\b(import|for|in|as|False|True)\b/g, function (m, c, st, k) {
      return '<span class="' + (c ? 'c' : st ? 's' : 'k') + '">' + m + '</span>';
    });
  }
  function typeCode() {
    var t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var n = Math.min(Math.floor((t - t0) / 18), CODE.length);
      codeOut.innerHTML = hl(CODE.slice(0, n)) + '<span class="caret"></span>';
      if (n < CODE.length) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) { codeOut.innerHTML = hl(CODE); }
  else {
    codeOut.innerHTML = '<span class="caret"></span>';
    var cio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { cio.disconnect(); typeCode(); } }, { threshold: 0.5 });
    cio.observe(document.getElementById('code'));
  }

  /* Live local time */
  function clk() { try { document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }); } catch (e) {} }
  clk(); setInterval(clk, 15000);

  /* Quick-jump palette (Ctrl/Cmd + K) */
  var pal = document.getElementById('pal'), palIn = document.getElementById('palIn'), palList = document.getElementById('palList');
  var PAL = [['About', '#about'], ['Workflow', '#story'], ['Skills', '#skills'], ['Experience', '#experience'], ['Projects', '#projects'], ['Problem solving', '#dsa'], ['Education', '#education'], ['Certifications', '#recognition'], ['Achievements', '#achievements'], ['Contact', '#contact'], ['LeetCode ↗', 'https://leetcode.com/u/sanjeet1234/', 1], ['LifeFlow site ↗', 'https://sanjeetkumar989159-hub.github.io/Life-Flow-Blood-Bank/', 1], ['GitHub ↗', 'https://github.com/sanjeetkumar989159-hub', 1], ['LinkedIn ↗', 'https://www.linkedin.com/in/sanjeet-kumar-706597s/', 1]];
  var sel = 0;
  function markSel() { Array.prototype.forEach.call(palList.children, function (a, i) { a.classList.toggle('sel', i === sel); }); }
  function renderPal(q) {
    palList.innerHTML = '';
    PAL.filter(function (it) { return it[0].toLowerCase().indexOf(q.toLowerCase()) > -1; }).forEach(function (it) {
      var a = document.createElement('a'); a.href = it[1]; a.setAttribute('role', 'option'); a.textContent = it[0];
      if (it[2]) { a.target = '_blank'; a.rel = 'noopener'; }
      a.addEventListener('click', closePal); palList.appendChild(a);
    });
    sel = 0; markSel();
  }
  function openPal() { pal.hidden = false; palIn.value = ''; renderPal(''); palIn.focus(); }
  function closePal() { pal.hidden = true; }
  document.getElementById('kbtn').addEventListener('click', openPal);
  pal.addEventListener('click', function (e) { if (e.target === pal) closePal(); });
  palIn.addEventListener('input', function () { renderPal(palIn.value); });
  palIn.addEventListener('keydown', function (e) {
    var n = palList.children.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(n, 1); markSel(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + n) % Math.max(n, 1); markSel(); }
    else if (e.key === 'Enter' && n) { e.preventDefault(); palList.children[sel].click(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (pal.hidden) openPal(); else closePal(); }
    else if (e.key === 'Escape' && !pal.hidden) closePal();
  });

  /* Certificate card tilt and glare */
  var certEl = document.querySelector('.cert');
  if (certEl && fine && !reduce) {
    var ci = certEl.querySelector('.cert-img');
    certEl.addEventListener('pointermove', function (e) {
      var r = ci.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      ci.style.setProperty('--cry', ((x - 0.5) * 14).toFixed(1) + 'deg'); ci.style.setProperty('--crx', ((0.5 - y) * 10).toFixed(1) + 'deg');
      ci.style.setProperty('--gx', (x * 100).toFixed(0) + '%'); ci.style.setProperty('--gy', (y * 100).toFixed(0) + '%');
    });
    certEl.addEventListener('pointerleave', function () { ci.style.setProperty('--cry', '0deg'); ci.style.setProperty('--crx', '0deg'); });
  }

  /* Certificate viewer */
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); }
  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var im = btn.querySelector('img'), t = btn.querySelector('b');
      lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = t ? t.textContent : '';
      lb.hidden = false; document.getElementById('lbX').focus();
    });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.id === 'lbX') closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* Scroll-driven data story */
  var story = document.getElementById('story'), scv = document.getElementById('storyCv'), sctx = scv.getContext('2d');
  var stepEls = story.querySelectorAll('.steps li'), sbar = document.getElementById('storyBar');
  var N = 44, pts = [], sd = 7, sw = 0, sh = 0, storyVis = false, lastStep = -1, PEAK = 0;
  function rnd() { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; }
  function trendAt(u) { return 0.22 + 0.56 * u + 0.06 * Math.sin(u * (N - 1) * 0.45); }
  for (var si = 0; si < N; si++) {
    var tv = trendAt(si / (N - 1)), cyv = Math.min(0.95, Math.max(0.08, tv + (rnd() - 0.5) * 0.2));
    pts.push({ sx: rnd(), sy: 0.05 + rnd() * 0.9, ty: tv, cy: cyv, bad: si % 7 === 3 });
    if (pts[si].cy > pts[PEAK].cy) PEAK = si;
  }
  function sizeStory() {
    var r = scv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    sw = r.width; sh = r.height; scv.width = Math.max(1, sw * dpr); scv.height = Math.max(1, sh * dpr); sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function ease(x) { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var LABELS = ['01  RAW DATA', '02  CLEANED', '03  TREND', '04  DASHBOARD'];
  function drawStory(p, time) {
    sctx.clearRect(0, 0, sw, sh);
    var x0 = sw * 0.07, pw = sw * 0.86, base = sh * 0.84, ph = sh * 0.68;
    var t1 = ease(p / 0.12), t2 = ease((p - 0.25) / 0.2), t3 = ease((p - 0.5) / 0.22), t4 = ease((p - 0.76) / 0.2);
    sctx.lineWidth = 1; sctx.strokeStyle = 'rgba(17,17,17,' + (0.06 + 0.1 * t2).toFixed(3) + ')';
    for (var g = 0; g <= 4; g++) { var gy = base - ph * g / 4; sctx.beginPath(); sctx.moveTo(x0, gy); sctx.lineTo(x0 + pw, gy); sctx.stroke(); }
    sctx.strokeStyle = 'rgba(17,17,17,.55)'; sctx.beginPath(); sctx.moveTo(x0, base); sctx.lineTo(x0 + pw, base); sctx.stroke();
    var bw = pw / N * 0.62;
    for (var i = 0; i < N; i++) {
      var q = pts[i];
      var cx = x0 + pw * (i + 0.5) / N, cyv = q.bad ? q.ty : q.cy;
      var sx = x0 + pw * q.sx + Math.sin(time * 0.002 + i * 1.7) * 3 * (1 - t2), sy = base - ph * q.sy + Math.cos(time * 0.0023 + i * 1.3) * 3 * (1 - t2);
      var x = lerp(sx, cx, t2), y = lerp(sy, base - ph * cyv, t2);
      if (q.bad && t2 < 1) {
        var k = 5 * (1 - t2); sctx.strokeStyle = 'rgba(255,48,56,' + t1.toFixed(2) + ')'; sctx.lineWidth = 2;
        sctx.beginPath(); sctx.moveTo(x - k, y - k); sctx.lineTo(x + k, y + k); sctx.moveTo(x + k, y - k); sctx.lineTo(x - k, y + k); sctx.stroke();
      }
      var dotA = (q.bad ? t2 : 1) * t1 * (1 - t4);
      if (dotA > 0.01) { sctx.fillStyle = 'rgba(17,17,17,' + dotA.toFixed(2) + ')'; sctx.beginPath(); sctx.arc(x, y, q.bad ? 4 * t2 : 4, 0, 6.283); sctx.fill(); }
      if (t4 > 0.01) {
        var hgt = (base - y) * t4; sctx.fillStyle = i === PEAK ? 'rgb(255,48,56)' : 'rgba(17,17,17,' + (0.9 * t4).toFixed(2) + ')';
        sctx.fillRect(cx - bw / 2, base - hgt, bw, hgt);
      }
    }
    if (t3 > 0.001) {
      sctx.strokeStyle = 'rgba(255,48,56,' + (1 - 0.55 * t4).toFixed(2) + ')'; sctx.lineWidth = 3; sctx.lineCap = 'round'; sctx.beginPath();
      var steps = 80, endU = t3;
      for (var j = 0; j <= steps; j++) {
        var u = endU * j / steps, px = x0 + pw * (0.5 / N + u * (N - 1) / N), py = base - ph * trendAt(u);
        if (j === 0) sctx.moveTo(px, py); else sctx.lineTo(px, py);
      }
      sctx.stroke();
      var hu = endU, hx = x0 + pw * (0.5 / N + hu * (N - 1) / N), hy = base - ph * trendAt(hu);
      sctx.fillStyle = 'rgb(255,48,56)'; sctx.beginPath(); sctx.arc(hx, hy, 5 + 2 * Math.sin(time * 0.006), 0, 6.283); sctx.fill();
    }
    var idx = Math.min(3, Math.floor(p * 4));
    sctx.font = '500 ' + Math.max(10, Math.min(13, sw / 55)).toFixed(0) + 'px "IBM Plex Mono", monospace'; sctx.fillStyle = '#111'; sctx.textBaseline = 'top';
    sctx.fillText(LABELS[idx], x0, sh * 0.06);
    if (idx === 3) { var pxk = x0 + pw * (PEAK + 0.5) / N; sctx.fillStyle = 'rgb(255,48,56)'; sctx.textAlign = pxk > sw * 0.7 ? 'right' : 'left'; sctx.fillText('PEAK', pxk + (pxk > sw * 0.7 ? 4 : -4), base - (base - (base - ph * pts[PEAK].cy)) * t4 - 22); sctx.textAlign = 'left'; }
  }
  function storyProgress() {
    var r = story.getBoundingClientRect(), total = story.offsetHeight - window.innerHeight;
    return total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 1;
  }
  function setStep(p) {
    var idx = Math.min(3, Math.floor(p * 4));
    if (idx !== lastStep) { lastStep = idx; Array.prototype.forEach.call(stepEls, function (li, i) { li.classList.toggle('on', i === idx); }); }
    sbar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }
  sizeStory();
  window.addEventListener('resize', function () { sizeStory(); if (reduce) drawStory(1, 0); });
  if (reduce || !('IntersectionObserver' in window)) { story.classList.add('static'); drawStory(1, 0); }
  else {
    new IntersectionObserver(function (es) { storyVis = es[0].isIntersecting; }, { rootMargin: '10% 0px 10% 0px' }).observe(story);
    (function sloop(t) { if (storyVis) { var p = storyProgress(); setStep(p); drawStory(p, t); } requestAnimationFrame(sloop); })(0);
  }

  /* Footer wordmark reacts to the cursor */
  var mark = document.getElementById('mark'), mw = document.getElementById('markWord'), mpx = -9999, mVis = false;
  'SANJEET KUMAR'.split('').forEach(function (ch) { var sp = document.createElement('span'); sp.textContent = ch === ' ' ? ' ' : ch; mw.appendChild(sp); });
  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { mVis = es[0].isIntersecting; }).observe(mark);
    mark.addEventListener('pointermove', function (e) { mpx = e.clientX; });
    mark.addEventListener('pointerleave', function () { mpx = -9999; });
    (function mloop(t) {
      if (mVis) {
        var kids = mw.children, cxs = [], i;
        for (i = 0; i < kids.length; i++) { var r = kids[i].getBoundingClientRect(); cxs.push(r.left + r.width / 2); }
        for (i = 0; i < kids.length; i++) {
          var near = mpx > -9000 ? Math.max(0, 1 - Math.abs(cxs[i] - mpx) / 230) : (Math.sin(t * 0.0016 + i * 0.6) * 0.5 + 0.5) * 0.5;
          kids[i].style.fontVariationSettings = "'wdth' " + (80 + near * 45).toFixed(0) + ", 'wght' " + (700 + near * 200).toFixed(0);
          kids[i].style.color = mpx > -9000 && near > 0.05 ? 'rgb(255,' + Math.round(255 - 207 * near) + ',' + Math.round(255 - 199 * near) + ')' : '';
        }
      }
      requestAnimationFrame(mloop);
    })(0);
  }

  /* Background video: respect reduced motion, pause when off screen */
  var bgv = document.getElementById('bgvid');
  if (bgv) {
    if (reduce) { bgv.pause(); bgv.removeAttribute('autoplay'); }
    else {
      var vp = bgv.play(); if (vp && vp.catch) vp.catch(function () {});
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { var q = bgv.play(); if (q && q.catch) q.catch(function () {}); } else { bgv.pause(); }
      }).observe(hero);
    }
  }

  /* Keep the name fully visible at every screen size */
  function fitOne(el) {
    if (!el) return;
    el.style.removeProperty('font-size');
    var cw = el.clientWidth, sw2 = el.scrollWidth;
    if (cw > 0 && sw2 > cw) {
      var fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.setProperty('font-size', (fs * cw / sw2 * 0.97).toFixed(2) + 'px', 'important');
    }
  }
  function fitMark() {
    var kids = Array.prototype.slice.call(mw.children), i, rest = 0, exp = 0;
    mw.style.removeProperty('font-size');
    kids.forEach(function (k) { k.style.fontVariationSettings = ''; });
    kids.forEach(function (k) { rest += k.getBoundingClientRect().width; });
    kids.forEach(function (k) { k.style.fontVariationSettings = "'wdth' 125, 'wght' 900"; });
    kids.forEach(function (k) { exp += k.getBoundingClientRect().width; });
    kids.forEach(function (k) { k.style.fontVariationSettings = ''; });
    var cs = getComputedStyle(mw), inner = mw.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var need = rest + (exp - rest) * (5 / kids.length);
    if (need > inner * 0.98) mw.style.setProperty('font-size', (parseFloat(cs.fontSize) * inner * 0.98 / need).toFixed(2) + 'px', 'important');
  }
  function fitAll() { fitOne(document.getElementById('preName')); fitOne(h1); fitMark(); }
  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(); setTimeout(fitAll, 400); });
  var fitT; window.addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(fitAll, 120); });

  /* Copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.textContent;
      function done(t) { b.textContent = t; setTimeout(function () { b.textContent = label; }, 1800); }
      function select() {
        var el = document.getElementById(b.getAttribute('data-target'));
        if (!el) return;
        var r = document.createRange(); r.selectNodeContents(el);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        done('Selected');
      }
      try { navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function () { done('Copied'); }, select); } catch (e) { select(); }
    });
  });
})();
