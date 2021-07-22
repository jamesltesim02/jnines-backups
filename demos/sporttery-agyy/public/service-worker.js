if (workbox) {
  workbox.precaching.precacheAndRoute(self.__precacheManifest);

  [
    // {
    //   reg: /.+common\/.+/gi,
    //   strategy: workbox.strategies.networkFirst({cacheName: 'commonData'}),
    // },
  ].forEach(function (w) {
    workbox.routing.registerRoute(w.reg, w.strategy);
  });

  console.log('Workbox already loaded');
} else {
  console.log('Workbox didn\'t load');
}


