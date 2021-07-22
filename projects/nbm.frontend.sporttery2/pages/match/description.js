import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import SubPage from '../../components/common/sub-page'

const useStyles = makeStyles(
  {
    root: {
      '& > h3': {
        lineHeight: '36px',
        color: '#333',
        fontSize: 14,
        textAlign: 'center'
      },
      '& > h6': {
        fontSize: 12,
        fontWeight: 600,
        color: '#555'
      },
      '& > p': {
        fontSize: 12,
        padding: '15px 0',
        color: '#555'
      }
    }
  },
  { name: 'DescriptionPage' }
)

const DescriptionPage = () => {
  const classes = useStyles()

  return (
    <SubPage title="玩法说明">
      <div className={classes.root}>
        <h3>竞彩篮球</h3>
        <h6>胜负</h6>
        <p>竞猜全场比赛（含加时赛），主队的胜负情况.</p>
        <h6>让分胜负</h6>
        <p>竞猜全场比赛（含加时赛），主队得分加减“让分数”后，主队的胜负情况.</p>
        <h6>大小分</h6>
        <p>竞猜全场比赛（含加时赛），比赛双方得分总数与预设总分数的大小.</p>
        <h6>胜分差</h6>
        <p>竞猜全场比赛（含加时赛），比赛两队的净胜分差.</p>
        <h6>串关</h6>
        <p>最少选择2场或2场以上比赛进行组合投注.</p>
        <p>1：相同赛事只可选择一个投注项.</p>
        <p>2：不支持复式串关投注以及足篮混串.</p>
        <p>3：最多可选择10场比赛进行串关投注.</p>
        <h3>竞彩足球</h3>
        <h6>胜平负</h6>
        <p>对赛事全场90分钟（含伤停补时）胜、平、负进行投注（没有让球）.</p>
        <h6>让球胜平负</h6>
        <p>对赛事在全场90分钟（含伤停补时）计算让球后的胜、平、负进行投注.</p>
        <h6>比分</h6>
        <p>对赛事全场90分钟（含伤停补时）的实际比分进行投注.</p>
        <h6>总进球</h6>
        <p>预测对阵双方整场赛事全场90分钟（含伤停补时）（不计算加时、点球）的进球总数.</p>
        <h6>半全场胜平负</h6>
        <p>选定比赛，对主队在上半场45分钟（含伤停补时）和全场90分钟（含伤停补时）的“胜”、“平”、“负”结果分别进行投注.</p>
        <h6>串关</h6>
        <p>至少选择2场或2场以上比赛进行组合投注.</p>
        <p>1：相同赛事只可选择一个投注项.</p>
        <p>2：不支持复式串关投注以及足篮混串.</p>
        <p>3：最多可选择10场比赛进行串关投注.</p>
      </div>
    </SubPage>
  )
}

export default DescriptionPage
