/**
 * 设置视口缩放比
 */
const de = document.documentElement
const setRootFontSize = () => {
  // de.style.fontSize = `${100 * (de.clientWidth / 375)}px`
  de.style.fontSize = '100px'
}

export default {
  install () {
    window.addEventListener('resize', setRootFontSize)
    document.addEventListener('DOMContentLoaded', setRootFontSize)
    setRootFontSize()
  }
}
