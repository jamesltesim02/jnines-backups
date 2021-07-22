import './toast.css'

// toast容器
const toasterConatiner = document.createElement('div')
// toast内容
const toasterContent = document.createElement('div')
// icon
const toastIcon = document.createElement('i')

toasterConatiner.className = 'nb-toaster-container'
toasterContent.className = 'nb-toaster-content'
toastIcon.className = 'nb-toaster-icon'
toastIcon.innerHTML= 'i'

toasterConatiner.appendChild(toastIcon)
toasterConatiner.appendChild(toasterContent)
document.querySelector('body').appendChild(toasterConatiner)

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

// 清除toast的timer
let durationTimer = null
let viewing = false

export default async (conf) => {
  let {
    msg='',
    type='sucess',
    duration=2000
  } = (
    typeof conf === 'string'
      ? {
          msg: conf
        } 
      : conf
  )

  if (!msg) {
    return
  }

  toasterContent.innerHTML = msg
  clearTimeout(durationTimer)

  // 如果当前没有在显示中,则实现出场动画
  if(!viewing) {
    toasterConatiner.className = 'nb-toaster-container nb-toaster-container-viewing'
    await sleep(0)
    toasterConatiner.className = 'nb-toaster-container nb-toaster-container-in'
    viewing = true
  }

  // duration时间之后关闭toast显示
  durationTimer = setTimeout(async () => {
    toasterConatiner.className = 'nb-toaster-container nb-toaster-container-leaveing'
    await sleep(300)
    toasterConatiner.className = 'nb-toaster-container'
    toasterContent.innerHTML = ''
    viewing = false
  }, duration)
}