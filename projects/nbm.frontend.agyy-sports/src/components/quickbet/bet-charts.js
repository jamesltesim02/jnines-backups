import React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'

const chartsStyles = makeStyles(
  {
    root: {
      width: '100%',
      height: '100%'
    },
  },
  { name: 'BetCharts' }
)

// 报表
const BetCharts = ({
  match: {
    betStatistics : bets = {},
    sportId
  }
}) => {
  const classes = chartsStyles()
  const intl = useIntl()

  const chartsEl = React.useRef()

  React.useEffect(
    () => {
      // 报表相关字段
      const charMarkets = [
        {
          key: '16',
          options: ['1', '2'],
        },
        {
          key: '18',
          options: ['Over', 'Under']
        },
        ({
          10: {
            key: '1',
            options: ['X', '2', '1']
          },
          11: {
            key: '186',
            options: ['2', '1']
          }
        })[sportId]
      ]

      const option = {
        title: {
          text: intl.formatMessage({ id: 'preview.chartTitle' }),
          top: 10,
          left: 'center',
          textStyle: {
            fontSize: 11,
            color: '#aaa'
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 10,
        //   top: 40,
        //   textStyle: {
        //     color: '#aaa',
        //     textShadowColor: '#333',
        //     textShadowBlur: 1
        //   },
        //   data: ['让分', '大小', '独赢', '让球', '受让', '大', '小', '主', '和', '客'],
        // },
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '25%'],
            label: {
              position: 'inner',
              fontSize: 8
            },
            labelLine: {
              show: false
            },
            data: charMarkets.map(
              m => ({
                value: m.options.reduce(
                  (value, current) => value + (bets[`${m.key}_${current}`] || 0),
                  0
                ),
                name: intl.formatMessage({ id: `market.${sportId}.1_0_${m.key}` })
              })
            )
          },
          {
            type: 'pie',
            selectedMode: 'single',
            radius: ['30%', '45%'],
            label: {
              formatter ({
                name,
                value,
                percent
              }) {
                const nameArr = name.split('-')
                return `{a|${nameArr[0]}}{abg|}\n{hr|}\n {b|${nameArr[1]}: ${percent}%} `
              },
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  fontSize: 9,
                  lineHeight: 18,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 9,
                  lineHeight: 26,
                  padding: [2, 4],
                },
                per: {
                  lineHeight: 16,
                  fontSize: 9,
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 2],
                  borderRadius: 2
                }
              }
            },
            data: charMarkets.map(
              m => m.options.map(
                o => ({
                  name: (
                    `${
                      intl.formatMessage({ id: `market.${sportId}.1_0_${m.key}` })
                    }-${
                      intl.formatMessage({ id: `preview.${m.key}_${o}` })
                    }`
                  ),
                  value: (bets[`${m.key}_${o}`] || 0)
                })
              )
            ).flat()
          }
        ]
      }
      const chart = echarts.init(chartsEl.current)
      chart.setOption(option)

      const handleResize = () => {
        chart.resize()
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    },
    [bets]
  )

  return (
    <div
      ref={chartsEl}
      className={classes.root}
    ></div>
  )
}

export default observer(BetCharts)
