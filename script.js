document.addEventListener("DOMContentLoaded", function () {
  var $ = function (i) {
      return document.getElementById(i);
    },
    all = function (s) {
      return document.querySelectorAll(s);
    };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches,
    fine = matchMedia("(pointer:fine)").matches;

  // nav
  var links = $("links"),
    bg = $("burger");
  bg.onclick = function () {
    var o = links.classList.toggle("open");
    bg.setAttribute("aria-expanded", o);
  };
  all(".links a").forEach(function (a) {
    a.onclick = function () {
      links.classList.remove("open");
    };
  });
  var navA = [].slice.call(all(".links a"));
  var no = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          navA.forEach(function (a) {
            a.classList.toggle(
              "on",
              a.getAttribute("href") === "#" + e.target.id,
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  all("main section[id]").forEach(function (s) {
    no.observe(s);
  });

  // scroll progress + reveal
  var bar = $("progress");
  function sc() {
    var h = document.documentElement;
    bar.style.transform =
      "scaleX(" + h.scrollTop / (h.scrollHeight - h.clientHeight || 1) + ")";
  }
  addEventListener("scroll", sc, { passive: true });
  sc();
  var ro = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          ro.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  all(".rv").forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    ro.observe(el);
  });

  // skills marquee
  var sk = [
      "Python",
      "SQL",
      "Power BI",
      "Computer Vision",
      "Pandas",
      "OpenCV",
      "Machine Learning",
      "React",
      "Figma",
      "Excel",
      "NumPy",
      "Java",
      "C++",
    ],
    h = "";
  for (var k = 0; k < 2; k++)
    sk.forEach(function (s) {
      h += "<span>" + s + "</span>";
    });
  $("track").innerHTML = h;

  // typed role
  var ph = [
      "Power BI dashboards",
      "computer vision models",
      "SQL-driven insights",
      "full-stack apps",
    ],
    te = $("typed");
  if (!RM) {
    var pi = 0,
      ci = 0,
      dl = false;
    (function t() {
      var w = ph[pi];
      ci += dl ? -1 : 1;
      te.textContent = w.slice(0, ci);
      var d = dl ? 35 : 70;
      if (!dl && ci === w.length) {
        dl = true;
        d = 1700;
      } else if (dl && ci === 0) {
        dl = false;
        pi = (pi + 1) % ph.length;
        d = 350;
      }
      setTimeout(t, d);
    })();
  }

  // counters
  var co = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var T = +e.target.dataset.to,
          s = performance.now();
        (function f(n) {
          var p = Math.min((n - s) / 1300, 1);
          e.target.textContent = Math.round(T * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(f);
        })(s);
      });
    },
    { threshold: 0.6 },
  );
  all("[data-to]").forEach(function (n) {
    if (!RM) {
      n.textContent = "0";
      co.observe(n);
    }
  });

  // card spotlight
  all(".card").forEach(function (c) {
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // cursor glow + portrait tilt
  if (fine && !RM) {
    var g = $("glow"),
      gx = 0,
      gy = 0,
      tx = 0,
      ty = 0;
    addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });
    (function m() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      g.style.transform = "translate(" + gx + "px," + gy + "px)";
      requestAnimationFrame(m);
    })();
    var pl = $("plate"),
      fr = $("frame");
    pl.addEventListener("mousemove", function (e) {
      var r = pl.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      fr.style.transform =
        "perspective(900px) rotateY(" +
        x * 12 +
        "deg) rotateX(" +
        -y * 12 +
        "deg)";
    });
    pl.addEventListener("mouseleave", function () {
      fr.style.transform = "";
    });
  } else $("glow").style.display = "none";

  // copy email
  $("copyMail").onclick = function () {
    var m = "sumitkumar989159@gmail.com",
      t = $("toast");
    function ok() {
      t.classList.add("show");
      setTimeout(function () {
        t.classList.remove("show");
      }, 2000);
    }
    if (navigator.clipboard)
      navigator.clipboard.writeText(m).then(ok, function () {
        location.href = "mailto:" + m;
      });
    else location.href = "mailto:" + m;
  };

  // hero network
  var cv = $("net"),
    cx = cv.getContext("2d"),
    hero = cv.parentNode,
    W,
    H,
    P = [],
    M = { x: -999, y: -999 },
    run = false,
    lp = false;
  function size() {
    var r = hero.getBoundingClientRect(),
      d = Math.min(devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    cv.width = W * d;
    cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.min(70, Math.round((W * H) / 15000));
    P = [];
    for (var i = 0; i < n; i++)
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
  }
  function draw() {
    cx.clearRect(0, 0, W, H);
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!RM) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (var j = i + 1; j < P.length; j++) {
        var q = P[j],
          dx = p.x - q.x,
          dy = p.y - q.y,
          d2 = dx * dx + dy * dy;
        if (d2 < 15000) {
          cx.globalAlpha = (1 - d2 / 15000) * 0.45;
          cx.strokeStyle = "#8b5cf6";
          cx.beginPath();
          cx.moveTo(p.x, p.y);
          cx.lineTo(q.x, q.y);
          cx.stroke();
        }
      }
      var mx = p.x - M.x,
        my = p.y - M.y,
        md = mx * mx + my * my;
      if (md < 24000) {
        cx.globalAlpha = (1 - md / 24000) * 0.9;
        cx.strokeStyle = "#22d3ee";
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(M.x, M.y);
        cx.stroke();
      }
      cx.globalAlpha = 0.9;
      cx.fillStyle = "#22d3ee";
      cx.beginPath();
      cx.arc(p.x, p.y, 1.7, 0, 6.283);
      cx.fill();
    }
    if (run && !RM) requestAnimationFrame(draw);
    else lp = false;
  }
  size();
  hero.addEventListener("mousemove", function (e) {
    var r = hero.getBoundingClientRect();
    M.x = e.clientX - r.left;
    M.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", function () {
    M.x = M.y = -999;
  });
  addEventListener("resize", function () {
    size();
    if (RM) draw();
  });
  new IntersectionObserver(function (es) {
    run = es[0].isIntersecting;
    if (run && !lp) {
      lp = true;
      draw();
    }
  }).observe(hero);
});
