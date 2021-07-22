import React from 'react'
import M from '../common/m'
/**
 * 根据betOption从locale文件中获取option名称
 * @param {string} betOption
 */
const NAMED_BY_OPTION_FORMATER = betOption => ({
  key: betOption,
})

/**
 * 将betOption直接用作值显示, Other需要从locale文件中获取值显示
 * @param {string} betOption 
 */
const OPTION_IS_VALUE_FORMATER = betOption => (
  ['Other', 'AOS'].includes(betOption)
  ? ({ key: betOption })
  : ({ value: betOption })
)

/**
 * 大小玩法  
 *
 * @param {string} betOption 
 * @param {string} betBar 
 */
const OU_FORMATER = (betOption, betBar) => {
  let showText = /\.[27]5$/.test(betBar) ? `${+betBar - 0.25}/${+betBar + 0.25}` : `${betBar}`
  showText = showText.replace(/-/g, '')
  return {
    key: betOption,
    suffix: ` ${showText}`,
  }
}

/**
 * 让分玩法
 * @param {string} betOption 
 * @param {string} betBar 
 */
const HANDICAP = (betOption, betBar) => {
  const betBarValue = Math.abs(+betBar)
  const nbb = /\.[27]5$/.test(betBar) ? `${betBarValue - 0.25}/${betBarValue + 0.25}` : betBarValue
  const symbol = (+betBar > 0 ? ['', '＋', '－'] : ['', '－', '＋'])[betBarValue === 0 ? 0 : betOption]

  return {
    key: `16_${betOption}`,
    suffix: ` ${symbol}${nbb}`,
  }
}

/**
 * 针对特定玩法单独处理,如果没有单独列出的玩法则直接以betOption为key从locale文件中获取名称
 */
const OPTION_FORMATERS = {
  // 双胜彩
  10: betOption => NAMED_BY_OPTION_FORMATER(`10_${betOption}`),
  // 让分标准盘
  14: (betOption, betBar) => {
    betBar = parseInt(betBar)
    const bar1 = betBar > 0 ? `+${+betBar}` : betBar
    const bar2 = betBar > 0 ? -betBar : `+${-betBar}`
    return {
      key: betOption,
      suffix: betOption === '2' ? bar2 : bar1
    }
  },
  // 让球盘 - 需要拆出.25 和.75 为 两个对应值
  16: HANDICAP,
  // 大小盘
  18: OU_FORMATER,
  // 精准进球数
  21: betOption => ({ value: betOption }),
  // 总分范围
  25: OPTION_IS_VALUE_FORMATER,
  // 净胜球数
  27: betOption => {
    if (['Draw', 'NG'].includes(betOption)) {
      return NAMED_BY_OPTION_FORMATER(`27_${betOption}`)
    }

    return {
      key: `27_${betOption.charAt(0)}`,
      suffix: ` ${betOption.substring(1)}`
    }
  },
  // 得分球队
  30: betOption => NAMED_BY_OPTION_FORMATER(`30_${betOption}`),
  // 主队准确得分
  31: betOption => ({ value: betOption === '3' ? '3+' : betOption }),
  // 客队准确得分
  32: betOption => ({ value: betOption === '3' ? '3+' : betOption }),
  // 双方得分情况
  36: betOption => NAMED_BY_OPTION_FORMATER(`36_${betOption}`),
  // 首先/最后进球
  38: betOption => NAMED_BY_OPTION_FORMATER(`38_${betOption}`),
  // 主队大小
  40: OU_FORMATER,
  // 客队大小
  41: OU_FORMATER,
  // 正确比分
  45: OPTION_IS_VALUE_FORMATER,
  // 单双
  47: betOption => NAMED_BY_OPTION_FORMATER(`47_${betOption}`),
  // 最高得分半场
  52: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
  // 主队最高得分半场
  53: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
  // 客队最高得分半场
  54: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
  // 首球半场
  62: betOption => NAMED_BY_OPTION_FORMATER(`62_${betOption}`),
  // 首球方式
  63: betOption => NAMED_BY_OPTION_FORMATER(`63_${betOption}`),
  // 网球让局
  153: HANDICAP,
  // 比赛终结方式
  224: betOption => NAMED_BY_OPTION_FORMATER(`224_${betOption}`),
  // 赛果/首球
  230: betOption => NAMED_BY_OPTION_FORMATER(`230_${betOption}`),
  // 均得分/赛果
  231: betOption => NAMED_BY_OPTION_FORMATER(`231_${betOption}`),
  // 胜分差
  290: betOption => {
    const [bo, value] = betOption.trim().split(' ')
    return {
      key: `290_${bo}`,
      params: {
        value
      }
    }
  },
  // 网球让盘
  1303: HANDICAP
}

/**
 * 获取option的name
 * 返回对象中的key, value, prefix, suffix有可能为空
 * 如果为空则不显示对应字段
 *
 * @param marketType
 * @param betBar
 * @param betOption
 *
 * @returns
 *  {
 *    key: 语言包中的后缀key
 *    value: 计算后的值
 *    prefix: 前缀
 *    suffix: 后缀
 *  }
 */
export const toOptionName = (marketType, marketGroup, betBar, betOption) => {
  // 谁先开球单独处理 不显示盘口
  if (marketGroup === 5) {
    return NAMED_BY_OPTION_FORMATER(betOption, betBar)
  }

  const formater = OPTION_FORMATERS[marketType] || NAMED_BY_OPTION_FORMATER
  return formater(betOption, betBar)
}


export default function OptionName({
  marketType, 
  marketGroup,
  betBar, 
  betOption
}) {
  const {
    prefix,
    key,
    value,
    suffix,
    params
  } = toOptionName(
    marketType,
    marketGroup,
    betBar,
    betOption
  )

  return (
    <>
      {prefix || ''}
      {
        key && (
          <M
            id={`option.${key}`}
            values={{
              ...params,
              betOption,
              betBar
            }}
          />
        )
      }
      {value || ''}
      {suffix || ''}
    </>
  )
}
