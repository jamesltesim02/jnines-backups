import Vue from 'vue'

import Row from '@/components/common/Row'
import IconBack from '@/components/common/icons/IconBack'
import CdnImg from '@/components/common/CdnImg'

const install = () => {
  // 图标
  Vue.component('icon-back', IconBack)
  // 普通容器
  Vue.component('row', Row)
  Vue.component('cdn-img', CdnImg)
}

export default {install}