if (workbox) {
  self.__precacheManifest.splice(
    self.__precacheManifest.findIndex(item => item.url === '/index.html'),
    1
  )
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  // 缓存策略: networkFirst、cacheFirst、staleWhileRevalidate
  workbox.routing.registerRoute(
    /^\/(portal|match)\/.+/,
    workbox.strategies.networkFirst()
  );
  console.log('Workbox already loaded');
} else {
  console.log('Workbox didn\'t load');
}
