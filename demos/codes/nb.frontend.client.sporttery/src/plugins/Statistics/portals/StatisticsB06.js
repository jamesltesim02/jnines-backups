export default () => {
  const el = document.createElement('script');
  const {
    protocol,
    host,
  } = window.location;
  el.src = `${protocol}//${host}/portals/B06/tingyun-rum.js`;
  document.body.appendChild(el);

  const gl = document.createElement('script');
  gl.src = 'https://www.googletagmanager.com/gtag/js?id=UA-139134371-1';
  gl.addEventListener('load', () => {
    let { dataLayer } = window;
    if (!dataLayer) {
      dataLayer = [];
      window.dataLayer = dataLayer;
    }
    function gtag(...params) {
      dataLayer.push(params);
    }
    gtag('js', new Date());

    gtag('config', 'UA-139134371-1');
  });
  document.body.appendChild(gl);
};
