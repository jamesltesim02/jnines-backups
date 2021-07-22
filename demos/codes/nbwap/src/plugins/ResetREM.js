/**
 * 设置视口缩放比
 */
let setViewport = () => {
  let scale = 1/window.devicePixelRatio
  let viewportMeta = document.querySelector('meta[name="viewport"]')
  if(!viewportMeta) {
    viewportMeta = document.createElement('mata')
    document.querySelector('head').appendChild(viewportMeta)
  }
  
  viewportMeta.name = 'viewport'
  viewportMeta.content = `width=device-width,initial-scale=${scale},maximum-scale=${scale},user-scalable=no`;
}

let de = document.documentElement
let setRootFontSize = () => {
  de.style.fontSize = 100 * (de.clientWidth / 375) + 'px'
}


export default {
  install () {
    window.addEventListener('resize', setRootFontSize)
    document.addEventListener('DOMContentLoaded', setRootFontSize)
    // setViewport()
    setRootFontSize()
  }
}