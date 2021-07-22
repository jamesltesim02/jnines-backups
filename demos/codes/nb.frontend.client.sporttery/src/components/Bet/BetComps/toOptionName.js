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
      ...NAMED_BY_OPTION_FORMATER(betOption),
      prefix: betOption === '2' ? (-1 * num) : num,
    };
  },
  // 让球盘
  16: (betOption, betBar) => ({
    value: (+betOption === 1 ? 1 : -1) * betBar,
  }),
  // 大小盘
  18: (betOption, betBar) => ({
    ...NAMED_BY_OPTION_FORMATER(betOption),
    suffix: betBar,
  }),
  21: betOption => ({ value: betOption }),
  25: OPTION_IS_VALUE_FORMATER,
  // 得分球队
  30: betOption => NAMED_BY_OPTION_FORMATER(`30_${betOption}`),
  45: OPTION_IS_VALUE_FORMATER,
  // 单双
  47: betOption => NAMED_BY_OPTION_FORMATER(`47_${betOption}`),
  53: betOption => NAMED_BY_OPTION_FORMATER(`maxscore_${betOption}`),
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
