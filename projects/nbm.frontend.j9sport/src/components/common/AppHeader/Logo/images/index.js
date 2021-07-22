const imgContext = require.context('./',true, /^\.\/.*\.png$/);

function logoImage(name = './10077100werw564wesfx.png') {
  return imgContext.keys().filter(v=>v === name).map(imgContext)[0]
}

export default logoImage;