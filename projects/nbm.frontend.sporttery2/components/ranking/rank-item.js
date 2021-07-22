import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

import IconTop from '../icons/icon-top'
import IconAvatar from '../icons/icon-avatar'

const itemStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: '20px 50px 1fr 100px',
      alignItems: 'center',
      height: 56,
      fontWeight: 500,
      backgroundColor: '#fff',
      padding: '0 15px',
    },
    icon: {
      width: 35,
      height: 35,
      marginLeft: 15
    },
    content: {
      padding: '0 10px',
      fontSize: 13,
    },
    value: {
      textAlign: 'right',
      lineHeight: '14px',
      '& > span': {
        display: 'block',
        lineHeight: '14px',
        fontSize: 14,
        color: '#e71f17',
      },
      '& > label': {
        color: '#666',
        marginRight: -4
      }
    }
  },
  { name: 'RankItem' }
)
const RankItem = ({
  item,
  rank,
  type,
  classes = itemStyles()
}) => {
  return (
    <LocaledLink href={`/gurus/master?id=${item.userName}`}>
      <ButtonArea>
        <div className={classes.root}>
          <IconTop top={rank} />
          <IconAvatar
            size={35}
            index={item.header}
            style={{marginLeft: 15}}
          />
          <span className={classes.content}>
            {item.nickName}
          </span>
          <div className={classes.value}>
            <span>
            {
              ['profit'].includes(type)
              ? `${parseInt(item.value * 100) || 0}%`
              : parseInt(item.value) || 0
            }
            </span>
            <SmallFont
              tag="label"
              size={9}
            >
              <M id={`ranking.${type}`} />
            </SmallFont>
          </div>
        </div>
      </ButtonArea>
    </LocaledLink>
  )
}

export default RankItem
