import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import SubPage from '../../components/common/sub-page'
import TabMenu from '../../components/common/tab-menu'

import HistoryList from '../../components/qxc/history-list'
import QxcInitialer from '../../components/qxc/qxc-initialer'

const useStyles = makeStyles(
  {
    graphic: {
      position: 'relative',
      marginTop: 10,
      padding: '0 10px 10px',
      background: '#fff',
      display: 'grid',
      gridTemplateColumns: 'calc((100vw - 20px) * (110/710)) 1fr',
      lineHeight: 'calc((100vw - 20px) * (60/710))',
      fontSize: 'calc((100vw - 20px) * (30/710))',
      color: '#828282',
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'inline-block',
        top: 0,
        left: 0,
        width: '200%',
        height: 1,
        background: '#ddd',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
      '& > ul': {
        textAlign: 'right',
        paddingRight: 10,
        '& > li': {
          height: 'calc((100vw - 20px) * (60/710))',
        }
      },
      '& > div': {
        display: 'grid',
        gridTemplateRows: 'calc((100vw - 20px) * (60/710)) 1fr',
      },
      '& header': {
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        textAlign: 'center'
      },
      '& section': {
        position: 'relative',
        backgroundColor: '#fff',
        lineHeight: 0,
        '& > ul': {
          position: 'absolute',
          height: '100%',
          width: '100%',
          lineHeight: 0,
          zIndex: 0,
          top: 0,
          left: 0,
          '& > li:nth-child(odd) > i:nth-child(odd),& > li:nth-child(even) > i:nth-child(even)': {
            background: '#f6f6f6'
          },
          '&::before, &::after': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            background: '#ddd',
            top: 0,
            left: 0,
            transformOrigin: 'left top',
            transform: 'scale(.5)',
            zIndex: 2,
          },
          '&::before': {
            width: 1,
            height: '200%',
          },
          '&::after': {
            height: 1,
            width: '200%',
          }
        },
        '& i': {
          position: 'relative',
          display: 'inline-block',
          height: 'calc((100vw - 20px) * (60/710))',
          width: 'calc((100vw - 20px) * (60/710))',
          '&::before, &::after': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            background: '#ddd',
            right: 0,
            bottom: 0,
            transformOrigin: 'right bottom',
            transform: 'scale(.5)'
          },
          '&::before': {
            width: 1,
            height: '200%',
          },
          '&::after': {
            height: 1,
            width: '200%',
          }
        },
        '& > svg': {
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
        }
      }
    },
    svg: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      lineHeight: 'unset',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        background: '#ccf',
      }
    },
  },
  { name: 'TrendPage' }
)

const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const Graphic = ({
  tab,
  list
}) => {
  const classes = useStyles()

  return (
    <section className={classes.graphic}>
      <ul className={classes.left}>
        <li>&nbsp;</li>
        {
          list.map(item => (
            <li key={item.issueNum}>
              {item.issueNum.substr(-3)}期
            </li>
          ))
        }
      </ul>
      <div>
        <header>
          {
            xValues.map(v => (
              <var key={v}>{v}</var>
            ))
          }
        </header>
        <section>
          <ul>
            {
              list.map(({ issueNum }) => (
                <li key={issueNum}>
                  {xValues.map(v => <i key={v} />)}
                </li>
              ))
            }
          </ul>
          <svg viewBox={`0 0 600 ${60 * list.length}`}>
            <polyline
              points={
                list.map(
                  (item, i) => `${30 + (item.lotteryResult.charAt(+tab) * 60)} ${30 + (i * 60)}`
                ).join(',')
              }
              stroke="#ffcc66"
              strokeWidth="4"
              fill="none"
            />
            <g>
              {list.map((item, i) => {
                const baseY = i * 60
                const baseX = item.lotteryResult.charAt(+tab) * 60
                return (
                  <g key={item.issueNum}>
                    <circle
                      cy={30 + baseY}
                      cx={30 + baseX}
                      r="20"
                      stroke="#fb7032"
                      strokeWidth="1"
                      fill="#fc8a6f"
                    />
                    <text
                      y={38 + baseY}
                      x={30 + baseX}
                      textAnchor="middle"
                      fontSize="24"
                      fill="#fff"
                    >{item.lotteryResult.charAt(+tab)}</text>
                    <path
                      d={
                        [
                          `M ${35 + baseX} ${16 + baseY}`,
                          `Q ${40 + baseX} ${16 + baseY}`,
                          `${42 + baseX} ${23 + baseY}`
                        ].join(' ')
                      }
                      stroke="#fdb8a8"
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>
                )
              })}
            </g>
          </svg>
        </section>
      </div>
    </section>
  )
}

const menus = [
  {
    value: -1,
    label: '开奖'
  },
  {
    value: '0',
    label: '千位'
  },
  {
    value: '1',
    label: '百位'
  },
  {
    value: '2',
    label: '十位'
  },
  {
    value: '3',
    label: '个位'
  },
]

const TrendPage = ({
  store: { qxc }
}) => {

  const [tab, setTab] = React.useState(menus[0].value)

  return (
    <SubPage
      title="走势图"
      padding={0}
    >
      <QxcInitialer />
      <TabMenu
        menus={menus}
        value={tab}
        fixed
        onChange={setTab}
      />
      {
        tab === -1 ? (
          <HistoryList
            list={qxc.history}
            type={1}
          />
        ) : (
          <Graphic
            list={qxc.history}
            tab={tab}
          />
        )
      }
    </SubPage>
  )
}

export default inject('store')(
  observer(TrendPage)
)
