/*
[14:56, 2020年11月3日] +852 5199 0734: 
【webview与cocos交互，传递参数基本规则】
基本格式
1、 以ccjs://开始
比如，退出游戏对应 ccjs://back-normal
小游戏内部点击充值对应 ccjs://back-normal-recharge
2、如果有参数传递，使用?分割传递的参数
ccjs://back-normal-morethan20?message=您很久没有下注了，先休息一下
3、 多个参数使用&&连接

[14:56, 2020年11月3日] +852 5199 0734: 
下面是例子
function onClick(param) {
  console.log("-------web--------onClick----->>cocos JS-------------", window.isNative)
  if (window.isNative) {
    //android or ios
    document.location = 'ccjs://back-normal'；//比如，退出游戏
  } else {
    //browser 浏览器下，向cocos发送消息
    parent.postMessage("ccjs://back-normal", "*")
  }
}
*/
import { initializeStore } from '../store'

const store = initializeStore()
let iframe

const invokeShell = (command, params = null) => {
  let invokeUrl = `ccjs://${command}`

  if (params) {
    const entries = Object.entries(params)
    if (entries.length > 0) {
      invokeUrl = `${invokeUrl}?${entries.map(([k, v]) => `${k}=${v}`).join('&&')}`
    }
  }

  if (store.app.isNative) {
    if (!iframe) {
      iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    }
    iframe.src = invokeUrl
  } else {
    window.parent.postMessage(invokeUrl, "*")
  }
};

/** 充值 */
export const recharge = (params) => invokeShell('back-normal-recharge', params)
/** 退出 */
export const quit = (params) => invokeShell('back-normal', params)
/** 登录 */
export const signin = () => {
  store.toast.optionsToast(
    'message.needLogin',
    {
      variant: 'error',
      intl: true
    }
  )
}
