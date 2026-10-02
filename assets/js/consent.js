// Google Analytics behind explicit consent (Consent Mode, basic implementation): nothing from Google
// is requested until the visitor accepts. The choice itself is kept in localStorage.
(function () {
  var banner = document.getElementById('consent');
  if (!banner) return;
  var id = banner.getAttribute('data-ga-id'), KEY = 'analytics-consent', loaded = false;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', id);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  // Withdrawing consent: stop GA for this page and remove the cookies it set.
  function unload() {
    window['ga-disable-' + id] = true;
    if (window.gtag) gtag('consent', 'update', { analytics_storage: 'denied' });
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', location.hostname, '.' + location.hostname].forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function choose(v) {
    save(v);
    banner.hidden = true;
    if (v === 'granted') load(); else unload();
  }

  banner.querySelector('[data-consent="accept"]').addEventListener('click', function () { choose('granted'); });
  banner.querySelector('[data-consent="decline"]').addEventListener('click', function () { choose('denied'); });
  document.querySelectorAll('[data-consent-open]').forEach(function (el) {
    el.hidden = false;
    el.addEventListener('click', function () { banner.hidden = false; });
  });

  // Global Privacy Control counts as "no" until the visitor explicitly says otherwise.
  var state = read(), gpc = navigator.globalPrivacyControl === true;
  if (state === 'granted') load();
  else if (state === null && !gpc) banner.hidden = false;
})();
