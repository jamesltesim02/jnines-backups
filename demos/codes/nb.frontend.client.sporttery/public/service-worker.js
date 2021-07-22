if (workbox) {
  self.__precacheManifest.splice(
    self.__precacheManifest.findIndex(item => item.url === '/index.html'),
    1
  )
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  console.log('Workbox already loaded');
} else {
  console.log('Workbox didn\'t load');
}
