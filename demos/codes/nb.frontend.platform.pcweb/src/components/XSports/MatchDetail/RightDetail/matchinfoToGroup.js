const groupMapping = {
  // 足球
  10: [
    // 胜平负
    {
      key: 'gtp1',
      gtps: [
        // 1: 胜平负
        {
          gameType: 1,
          gameStage: 0,
        },
        // 14: 让分胜平负
        {
          gameType: 14,
          gameStage: 0,
        },
        // 10: 双胜彩
        {
          gameType: 10,
          gameStage: 0,
        },
      ],
    },
    // 让球 & 大小
    {
      key: 'gtp1618',
      gtps: [
        // 16: 让分
        {
          gameType: 16,
          gameStage: 0,
        },
        // 18: 大小
        {
          gameType: 18,
          gameStage: 0,
        },
      ],
    },
    // 波胆
    {
      key: 'gtp45',
      gtps: [
        // 45: 正确比分
        {
          gameType: 45,
          gameStage: 0,
        },
      ],
    },
    /*
     * 得分
     */
    {
      key: 'gtpscore',
      gtps: [
        // 21: 精准进球数
        {
          gameType: 21,
          gameStage: 0,
        },
        // 25: 总分范围
        {
          gameType: 25,
          gameStage: 0,
        },
        // 26: 单双
        {
          gameType: 26,
          gameStage: 0,
        },
        // 29: 两队均得分
        {
          gameType: 29,
          gameStage: 0,
        },
        // 30: 得分球队
        {
          gameType: 30,
          gameStage: 0,
        },
        // 33: 主胜且零封
        {
          gameType: 33,
          gameStage: 0,
        },
        // 34: 客胜且零封
        {
          gameType: 34,
          gameStage: 0,
        },
        // 47: 半全场
        {
          gameType: 47,
          gameStage: 0,
        },
        // 48: 主队两半场均得分
        {
          gameType: 48,
          gameStage: 0,
        },
        // 49: 客队两半场均得分
        {
          gameType: 49,
          gameStage: 0,
        },
        // 50: 主队任意半场获胜
        {
          gameType: 50,
          gameStage: 0,
        },
        // 51: 客队两半场均得分
        {
          gameType: 51,
          gameStage: 0,
        },
        // 52: 最高得分半场
        {
          gameType: 52,
          gameStage: 0,
        },
        // 53: 主队得分最高半场
        {
          gameType: 53,
          gameStage: 0,
        },
        // 54: 客队得分最高半场
        {
          gameType: 54,
          gameStage: 0,
        },
      ],
    },
    /*
     * 上半场
     */
    {
      key: 'gtpstage1',
      gtps: [
        // 1: 胜平负
        {
          gameType: 1,
          gameStage: 1,
        },
        // 14: 让分胜平负
        {
          gameType: 14,
          gameStage: 1,
        },
        // 16: 让分
        {
          gameType: 16,
          gameStage: 1,
        },
        // 18: 大小
        {
          gameType: 18,
          gameStage: 1,
        },
        // 10: 双胜彩
        {
          gameType: 10,
          gameStage: 1,
        },
        // 26: 单双
        {
          gameType: 26,
          gameStage: 1,
        },
        // 29: 两队均得分
        {
          gameType: 29,
          gameStage: 1,
        },
      ],
    },
  ],
  // 篮球
  11: [
    // 胜负全场
    {
      key: 'gtp186',
      gtps: [
        // 186: 正确比分
        {
          gameType: 186,
          gameStage: 0,
        },
      ],
    },
    // 让分
    {
      key: 'gtp16',
      gtps: [
        // 全场
        {
          gameType: 16,
          gameStage: 0,
        },
        // 上半场
        {
          gameType: 16,
          gameStage: 1,
        },
        // 第一节
        {
          gameType: 16,
          gameStage: 51,
        },
        // 第二节
        {
          gameType: 16,
          gameStage: 52,
        },
        // 第三节
        {
          gameType: 16,
          gameStage: 53,
        },
        // 第四节
        {
          gameType: 16,
          gameStage: 54,
        },
      ],
    },
    // 大小
    {
      key: 'gtp18',
      gtps: [
        // 全场
        {
          gameType: 18,
          gameStage: 0,
        },
        // 上半场
        {
          gameType: 18,
          gameStage: 1,
        },
        // 第一节
        {
          gameType: 18,
          gameStage: 51,
        },
        // 第二节
        {
          gameType: 18,
          gameStage: 52,
        },
        // 第三节
        {
          gameType: 18,
          gameStage: 53,
        },
        // 第四节
        {
          gameType: 18,
          gameStage: 54,
        },
      ],
    },
    // 单双
    {
      key: 'gtp26',
      gtps: [
        // 全场
        {
          gameType: 26,
          gameStage: 0,
        },
        // 上半场
        {
          gameType: 26,
          gameStage: 1,
        },
        // 第一节
        {
          gameType: 26,
          gameStage: 51,
        },
        // 第二节
        {
          gameType: 26,
          gameStage: 52,
        },
        // 第三节
        {
          gameType: 26,
          gameStage: 53,
        },
        // 第四节
        {
          gameType: 26,
          gameStage: 54,
        },
      ],
    },
    // 其他玩法
    {
      key: 'gtpother',
      gtps: [
        // 上半场胜分范围
        {
          gameType: 290,
          gameStage: 1,
        },
        // 半全场
        {
          gameType: 47,
          gameStage: 1,
        },
        // 半全场
        {
          gameType: 47,
          gameStage: 1,
        },
        // 是否加时
        {
          gameType: 220,
          gameStage: 0,
        },
      ],
    },
  ],
};

export default ({ sportID, games }) => {
  if (![10, 11].includes(sportID)) {
    return [{
      key: 'others',
      games,
    }];
  }

  const groups = groupMapping[+sportID].map(
    ({ key, gtps }) => ({
      key,
      games: gtps.map(
        ({
          gameType: gtp,
          gameStage: gst,
        }) => games.find(
          ({
            gameType,
            betStage,
          }) => gameType === gtp && betStage === gst,
        ),
      ).filter(g => g && g.options && g.options.length),
    }),
  ).filter(group => group.games && group.games.length);

  return groups;
};
