/**
 * Yandex.Metrika — номер счётчика в data-counter-id у тега script
 */
(function() {
  var script = document.currentScript;
  var counterId = script && script.getAttribute('data-counter-id');
  if (!counterId || counterId === 'YOUR_COUNTER_ID') return;

  counterId = parseInt(counterId, 10);
  if (!counterId) return;

  window.dataLayer = window.dataLayer || [];

  (function(m, e, t, r, i, k, a) {
    m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + encodeURIComponent(counterId), 'ym');

  ym(counterId, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true
  });
})();
