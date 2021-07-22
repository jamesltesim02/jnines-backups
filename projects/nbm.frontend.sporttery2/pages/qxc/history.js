import React from 'react'
import { inject, observer } from 'mobx-react'

import SubPage from '../../components/common/sub-page'
import TabMenu from '../../components/common/tab-menu'

import QxcInitialer from '../../components/qxc/qxc-initialer'
import HistoryList from '../../components/qxc/history-list'

const menus = [
  {
    value: 1,
    label: '显示号码'
  },
  {
    value: 2,
    label: '显示大小'
  },
  {
    value: 3,
    label: '显示单双'
  }
]

const HistoryPage = ({
  store: { qxc: store }
}) => {
  const [tab, setTab] = React.useState(menus[0].value)

  return (
    <SubPage
      title="开奖历史"
      padding={0}
    >
      <QxcInitialer />
      <TabMenu
        menus={menus}
        value={tab}
        fixed
        onChange={setTab}
      />
      <HistoryList
        list={store.history}
        type={tab}
        timeAvailable
      />
    </SubPage>
  )
}

HistoryPage.getInitialProps = ({ query }) => ({ query })

export default inject('store')(
  observer(HistoryPage)
)
