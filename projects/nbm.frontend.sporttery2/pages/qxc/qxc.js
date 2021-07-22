import React from 'react'
import { inject, observer } from 'mobx-react'
import { withLocaledRouter } from '../../components/common/localed-router'

import QxcHeader from '../../components/qxc/qxc-header'
import Top5History from '../../components/qxc/top5-history'
import Game from '../../components/qxc/game'

import BetBar from '../../components/qxc/bet-bar'
import BetDialog from '../../components/qxc/bet-dialog'

import QxcInitialer from '../../components/qxc/qxc-initialer'
import { multiSplit } from '../../utils/qxc-utils'

/** 默认玩法类型: 一定 */
const DEFUALT_TYPE = 11
const QxcPage = ({
  store: { qxc: store },
  localedRouter,
  query = {}
}) => {

  const type = (+query.type) || DEFUALT_TYPE
  const [betting, setBetting] = React.useState(false)
  const [value, setValue] = React.useState(null)
  const [betCount, setBetCount] = React.useState(0)

  const handleTypeChange = type => {
    localedRouter.replace(`/qxc?group=${store.group}&type=${type}`)
    handleValueChange(null)
  }

  const handleValueChange = value => {
    setValue(value)
    setBetCount(
      value ? multiSplit(value, type).length : 0
    )
  }

  return (
    <>
      <QxcInitialer />
      <QxcHeader
        value={type}
        onChange={handleTypeChange}
      />
      <Top5History />
      <Game
        type={type}
        value={value}
        onChange={handleValueChange}
      />
      <BetBar
        count={betCount}
        onClear={() => setValue(null)}
        onBet={() => setBetting(!betting)}
      />
      <BetDialog
        open={betting}
        type={type}
        count={betCount}
        options={value}
        onClose={() => setBetting(false)}
        onSuccess={() => {
          setBetting(false)
          setValue(null)
          setBetCount(0)
        }}
      />
    </>
  )
}

QxcPage.getInitialProps = ({ query }) => ({ query })

export default inject('store')(
  observer(
    withLocaledRouter(QxcPage)
  )
)
