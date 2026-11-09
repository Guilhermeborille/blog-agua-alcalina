/* lab.js — simuladores do laboratório (didáticos, modelos simplificados) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function sup(n) { return String(n).split('').map(function (c) { return SUP[c] || c; }).join(''); }
  function sci(x) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log10(x));
    var m = x / Math.pow(10, e);
    if (m.toFixed(1) === '10.0') { m = 1; e++; }
    return m.toFixed(1).replace('.', ',') + ' × 10' + sup(e);
  }
  function br(n, d) { return n.toFixed(d).replace('.', ','); }

  var CORES = ['#d7263d', '#e8453c', '#ef6a3a', '#f58f3b', '#f7b13c', '#f4d13f', '#cfe04a', '#7fc97f', '#4fb8a4', '#3aa0c0', '#3b82c4', '#4a64b8', '#5a4ca8', '#6b3e98', '#7a2f88'];
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function corPH(ph) {
    var p = Math.max(0, Math.min(14, ph));
    var i = Math.min(13, Math.floor(p));
    var f = p - i;
    var a = hex(CORES[i]), b = hex(CORES[i + 1]);
    return 'rgb(' + a.map(function (v, k) { return Math.round(v + (b[k] - v) * f); }).join(',') + ')';
  }

  /* ---------------- 1) Escala de pH ---------------- */
  var EXEMPLOS = [
    ['Ácido de bateria', 0.5], ['Suco gástrico', 2], ['Limão', 2.3], ['Refrigerante de cola', 2.5], ['Vinagre', 2.9],
    ['Suco de laranja', 3.5], ['Tomate', 4.3], ['Café', 5], ['Chuva “limpa”', 5.6], ['Leite', 6.6], ['Saliva', 6.8],
    ['Água pura (25 °C)', 7], ['Sangue humano', 7.4], ['Água do mar', 8.1], ['Solução de bicarbonato', 8.3],
    ['Sabão', 10], ['Leite de magnésia', 10.5], ['Amônia doméstica', 11.5], ['Água sanitária', 12.5], ['Soda cáustica (forte)', 14]
  ];
  var s1 = $('ph-slider');
  if (s1) {
    var render1 = function () {
      var ph = parseFloat(s1.value);
      var h = Math.pow(10, -ph), oh = Math.pow(10, ph - 14);
      $('ph-val').textContent = br(ph, 1);
      $('ph-big').textContent = br(ph, 1);
      $('ph-big').style.color = corPH(ph);
      $('ph-h').textContent = sci(h) + ' mol/L';
      $('ph-oh').textContent = sci(oh) + ' mol/L';
      var cls = ph < 6.95 ? 'ácida' : ph > 7.05 ? 'básica (alcalina)' : 'neutra';
      $('ph-class').textContent = cls;
      var razao = Math.pow(10, 7.4 - ph);
      var txt;
      if (Math.abs(ph - 7.4) < 0.05) txt = 'igual ao do sangue';
      else if (razao > 1) txt = (razao >= 1000 ? sci(razao) : br(razao, 1)) + '× mais H⁺ que o sangue';
      else txt = (1 / razao >= 1000 ? sci(1 / razao) : br(1 / razao, 1)) + '× menos H⁺ que o sangue';
      $('ph-vs').textContent = txt;
      $('ph-pin').style.left = (ph / 14 * 100) + '%';
      $('ph-pin').setAttribute('data-v', br(ph, 1));
      var perto = EXEMPLOS.slice().sort(function (a, b) { return Math.abs(a[1] - ph) - Math.abs(b[1] - ph); }).slice(0, 3);
      $('ph-ex').textContent = perto.map(function (x) { return x[0] + ' (≈ ' + br(x[1], 1) + ')'; }).join(' · ');
    };
    s1.addEventListener('input', render1);
    render1();
  }

  /* ---------------- 2) Água com limão ---------------- */
  var CIT_G100 = 5.5;               // g de ácido cítrico por 100 mL de suco
  var CIT_M = CIT_G100 * 10 / 192.12; // mol/L no suco
  var K_M = 0.03;                    // mol/L de cátions (K⁺) no suco
  var KA = [Math.pow(10, -3.13), Math.pow(10, -4.76), Math.pow(10, -6.40)];
  var KW = 1e-14;

  function fcarga(h, C, K) {
    var d = h * h * h + KA[0] * h * h + KA[0] * KA[1] * h + KA[0] * KA[1] * KA[2];
    var a1 = KA[0] * h * h / d, a2 = KA[0] * KA[1] * h / d, a3 = KA[0] * KA[1] * KA[2] / d;
    return h + K - C * (a1 + 2 * a2 + 3 * a3) - KW / h;
  }
  function phLimao(vAgua, vSuco) {
    var vt = vAgua + vSuco;
    var C = CIT_M * vSuco / vt, K = K_M * vSuco / vt;
    var lo = 0, hi = 14;
    for (var i = 0; i < 80; i++) {
      var mid = (lo + hi) / 2;
      if (fcarga(Math.pow(10, -mid), C, K) > 0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  var sa = $('lim-agua'), sj = $('lim-suco');
  if (sa && sj) {
    var render2 = function () {
      var va = parseFloat(sa.value), vj = parseFloat(sj.value);
      $('lim-agua-v').textContent = va + ' mL';
      $('lim-suco-v').textContent = vj + ' mL';
      var ph = phLimao(va, vj);
      $('lim-ph').textContent = br(ph, 2);
      $('lim-ph').style.color = corPH(ph);
      $('lim-pin').style.left = (ph / 14 * 100) + '%';
      $('lim-pin').setAttribute('data-v', br(ph, 2));
      var cit = CIT_M * vj / (va + vj);
      $('lim-cit').textContent = br(cit * 1000, 1) + ' mmol/L';
      var msg;
      if (vj === 0) msg = 'Sem limão, é só água pura (pH 7 neste modelo; a água da torneira real costuma estar entre 6 e 8).';
      else if (ph < 5.5) msg = 'Abaixo de pH ≈ 5,5 o esmalte dos dentes pode começar a ser desmineralizado se o contato for frequente ou prolongado. Dica: use canudo e enxágue a boca com água. Seu sangue, porém, continua em 7,35–7,45.';
      else msg = 'Pouco ácida. Seu sangue continua em 7,35–7,45.';
      $('lim-msg').textContent = msg;
    };
    sa.addEventListener('input', render2);
    sj.addEventListener('input', render2);
    render2();
  }

  /* ---------------- 3) Tampão do sangue ---------------- */
  var sb = $('bl-hco3'), sc = $('bl-pco2');
  if (sb && sc) {
    var render3 = function () {
      var hco3 = parseFloat(sb.value), pco2 = parseFloat(sc.value);
      $('bl-hco3-v').textContent = hco3 + ' mEq/L';
      $('bl-pco2-v').textContent = pco2 + ' mmHg';
      var ph = 6.1 + Math.log10(hco3 / (0.03 * pco2));
      $('bl-ph').textContent = br(ph, 2);
      $('bl-ph').style.color = corPH(ph);
      $('bl-ratio').textContent = br(hco3 / (0.03 * pco2), 1) + ' : 1';
      $('bl-pin').style.left = (ph / 14 * 100) + '%';
      $('bl-pin').setAttribute('data-v', br(ph, 2));
      var st = $('bl-status'), msg;
      st.className = 'status';
      if (ph < 6.8 || ph > 7.8) {
        st.classList.add('warn'); st.textContent = 'incompatível com a vida';
        msg = 'Fora de aproximadamente 6,8–7,8 o corpo humano não consegue funcionar. Valores assim só aparecem em emergências médicas graves.';
      } else if (ph < 7.35) {
        st.classList.add('warn'); st.textContent = 'acidose';
        msg = 'pH abaixo de 7,35. Pode vir de HCO₃⁻ baixo (acidose metabólica, como na cetoacidose diabética) ou de CO₂ alto (acidose respiratória). É condição médica, não efeito de dieta.';
      } else if (ph > 7.45) {
        st.classList.add('mid'); st.textContent = 'alcalose';
        msg = 'pH acima de 7,45. Pode vir de HCO₃⁻ alto (alcalose metabólica, como em vômitos intensos) ou de CO₂ baixo (hiperventilação). Também é condição médica.';
      } else {
        st.textContent = 'faixa normal';
        msg = 'Dentro de 7,35–7,45. Repare que o pH depende da razão entre bicarbonato e CO₂, não de um valor isolado.';
      }
      $('bl-msg').textContent = msg;
    };
    sb.addEventListener('input', render3);
    sc.addEventListener('input', render3);
    document.querySelectorAll('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-preset').split(',');
        sb.value = p[0]; sc.value = p[1];
        render3();
      });
    });
    render3();
  }
})();
