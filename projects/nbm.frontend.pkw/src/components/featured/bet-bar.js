import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { chips } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import { withApi } from '../../api'

import ButtonArea from '../common/button-area'

import IconChips from '../icons/icon-chips'
import toast from '../../store/modules/toast'

const useStyles = makeStyles(
  {
    container: {
      height: 50
    },
    root: {
      position: 'fixed',
      bottom: 0,
      height: 50,
      width: '100%',
      backgroundColor: '#021b32',
      boxShadow: '0px -1px 20px 1px rgba(0, 0, 0, .75)',
      display: 'grid',
      gridTemplateColumns: '1fr 130px',
      transition: 'all .2s ease-in',
      alignItems: 'center'
    },
    tabs: {
      alignItems: 'flex-end',
      transform: 'translateY(-10px)'
    },
    tabsContainer: {
      height: 50,
      alignItems: 'flex-end'
    },
    indicator: {
      display: 'none'
    },
    tab: {
      padding: 0,
      minWidth: 'auto',
      margin: '0 4px',
      height: 30,
      minHeight: 30,
      maxHeight: 30,
      borderRadius: '50%',
      overflow: 'visible',
      color: 'rgba(0, 0, 0, 0)',
      transition: 'all .2s ease-in',
      opacity: .6,
      '&:first-child': {
        marginLeft: 10
      },
      '&:last-child': {
        marginRight: 0
      }
    },
    tabWrapper: {
      transition: 'all .2s ease-in'
    },
    selectedWrapper: {
      transform: 'translateY(-15px)'
    },
    button: {
      display: 'inline-block',
      height: 30,
      padding: 0,
      backgroundColor: '#007701',
      fontSize: 13,
      color: '#fff000',
      width: 50,
      textAlign: 'center',
      borderRadius: 4,
      marginLeft: 10
    },
    cancelButton: {
      backgroundColor: '#777',
      color: '#fff'
    },
    buttonRipple: {
      color: '#fff'
    }
  },
  {
    name: 'BetBar'
  }
)

function BetBar ({
  store: {
    app,
    featured,
    toast
  },
  api: { bet }
}) {
  const classes = useStyles()
  const [value, setValue] = React.useState((featured.chip || {}).value || chips[0])

  // 选中筹码变化事件
  const handleChipChange = ({ target }, value) => {
    setValue(value)
    setTimeout(() => {
      featured.setChip({
        value,
        ...target.getBoundingClientRect().toJSON()
      })
    }, 230)
  }

  // 页面初始化时触发第一个筹码为默认选中项
  const rootRef = React.useRef(null)
  React.useEffect(() => {
    const firstIcon = rootRef.current.querySelector('button:first-child i')
    handleChipChange({ target: firstIcon }, chips[0])
  }, [])

  // 执行投注操作
  const doBet = async () => {

    // 获取当前有
    const { options } = featured.matchinfo
    const activeOptions = options.filter(({ willBetAmount }) => willBetAmount > 0)
    if (!activeOptions.length) {
      return
    }

    // TODO 点水

    // 投注
    await bet.doBet({
      autoTransfer: true,
      accept: app.oddsAC,
      betItems: activeOptions.map(({
        optionId,
        willBetAmount,
        odds
      }) => ({
        betType: 1,
        bets: [{
          betM: 1,
          betN: 1,
          betCount: 1,
          betAmount: willBetAmount
        }],
        options: [{ optionId, odds }]
      }))
    })

    toast.success('提交成功')

    activeOptions.forEach(option => {
      option.setBetsuccess()
    })

    setTimeout(() => {
      activeOptions.forEach(option => {
        option.updateLiveAmount()
      })
    }, 300)
  }

  return (
    <div
      ref={rootRef}
      className={classes.container}
    >
      <section className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChipChange}
          variant="scrollable"
          scrollButtons="auto"
          classes={{
            root: classes.tabs,
            flexContainer: classes.tabsContainer,
            indicator: classes.indicator
          }}
        >
          {
            chips.map(c => (
              <Tab
                key={c}
                value={c}
                icon={
                  <IconChips
                    type={c}
                    size={c === value ? 45 : 30}
                  />
                }
                classes={{
                  root: classes.tab,
                  textColorPrimary: classes.textColorPrimary,
                  wrapper: mergeClass(
                    classes.tabWrapper,
                    c === value ? classes.selectedWrapper : null
                  )
                }}
              />
            ))
          }
        </Tabs>
        <div>
          <ButtonArea
            variant="contained"
            classes={{
              root: mergeClass(classes.button, classes.cancelButton),
              ripple: classes.buttonRipple
            }}
            onClick={featured.cancelBet}
          >取消</ButtonArea>
          <ButtonArea
            variant="contained"
            classes={{
              root: classes.button,
              ripple: classes.buttonRipple
            }}
            onClick={doBet}
          >投注</ButtonArea>
        </div>
      </section>
    </div>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(BetBar)
  )
)
