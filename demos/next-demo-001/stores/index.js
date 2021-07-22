import { types, applySnapshot } from 'mobx-state-tree'

import devConfig from '../configs/config.dev'

import { App } from './modules/app'
import { Toast } from './modules/toast'
import { Message, Messages } from './modules/messages'

let store = null

const Store = types
  .model({
    messages: Messages,
    app: App,
    toast: Toast
  })

export const initializeStore = (isServer, snapshot = null) => {
  if (isServer || store === null) {
    const messages = Messages.create({
      list: []
    })
    // messages.add({
    //   title: '比较靠谱简单的做法就是设置相对定位的容器高度，用包含省略号（...）的元素模拟实现',
    //   content: `
    //       overflow:hidden;
    //       text-overflow:ellipsis;
    //       white-space:nowrap;
    //       （需要对容器设置单行高度）
    //       多行文本溢出显示省略号

    //       webkit浏览器或移动端的页面

    //         在webkit浏览器或移动端（绝大部分是webkit内核的浏览器）可以直接使用webkit的css扩展属性（webkit是私有属性）-webkit-line-clamp；
    //         注意：这是一个不规范的属性，它没有在CSS的规范草案中
    //         -webkit-line-clamp用来限制在一个块元素显示的文本行数，为了实现效果，他要与一下webkit属性结合使用：
    //             display:-webkit-box;（必须结合的属性，将对象作为弹性伸缩盒子模型展示）
    //             -webkit-box-orient（必须结合的属性，设置或检索伸缩盒对象的子元素的排列方式）
    //       完整版写法如下：

    //       overflow:hidden;
    //       text-overflow:ellipsis;
    //       display:-webkit-box;
    //       -webkit-line-clamp:2; (两行文字)
    //       -webkit-box-orient:vertical;
    //   `,
    //   from: '我和我最后的倔强'
    // })
    store = Store.create({
      messages,
      app: App.create({
        locale: devConfig.defaultLocale
      }),
      toast: Toast.create({ list: [] })
    })
  }

  if (snapshot) {
    applySnapshot(store, snapshot)
  }

  return store
}
