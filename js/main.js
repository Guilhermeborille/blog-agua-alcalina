/* main.js — comportamento comum a todas as páginas */
(function () {
  'use strict';

  // ---------- Menu mobile ----------
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
  }

  // ---------- Link da página atual ----------
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  // ---------- Aparecer ao rolar ----------
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Curiosidade aleatória (página inicial) ----------
  var facts = [
    'O “p” do pH foi introduzido em 1909 pelo químico dinamarquês S. P. L. Sørensen, no laboratório da cervejaria Carlsberg.',
    'A escala de pH é logarítmica: uma solução de pH 3 tem 100 vezes mais H⁺ do que uma de pH 5.',
    'O suco gástrico (pH ≈ 1,4) tem cerca de 1 milhão de vezes mais H⁺ do que o sangue (pH 7,4).',
    'A 37 °C, a água pura é neutra em pH ≈ 6,8. O pH do sangue, 7,4, é levemente alcalino para a temperatura do corpo.',
    'Hortênsias mudam de cor conforme o pH do solo: azuis em solo ácido, rosadas em solo menos ácido.',
    'Até a chuva “limpa” é um pouco ácida (pH ≈ 5,6), porque o CO₂ do ar se dissolve nela e forma ácido carbônico.',
    'A palavra “álcali” vem do árabe al-qali, que se referia às cinzas de plantas usadas para fazer sabão.',
    'A enzima anidrase carbônica é uma das mais rápidas conhecidas: pode converter até cerca de um milhão de moléculas de CO₂ por segundo.'
  ];
  var factText = document.getElementById('fact-text');
  var factBtn = document.getElementById('fact-btn');
  if (factText && factBtn) {
    var last = -1;
    var next = function () {
      var i;
      do { i = Math.floor(Math.random() * facts.length); } while (i === last);
      last = i;
      factText.textContent = facts[i];
    };
    factBtn.addEventListener('click', next);
    next();
  }

  // ---------- Filtro de curiosidades ----------
  var chips = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-cat]');
  var counter = document.getElementById('fact-count');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        var shown = 0;
        cards.forEach(function (card) {
          var ok = f === 'todas' || card.getAttribute('data-cat') === f;
          card.hidden = !ok;
          if (ok) shown++;
        });
        if (counter) counter.textContent = shown + (shown === 1 ? ' curiosidade' : ' curiosidades');
      });
    });
  }
})();
