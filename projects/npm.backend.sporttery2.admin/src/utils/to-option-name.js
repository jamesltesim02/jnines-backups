const NAMED_BY_OPTION_FORMATER = betOption => ({
  key: betOption,
});

const OPTION_IS_VALUE_FORMATER = betOption => ({
  value: betOption,
});

const OPTION_FORMATERS = {
  // 让分标准盘
  14: (betOption, betBar) => {
    const preScores = betBar.split(':');
    const num = preScores[0] - preScores[1];
    return {
      prefix: betOption === '2' ? (-1 * num) : num,
    };
  },
  // 让球盘 - 需要拆出.25 和.75 为 两个对应值
  16: (betOption, betBar) => {
    const betBarValue = Math.abs(+betBar);
    const nbb = /\.[27]5$/.test(betBar) ? `${betBarValue - 0.25}/${betBarValue + 0.25}` : betBarValue;
    const symbol = (+betBar > 0 ? ['', '+', '-'] : ['', '-', '+'])[betBarValue === 0 ? 0 : betOption];

    return {
      suffix: ` ${symbol}${nbb}`,
    };
  },
  // 大小盘
  18: (betOption, betBar) => {
    let showText = /\.[27]5$/.test(betBar) ? `${+betBar - 0.25}/${+betBar + 0.25}` : `${betBar}`;
    showText = showText.replace(/-/g, '');
    return {
      ...NAMED_BY_OPTION_FORMATER(betOption),
      suffix: ` ${showText}`,
    };
  },
  // 精准进球数
  21: betOption => ({ value: betOption }),
  // 总分范围
  25: OPTION_IS_VALUE_FORMATER,
  // 得分球队
  30: betOption => NAMED_BY_OPTION_FORMATER(`30_${betOption}`),
  // 正确比分
  45: betOption => (
    betOption === 'Other'
    ? NAMED_BY_OPTION_FORMATER(betOption)
    : OPTION_IS_VALUE_FORMATER(betOption)
  ),
  // 单双
  47: betOption => NAMED_BY_OPTION_FORMATER(`47_${betOption}`),
  // 最高得分半场
  52: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
  // 主队最高得分半场
  53: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
  // 客队最高得分半场
  54: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
};

/**
 * 获取option的name
 * 返回对象中的key, value, prefix, suffix有可能为空
 * 如果为空则不显示对应字段
 *
 * @param gameType
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
export default (gameType, betBar, betOption) => {
  const formater = OPTION_FORMATERS[gameType] || NAMED_BY_OPTION_FORMATER;
  return formater(betOption, betBar);
};
