(function () {
  'use strict';
  var d = document, root = d.documentElement, $ = function (id) { return d.getElementById(id); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* menyu */
  var menu = $('menu'), burger = $('burger');
  burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', menu.classList.toggle('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });

  /* yozilish effekti */
  var words = ['Python dasturchi', 'Frontend dasturchi', 'Ma’lumotlar bazasi bilan ishlash', 'Kelajakdagi Software Engineer'], el = $('typed');
  if (reduce) { el.textContent = words[0]; } else {
    var w = 0, c = 0, del = false;
    (function tick() {
      var s = words[w], t = del ? 35 : 80;
      el.textContent = s.slice(0, c);
      if (!del && c === s.length) { del = true; t = 1400; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; t = 350; }
      else { c += del ? -1 : 1; }
      setTimeout(tick, t);
    })();
  }

  /* paydo bo‘lish */
  var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function watch(n) { if (io) io.observe(n); else n.classList.add('in'); }
  d.querySelectorAll('.rv').forEach(watch);

  /* 3D qiyshayish (rasmlar va kartalar) + kursor nuri */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    d.querySelectorAll('.tilt').forEach(function (n) {
      n.addEventListener('pointermove', function (e) {
        var r = n.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        n.style.transform = 'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg) translateY(-4px)';
      });
      n.addEventListener('pointerleave', function () { n.style.transform = ''; });
    });
    var cur = $('cur');
    addEventListener('pointermove', function (e) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, { passive: true });
  }

  /* skroll: progress, menyu, yo‘l */
  var links = d.querySelectorAll('.menu a'), secs = [].map.call(links, function (a) { return d.querySelector(a.getAttribute('href')); });
  var road = $('road'), steps = road.querySelectorAll('li');
  function onScroll() {
    var y = scrollY, h = root.scrollHeight - innerHeight;
    $('bar').style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    var cur = -1; secs.forEach(function (s, i) { if (s && s.offsetTop - 160 <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur && !a.classList.contains('cta')); });
    var r = road.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
    road.style.setProperty('--pr', p);
    steps.forEach(function (s, i) { s.classList.toggle('on', p > (i + .5) / steps.length - .08); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ALOQA: o‘z havolalaringizni shu yerga yozing */
  var CONTACTS = {
    cTelegram: { url: '', label: '' },   // 'https://t.me/username', '@username'
    cGithub:   { url: '', label: '' },   // 'https://github.com/username', 'username'
    cEmail:    { url: '', label: '' }    // 'mailto:name@example.com', 'name@example.com'
  };
  Object.keys(CONTACTS).forEach(function (id) {
    var c = CONTACTS[id], a = $(id);
    if (!c.url) return;
    a.href = c.url; a.target = '_blank'; a.rel = 'noopener'; a.classList.remove('off');
    a.querySelector('p').textContent = c.label || c.url;
  });
  var tEl = $('toast'), tt;
  function toast(m) { tEl.textContent = m; tEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { tEl.classList.remove('show'); }, 3200); }
  d.querySelectorAll('.link.off').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast('Bu havola tez orada qo‘shiladi'); }); });
  $('cform').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('fName').value.trim(), m = $('fMsg').value.trim();
    if (n.length < 2 || m.length < 5) { toast('Ism va xabarni to‘ldiring'); return; }
    var text = m + '\n\n— ' + n, em = CONTACTS.cEmail.url, tg = CONTACTS.cTelegram.url;
    if (em) location.href = em + (em.indexOf('?') < 0 ? '?' : '&') + 'subject=' + encodeURIComponent('Portfolio saytidan xabar') + '&body=' + encodeURIComponent(text);
    else if (tg) open(tg + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    else { try { navigator.clipboard.writeText(text); } catch (x) {} toast('Aloqa havolalari hali qo‘shilmagan — xabar nusxalandi'); return; }
    toast('Rahmat! Xabar tayyor ✔'); this.reset();
  });

  /* LOYIHALAR: karta + ichiga kirish */
  var P = [
    { t: 'Python dasturi', tag: 'Python', ic: '🐍', code: ['<k>name</k> = <f>input</f>(<s>"Ismingiz: "</s>)', '<f>print</f>(<s>"Salom,"</s>, name)'], d: 'Python asoslarini mustahkamlash uchun oddiy konsol dastur: foydalanuvchi bilan muloqot qiladi va natijani ko‘rsatadi.', l: ['O‘zgaruvchilar va shartlar', 'Funksiyalar bilan ishlash', 'Kiritilgan ma’lumotni qayta ishlash'], s: ['Python'] },
    { t: 'Shaxsiy portfolio sayti', tag: 'HTML · CSS · JS', ic: '🌐', code: ['<k>&lt;section</k> <f>id</f>=<s>"haqimda"</s><k>&gt;</k>', '  <k>&lt;h2&gt;</k>Men haqimda<k>&lt;/h2&gt;</k>'], d: 'O‘zim haqimda ma’lumot beruvchi zamonaviy veb-sahifa — aynan siz hozir ko‘rib turgan sayt.', l: ['HTML tuzilmasi va CSS dizayn', 'JavaScript animatsiyalari', 'Mobil qurilmalarga moslashuvchan dizayn'], s: ['HTML', 'CSS', 'JavaScript'] },
    { t: 'SQLite ma’lumotlar bazasi', tag: 'SQLite', ic: '🪶', code: ['<k>SELECT</k> * <k>FROM</k> students', '<k>WHERE</k> class = <s>"7-D"</s>;'], d: 'Ma’lumotlarni saqlash, qidirish va o‘zgartirishni o‘rganish uchun kichik ma’lumotlar bazasi loyihasi.', l: ['Jadvallar yaratish', 'SELECT, INSERT, UPDATE so‘rovlari', 'Saralash va filtrlash'], s: ['SQLite', 'SQL', 'Python'] },
    { t: 'Interaktiv veb-sahifa', tag: 'JavaScript', ic: '✨', code: ['btn.<f>addEventListener</f>(<s>"click"</s>, () =&gt; {', '  card.classList.<f>toggle</f>(<s>"on"</s>)', '})'], d: 'Tugmalar, animatsiyalar va hodisalar bilan jonli sahifa yaratish loyihasi.', l: ['DOM bilan ishlash', 'Hodisalarni boshqarish', 'CSS animatsiyalar'], s: ['JavaScript', 'CSS'] },
    { t: 'AZIKO MARKET', tag: 'Onlayn do‘kon', ic: '🛍️', image: 'assets/images/aziko-market.png', href: 'https://aziko-4bu0.onrender.com/', code: ['AZIKO MARKET', 'Shop + Support + Tavsiya'], d: 'Mahsulotlarni ko‘rish, savatchaga qo‘shish va AI yordamchisidan foydalanish mumkin bo‘lgan onlayn do‘kon.', l: ['Mahsulotlar katalogi', 'Savatcha va checkout', 'AI yordamchi'], s: ['HTML', 'CSS', 'JavaScript'] },
    { t: 'Flappy Bird', tag: 'Brauzer o‘yini', ic: '🐤', image: 'assets/images/flappy-bird-cover.png', href: 'games/flappy-bird/index.html', code: ['SPACE — uchish', 'Ochko to‘plash'], d: 'Qushni boshqarib, quvurlar orasidan o‘ting va imkon qadar ko‘proq ochko to‘plang.', l: ['Brauzerda o‘ynaladi', 'Klaviatura va sensorli boshqaruv', 'Rekordni saqlash'], s: ['HTML', 'JavaScript', 'Canvas'] }
  ];
  var grid = $('projGrid'), dlg = $('pm');
  grid.innerHTML = P.map(function (p, i) {
    return '<article class="proj rv tilt" tabindex="0" role="button" data-i="' + i + '" aria-label="' + p.t + ' — ochish">' + (p.image ? '<div class="proj-cover"><img src="' + p.image + '" alt="' + p.t + '"></div>' : '<div class="frame"><div class="fbar"><b></b><b></b><b></b><span>' + p.tag + '</span></div><pre>' + p.code.join('\n') + '</pre></div>') + '<div class="pbody"><span class="tag">' + p.ic + ' ' + p.tag + '</span><h3>' + p.t + '</h3><p>' + p.d + '</p><span class="go">Ichiga kirish ➜</span></div></article>';
  }).join('');
  grid.querySelectorAll('.rv').forEach(watch);
  function openP(i) {
    var p = P[i], gh = CONTACTS.cGithub.url;
    if (p.href) { if (/^https?:/.test(p.href)) window.open(p.href, '_blank', 'noopener'); else location.href = p.href; return; }
    dlg.innerHTML = '<button class="x" aria-label="Yopish">✕</button><div class="frame"><div class="fbar"><b></b><b></b><b></b><span>' + p.tag + '</span></div><pre>' + p.code.join('\n') + '</pre></div><div class="pin"><span class="tag">' + p.ic + ' ' + p.tag + '</span><h3 id="pmT">' + p.t + '</h3><p>' + p.d + '</p><h4>Nimalarni o‘rgandim</h4><ul>' + p.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><div class="stack">' + p.s.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' + (gh ? '<a class="btn pri" href="' + gh + '" target="_blank" rel="noopener">GitHub’da ko‘rish</a>' : '<p>GitHub havolasi tez orada qo‘shiladi.</p>') + '</div>';
    dlg.showModal();
  }
  grid.addEventListener('click', function (e) { var c = e.target.closest('.proj'); if (c) openP(+c.dataset.i); });
  grid.addEventListener('keydown', function (e) { var c = e.target.closest('.proj'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openP(+c.dataset.i); } });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('x')) dlg.close(); });
  $('year').textContent = new Date().getFullYear();
})();
