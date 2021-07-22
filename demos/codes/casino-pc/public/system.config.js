;(function (w) {
  const params = new Map(location.search.replace(/^\?/, '').split('&').map(kv => kv.split('=')))

  let platformUrl = decodeURIComponent(params.get('nborigin') || '');

  w.NBConfig = {
    FRONT_ID: '100771011B79v4yw',
    API_URL: 'http://casino.nbbets.com/',
    // STATIC_URL: 'http://10.96.67.62/cdn/',
    // PLATFORM_URL: platformUrl || 'http://www2.nbbets.com/',
    PLATFORM_URL: platformUrl || 'http://10.70.174.222:8084/',
  };
})(window);
