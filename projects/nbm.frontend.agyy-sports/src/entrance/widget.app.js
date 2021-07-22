import React from 'react'

import { Provider } from 'mobx-react'
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline'
import { makeStyles } from '@material-ui/core/styles'

import { initializeStore } from '../store'

import LocaleProvider from '../components/common/locale-provider'
import MemberInitialer from '../components/common/member-initialer'

// import MatchInitialer from './components/matchs/match-initialer'


const useStyles = makeStyles(
  {
    root: {
      fontSize: 16
    }
  },
  {name: 'NBBetWidget' }
)

// 状态管理对象
const store = initializeStore()

function WidgetApp ({
  token,
  locale = 'zh',
  clientType,
  events = {}
}) {
  const classes = useStyles()

  store.app.initAppStore({
    clientType,
    locale
  })
  store.member.setTempToken(token)

  return (
    // {/* 皮肤信息统一处理层 */}
    <ScopedCssBaseline classes={classes}>
      {/* 全局状态容器 */}
      <Provider store={store}>
        {/* 语言provider */}
        <LocaleProvider>
          {/* 用户信息初始化控件 */}
          <MemberInitialer>
            <div>bet widget</div>
          </MemberInitialer>
        </LocaleProvider>
      </Provider>
    </ScopedCssBaseline>
  )
}

export default WidgetApp
