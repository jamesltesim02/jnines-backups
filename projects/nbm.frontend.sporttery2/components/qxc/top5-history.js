import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

import { dateFormat } from '../../utils/get-locale-date'

import IconArrow from '../icons/icon-arrow'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

import HistoryList from './history-list'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    header: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      fontSize: 12,
      lineHeight: '35px',
      background: '#eee',
      color: '#000',
      whiteSpace: 'nowrap',
      '& > li:first-child': {
        paddingLeft: 10
      },
      '& > li:nth-child(2)': {
        textAlign: 'center'
      },
      '& > li:last-child': {
        textAlign: 'right',
        paddingRight: 10,
      }
    },
    expandIcon: {
      marginLeft: 7,
      '&::before': {
        borderColor: '#000',
        height: 7,
        width: 7
      }
    },
    records: {
      '& > li': {
        height: 40
      }
    },
    oprs: {
      marginTop: -10,
      marginBottom: 10,
      display: 'flex',
      lineHeight: '40px',
      background: '#fff',
      justifyContent: 'space-between',
      fontSize: 12,
      '& button': {
        width: 'unset'
      }
    },
    moreButton: {
      padding: '0 10px',
      color: primary.main,
      '& i': {
        height: 13,
        width: 13,
        marginLeft: 5,
        verticalAlign: 'middle',
        border: `1px solid ${primary.main}`,
        borderRadius: '50%',
        '&::before': {
          transform: 'translate(2px, 3px) rotate(45deg)',
          width: 5,
          height: 5,
          borderColor: primary.main
        }
      }
    },
    closeButton: {
      padding: '0 10px',
    }
  }),
  { name: 'Top5History' }
)

const Top5History = ({
  store: { qxc },
}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  return (
    <section>
      <ButtonArea onClick={() => {
        if (!qxc.top5.length) {
          return
        }
        setOpen(!open)
      }}>
        <ul className={classes.header}>
          <li>第{qxc.issue || '00000000000'}期</li>
          <li>投注截止: {dateFormat(qxc.offTime || new Date(), 'MM-dd HH:mm')}</li>
          {
            qxc.top5.length ? (
              <li>
                最近{qxc.top5.length}期历史
                <IconArrow
                  direction={open ? 'top' : 'bottom'}
                  className={classes.expandIcon}
                />
              </li>
            ) : null
          }
        </ul>
      </ButtonArea>
      <Collapse in={open}>
        <HistoryList
          list={qxc.top5}
          type={1}
          className={classes.records}
        />
        <div className={classes.oprs}>
          <LocaledLink href="/qxc/history">
            <ButtonArea
              className={classes.moreButton}
            >
              <div>
                查看更多开奖历史
                <IconArrow direction="right" />
              </div>
            </ButtonArea>
          </LocaledLink>
          <ButtonArea
            className={classes.closeButton}
            onClick={() => setOpen(false)}
          >
            <div>
              收缩
              <IconArrow
                direction="top"
                className={classes.expandIcon}
              />
            </div>
          </ButtonArea>
        </div>
      </Collapse>
    </section>
  )
}

export default inject('store')(
  observer(Top5History)
)
