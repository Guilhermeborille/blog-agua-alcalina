/* quiz.js — “Mito ou fato?” */
(function () {
  'use strict';
  var root = document.getElementById('quiz');
  if (!root) return;

  var perguntas = [
    { t: 'O pH do sangue de uma pessoa saudável fica quase sempre entre 7,35 e 7,45.', fato: true,
      e: 'Fato. Essa faixa é muito estreita e é mantida o tempo todo por tampões, pulmões e rins.' },
    { t: 'Beber água com limão deixa o sangue alcalino.', fato: false,
      e: 'Mito. O limão é ácido no copo e o corpo regula o pH do sangue; o que pode mudar um pouco é o pH da urina.' },
    { t: 'O estômago é muito mais ácido do que o sangue.', fato: true,
      e: 'Fato. O suco gástrico tem pH em torno de 1,5 a 3,5, contra 7,4 do sangue.' },
    { t: 'Fitas de pH usadas na urina mostram o pH do sangue.', fato: false,
      e: 'Mito. A urina é o “escoamento” do ajuste feito pelos rins; ela varia (4,5 a 8) justamente para o sangue não variar.' },
    { t: 'Água alcalina de garrafa cura ou previne o câncer.', fato: false,
      e: 'Mito. Revisões sistemáticas não encontraram evidência de que água alcalina ou dieta alcalina previnam ou tratem câncer.' },
    { t: 'O limão tem sabor azedo principalmente por causa do ácido cítrico.', fato: true,
      e: 'Fato. O suco contém cerca de 5 a 6% de ácido cítrico (C₆H₈O₇).' },
    { t: 'O corpo usa os pulmões e os rins para manter o pH do sangue.', fato: true,
      e: 'Fato. Os pulmões ajustam o CO₂ em minutos; os rins ajustam H⁺ e bicarbonato em horas ou dias.' },
    { t: 'Comer alimentos “ácidos” causa acidose no sangue.', fato: false,
      e: 'Mito. Acidose é um quadro médico (por exemplo, cetoacidose diabética ou insuficiência renal grave), não consequência de comer limão ou tomate.' },
    { t: 'A 25 °C, a água pura tem pH 7.', fato: true,
      e: 'Fato. A 25 °C, [H⁺] = [OH⁻] = 1,0 × 10⁻⁷ mol/L, ou seja, pH 7.' },
    { t: 'Bicarbonato de sódio dissolvido em água dá uma solução levemente básica.', fato: true,
      e: 'Fato. O íon HCO₃⁻ reage um pouco com a água e libera OH⁻; uma solução de bicarbonato tem pH perto de 8,3.' }
  ];

  function embaralhar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var fila, idx, acertos, respondida;
  var elQ = root.querySelector('.q');
  var elFb = root.querySelector('.fb');
  var elBar = root.querySelector('.progress i');
  var elChoices = root.querySelector('.choices');
  var elNext = root.querySelector('.next');
  var elEnd = root.querySelector('.end');
  var elBox = root.querySelector('.box');

  function mostrar() {
    respondida = false;
    var p = fila[idx];
    elQ.textContent = (idx + 1) + '/' + fila.length + ' — ' + p.t;
    elBar.style.width = (idx / fila.length * 100) + '%';
    elFb.className = 'fb';
    elFb.textContent = '';
    elNext.hidden = true;
    elChoices.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
  }

  function responder(escolhaFato) {
    if (respondida) return;
    respondida = true;
    var p = fila[idx];
    var ok = escolhaFato === p.fato;
    if (ok) acertos++;
    elFb.className = 'fb ' + (ok ? 'ok' : 'no');
    elFb.textContent = (ok ? '✅ Acertou! ' : '❌ Não foi dessa vez. ') + p.e;
    elChoices.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    elNext.textContent = idx + 1 < fila.length ? 'Próxima →' : 'Ver resultado';
    elNext.hidden = false;
    elNext.focus();
  }

  function fim() {
    elBar.style.width = '100%';
    elBox.hidden = true;
    elEnd.hidden = false;
    var msg = acertos >= 9 ? 'Você já pensa como um químico!' :
              acertos >= 6 ? 'Muito bem! Revise os mitos que escaparam.' :
              'Vale reler as páginas de pH e de sangue — e tentar de novo.';
    elEnd.querySelector('.score').textContent = acertos + ' de ' + fila.length;
    elEnd.querySelector('.msg').textContent = msg;
  }

  function iniciar() {
    fila = embaralhar(perguntas);
    idx = 0; acertos = 0;
    elEnd.hidden = true;
    elBox.hidden = false;
    mostrar();
  }

  elChoices.querySelector('[data-r="fato"]').addEventListener('click', function () { responder(true); });
  elChoices.querySelector('[data-r="mito"]').addEventListener('click', function () { responder(false); });
  elNext.addEventListener('click', function () {
    idx++;
    if (idx < fila.length) mostrar(); else fim();
  });
  root.querySelector('.restart').addEventListener('click', iniciar);

  iniciar();
})();
