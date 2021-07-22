const imgContext = require.context("../icon-sports",true, /^\.\/.*\.png$/);

function sportsImgBase64(name = './football.png') {
  return imgContext.keys().filter(v=>v === name).map(imgContext)[0]
}

export default sportsImgBase64;