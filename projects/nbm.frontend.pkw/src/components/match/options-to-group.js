/**
 * 根据指定列拆分option列表
 *
 * @param {array} options 投注项列表
 * @param {number} cols 列数
 */
const flowByColumns = (options, cols) => {
  const groups = []
  let group = null
  options.forEach(opt => {
    if (!group || group.length >= cols) {
      group = []
      groups.push(group)
    }
    group.push(opt)
  })
  return groups
}

const groupByBetBar = (options, comparator) => {
  const groups = []
  options.forEach(opt => {
    let group = groups.find(group => group[0].betBar === opt.betBar)
    if (!group) {
      group = []
      groups.push(group)
    }
    group.push(opt)
  })
  if (comparator) {
    groups.sort(comparator)
  }
  return groups
}

const flowMap = {
  14: 3,
  // 让分 主盘第一,其余升序 
  16: options => groupByBetBar(options, (g1, g2) => {
    const mvalue = ((g1[0].main ? 0 : 1) - (g2[0].main ? 0 : 1))

    if (mvalue !== 0) {
      return mvalue
    }

    return g1[0].betBar - g2[0].betBar
  }),
  // 大小 主盘第一, 其余按盘口降序
  18: options => groupByBetBar(options, (g1, g2) => {
    const mvalue = ((g1[0].main ? 0 : 1) - (g2[0].main ? 0 : 1))

    if (mvalue !== 0) {
      return mvalue
    }

    return g2[0].betBar - g1[0].betBar
  }),
  // 精准进球数
  21: 2,
  // 上半场总分范围
  25: 3,
  // 净胜球数
  27: 2,
  // 得分球队
  30: 2,
  // 主队准确得分
  31: 2,
  // 客队准确得分
  32: 2,
  // 零失球
  37: 2,
  // 首先/最后进球
  38: 2,
  // 波胆(正确比分)
  45: options => {
    const optCols = [[], [], []]
    let otherOption = null
    options.forEach(o => {
      if (!/\d+\:\d+/i.test(o.betOption)) {
        otherOption = o
        return
      }

      const values = o.betOption.split(/[-:]/)
      let columnIndex = 0

      if (values[0] === values[1]) {
        columnIndex = 1
      } else if (values[0] < values[1]) {
        columnIndex = 2
      }

      optCols[columnIndex].push(o)
    })
    
    if (otherOption) {
      optCols[1].push(otherOption)
    }

    optCols[0].sort((o1, o2) => {
      const bo1 = (o1.betOption || '0:0').split(':')
      const bo2 = (o2.betOption || '0:0').split(':')
      
      const s1 = bo1[0] - bo2[0]
      if (s1 !== 0) {
        return s1
      }

      return bo1[1] - bo2[1]
    })

    optCols[2].sort((o1, o2) => {
      const bo1 = (o1.betOption || '0:0').split(':')
      const bo2 = (o2.betOption || '0:0').split(':')
      
      const s1 = bo1[1] - bo2[1]
      if (s1 !== 0) {
        return s1
      }

      return bo1[0] - bo2[0]
    })

    const groups = []
    const groupLength = Math.max(...optCols.map(col => col.length))
    for (let i = 0; i < groupLength; i++) {
      groups.push([
        optCols[0][i],
        optCols[1][i],
        optCols[2][i]
      ])
    }

    return groups
  },
  // 半全场
  47: 3,
  // 首球方式
  63: 3,
  // 比赛终结方式
  224: 2,
  // 赛果/首球
  230: 3,
  // 均得分/赛果
  231: 3,
  // 胜分范围
  290: 2
}

export default (options, marketType) => {
  const flow = flowMap[marketType]
  if (typeof flow === 'function') {
    return flow(options)
  }

  const soptions = [...options]
  soptions.sort((o1, o2) => {
    return o1.orderNo - o2.orderNo
  })

  return flowByColumns(soptions, flow || soptions.length)
}
