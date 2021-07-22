import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'

import ButtonArea from '../../common/button-area'

import Market47 from './market-47'
import Market45 from './market-45'
import Market290 from './market-290'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      margin: '45px 0',
      width: 'calc(100% - 90px)',
      borderRadius: 6
    },
    header: {
      borderTop: `6px solid ${primary.main}`,
      borderBottom: '1px solid #ecebeb',
      fontSize: 15,
      fontWeight: 600,
      textAlign: 'center',
      lineHeight: '45px',
      display: 'grid',
      gridTemplateColumns: '1fr 20px 1fr',
      overflow: 'hidden',
      '& > span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    content: {
      padding: '5px 10px',
      background: '#ededed'
    },
    footer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      '& > button': {
        height: 40,
        fontSize: 14,
        textAlign: 'center',
        color: '#909090',
        borderTop: '1px solid #ecebeb',
        '&:last-child': {
          color: '#fff',
          borderTop: 0,
          backgroundColor: primary.main
        }
      }
    }
  }),
  { name: 'ChoosingMarket' }
)

const marketMap = {
  47: Market47,
  45: Market45,
  290: Market290
}


const ChoosingMarket = ({
  store: { matchs }
}) => {
  const classes = useStyles()

  const { match, market } = matchs.choosing
  const names = (match.matchName || '').split(' vs ')
  const handleClose = () => matchs.setChoosing(null)

  const Market = marketMap[market.marketType]

  return (
    <Dialog
      open={matchs.isChoosing}
      classes={{ paper: classes.root }}
      onClose={handleClose}
    >
      <header className={classes.header}>
        <span>{names[0]}(主)</span>
        <span>vs</span>
        <span>{names[1]}(客)</span>
      </header>
      <section className={classes.content}>
      {
        Market ? (
          <Market
            names={names}
            match={match}
            market={market}
          />
        ) : null
      }
      </section>
      <footer className={classes.footer}>
        <ButtonArea onClick={handleClose}>关闭</ButtonArea>
        <ButtonArea
          ripple="white"
          onClick={handleClose}
        >确定</ButtonArea>
      </footer>
    </Dialog>
  )
}

export default inject('store')(
  observer(ChoosingMarket)
)
