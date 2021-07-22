const headElement = document.getElementsByTagName('head')[0]

/**
 * 加载js文件
 *
 * @param {string} src
 *    js地址
 */
export function loadScript (src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    script.src = src
    headElement.appendChild(script)
  })
}

/**
 * 加载样式文件
 *
 * @param {string} href
 *    样式文件地址
 */
export function loadStyle (href) {
  return new Promise((resolve, reject) => {
    let styleLink = document.createElement('link')
    styleLink.rel = 'stylesheet'
    styleLink.href = href
    styleLink.addEventListener('load', resolve)
    styleLink.addEventListener('error', reject)
    headElement.appendChild(styleLink)
  })
}

/**
 * 插入js代码到页面中
 *
 * @param {string} script
 *    js代码
 */
export function writeScript (script) {
  return new Promise((resolve, reject) => {
    let ffe = document.createElement('script')
    ffe.innerHTML = script
    ffe.addEventListener('load', resolve)
    ffe.addEventListener('error', reject)
    headElement.appendChild(ffe)
  })
}

/**
 * 插入样式代码到页面中
 *
 * @param {string} style
 *      样式代码
 */
export function writeStyle (style) {
  return new Promise((resolve, reject) => {
    let ffe = document.createElement('style')
    ffe.innerHTML = style
    ffe.addEventListener('load', resolve)
    ffe.addEventListener('error', reject)
    headElement.appendChild(ffe)
  })
}
