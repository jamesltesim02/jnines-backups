import { getSettingAttr } from '@/utils/PortalUtils';

const mapping = {
  // 足球
  10: getSettingAttr('SOCCER_1618_AVAILABLE')
    ? [
      // 全场胜平负
      {
        betStage: 0,
        gameType: 1,
      },
      // 全场让分
      {
        betStage: 0,
        gameType: 16,
      },
      // 全场大小
      {
        betStage: 0,
        gameType: 18,
      },
      // 上半场让分
      {
        betStage: 1,
        gameType: 16,
      },
      // 上半场大小
      {
        betStage: 1,
        gameType: 18,
      },
    ]
    : [
      // 全场胜平负
      {
        betStage: 0,
        gameType: 1,
      },
      // 全场让分胜平负
      {
        betStage: 0,
        gameType: 14,
      },
      // 全场双胜彩
      {
        betStage: 0,
        gameType: 10,
      },
      // 全场单双
      {
        betStage: 0,
        gameType: 26,
      },
      // 上半场胜平负
      {
        betStage: 1,
        gameType: 1,
      },
    ],
  // 篮球
  11: [
    // 全场胜负
    {
      betStage: 0,
      gameType: 186,
    },
    // 全场让分
    {
      betStage: 0,
      gameType: 16,
    },
    // 全场大小
    {
      betStage: 0,
      gameType: 18,
    },
    // 全场单双
    {
      betStage: 0,
      gameType: 26,
    },
    // 是否加时
    {
      betStage: 0,
      gameType: 220,
    },
  ],
  // 英雄联盟
  14: [
    // 全场让分
    {
      betStage: 0,
      gameType: 16,
    },
    // 全场大小
    {
      betStage: 0,
      gameType: 18,
    },
  ],
  // 反恐精英
  17: [
    // 全场让分
    {
      betStage: 0,
      gameType: 16,
    },
    // 全场大小
    {
      betStage: 0,
      gameType: 18,
    },
  ],
};

export default mapping;
