import uniq from 'lodash/uniq';

/** 比赛列表上的 玩法项类型 */
export type ListMarket = { marketType: number, marketStage: number } | undefined

/**
 * ### 体育类型  
 * * 10 - 足球   
 * * 11 - 篮球  
 * * 12 - 网球  
 * * 13 - 排球
 * * 14 - 乒乓球
 * * 15 - 冰球
 * * 16 - 棒球
 * * 99 - 电竞  
 */
export enum Sports {
  // 足球
  SOCCER = 10,
  // 篮球
  BASKETBALL = 11,
  // 网球
  TENNIS = 12,
  // 排球
  VOLLEYBALL = 13,
  // 乒乓球
  TABLETENNIS = 14,
  // 冰球
  ICEHOCKEY = 15,
  // 棒球
  BASEBALL = 16,
  // 电竞  
  ESPORTS = 99
}

/**
 * ### 玩法分组  
 * * 1 - SCORE	比分
 * * 2 - CORNOR	角球
 * * 3 - CARD	罚牌
 * * 4 - ANTEPOST	早期投注
 * * 5 - FIRSTKICKOFF	谁先开球
 */
export enum GroupOfMarket {
  /** 比分 */
  SCORE = 1,
  /** 角球 */
  CORNER = 2,
  /** 罚牌 */
  CARD = 3,
  /** 早期投注 */
  ANTEPOST = 4,
  /** 谁先开球 */
  FIRSTKICKOFF = 5,
}

/**
 * ### 玩法阶段  
 * * 0  - H0 - 全场
 * * 1  - H1 - 上半场
 * * 2  - H2 - 下半场
 * * 3  - OT - 加时全场
 * * 4  - O1 - 加时上半场
 * * 5  - O2 - 加时下班场
 * * 6  - FT - 点球
 * * 51 - Q1 - 第1节
 * * 52 - Q2 - 第2节
 * * 53 - Q3 - 第3节
 * * 54 - Q4 - 第4节
 * * 55 - Q5 - 第5节
 * * 56 - Q6 - 第6节
 * * 57 - Q7 - 第7节
 * * 58 - Q8 - 第8节
 * * 59 - Q9 - 第9节
 */
export enum MarketStage {
  /** 全场 */
  H0 = 0,
  /** 上半场 */
  H1 = 1,
  /** 下半场 */
  H2 = 2,
  /** 加时全场 */
  OT = 3,
  /** 加时上半场 */
  O1 = 4,
  /** 加时下班场 */
  O2 = 5,
  /** 点球 */
  FT = 6,
  /** 第1节 */
  Q1 = 51,
  /** 第2节 */
  Q2 = 52,
  /** 第3节 */
  Q3 = 53,
  /** 第4节 */
  Q4 = 54,
  /** 第5节 */
  Q5 = 55,
  /** 第6节 */
  Q6 = 56,
  /** 第7节 */
  Q7 = 57,
  /** 第8节 */
  Q8 = 58,
  /** 第9节 */
  Q9 = 59,

  /** 第一节 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_Q1 = 1,
  /** 第一节 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_Q2 = 2,
  /** 第三节 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_Q3 = 3,
  /** 第四节 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_Q4 = 4,
  /** 上半场 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_H1 = 10,
  /** 下半场 在滚球阶段字段 matchPeriod对应的值 */
  PERIOD_H2 = 11,
}

/**
 * 当前比赛阶段
 */
export enum MatchPeriod {
  // /** 未开赛 */
  // WAITING = 0,
  // /** 第1节/图 */
  // Q1 = 1,
  // /** 第2节/图 */
  // Q2 = 2,
  // /** 第3节/图 */
  // Q3 = 3,
  // /** 第4节/图 */
  // Q4 = 4,
  // /** 第5节/图 */
  // Q5 = 5,
  // /** 第6节/图 */
  // Q6 = 6,
  // /** 第7节/图 */
  // Q7 = 7,
  // /** 第8节/图 */
  // Q8 = 8,
  // /** 第9节/图 */
  // Q9 = 9,
  // /** 上半场 */
  // H1 = 10,
  // /** 下半场 */
  // H2 = 11,
  // /** 已开始 */
  // STARTED = 13,
  // /** 暂停 */
  // PAUSED = 14,
  // /** 半场 */
  // HALF = 15,
  /** 等待加时 */
  // WAITING_OVERTIME = 16,
  /** 加时中 */
  // OVERTIMING = 17,
  /** 加时上半场 */
  // OVERTIME_H1 = 18,
  /** 加时赛中场 */
  // A = 19,
  // /** 加时下半场 */
  // A = 20,
  // /** 加时赛后 */
  // A = 21,
  // /** 等待点球 */
  // A = 22,
  // /** 点球中 */
  // A = 23,
  // /** 点球后 */
  // A = 24,
  // /** 中断 */
  // A = 25,
  // /** 停赛 */
  // A = 26,
  // /** 弃赛 */
  // A = 27,
  // /** 弃权 */
  // A = 28,
  // /** 取消 */
  // A = 29,
  // /** 金局后 */
  // A = 30,
  // /** 第1{type}完场后 */
  // A = 31,
  // /** 第2{type}完场后 */
  // A = 32,
  // /** 第3{type}完场后 */
  // A = 33,
  // /** 第4{type}完场后 */
  // A = 34,
  // /** 第5{type}完场后 */
  // A = 35,
  // /** 第6{type}完场后 */
  // A = 36,
  // /** 第7{type}完场后 */
  // A = 37,
  // /** 第8{type}完场后 */
  // A = 38,
  // /** 延期 */
  // A = 40,
  // /** 推迟开赛 */
  // A = 41,
  // /** 完场 */
  // A = 100,
  // /** 进行中 */
  // A = 999,
}

/**
 * ### 玩法类别
 * * 1 - Favorite - 主要玩法 精选
 * * 2 - Asian - 亚洲玩法
 * * 3 - Half - 半场玩法
 * * 4 - Add - 各种组合玩法
 * * 5 - Corner - 角球玩法
 * * 6 - Card - 罚牌玩法
 */
export enum MarketCategory {
  /** 全部玩法 */
  ALL = -1,
  /** 主要玩法(精选) */
  FAVORITE = 1,
  /** 亚洲玩法 */
  ASIAN = 2,
  /** 半场玩法 */
  HALF = 3,
  /** 各种组合玩法 */
  ADD = 4,
  /** 角球玩法 */
  CORNER = 5,
  /** 罚牌玩法 */
  CARD = 6,
  /** 单节玩法 */
  QUARTER = 7
}

/**
 * ### 左侧非体育项菜单
 * 
 * * -1 - FAVORITE - 我的赛程
 * * 2 - INPLAY - 滚球
 * * 1 - COMBO - 串关
 */
export enum ExtraMenu {
  /** 我的赛程 */
  FAVORITE = -1,
  /** 滚球 */
  INPLAY = 2,
  /** 串关 */
  PARLAY = 1,
}

/**
 * ### 当前有效体育类型  
 * * 10 - 足球   
 * * 11 - 篮球  
 * * 12 - 网球  
 * * 13 - 排球
 * * 14 - 乒乓球
 * * 15 - 冰球
 * * 16 - 棒球
 * * 99 - 电竞  
 */
export const AVAILABLE_SPORTS: Array<Sports> = [
  // 足球
  Sports.SOCCER,
  // 篮球
  Sports.BASKETBALL,
  // 电竞  
  Sports.ESPORTS,
  // 网球
  Sports.TENNIS,
  // 排球
  Sports.VOLLEYBALL,
  // 乒乓球
  Sports.TABLETENNIS,
  // 冰球
  Sports.ICEHOCKEY,
  // 棒球
  Sports.BASEBALL,
];


/**
 * ### 比赛列表玩法项映射  
 * * 10 - 足球  
 * * 11 - 篮球  
 * * 12 - 网球  
 * * 13 - 排球  
 * * 14 - 乒乓球  
 * * 15 - 冰球  
 * * 16 - 棒球  
 * * 99 - 电竞  
 */
export const LIST_MARKETS: any = {
  /** 
   * ### 比赛列表中的玩法: 10-足球  
   * 全场及上半场  
   *
   * * 1 胜平负
   * * 16 让分
   * * 18 大小
   */
  10: [
    // 全场让分
    {
      marketType: 16,
      marketStage: 0,
    },
    // 全场大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 全场胜平负
    {
      marketType: 1,
      marketStage: 0,
    },
    // 上半场胜平负
    {
      marketType: 1,
      marketStage: 1,
    },
    // 上半场让分
    {
      marketType: 16,
      marketStage: 1,
    },
    // 上半场大小
    {
      marketType: 18,
      marketStage: 1,
    },
  ],
  /** 
   * ### 比赛列表中的玩法: 11-篮球  
   * 全场及上半场  
   *
   * * 186 胜负
   * * 16 让分
   * * 18 大小
   */
  11: [
    // 全场让分
    {
      marketType: 16,
      marketStage: 0,
    },
    // 全场大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 全场胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 上半场胜负
    {
      marketType: 186,
      marketStage: 1,
    },
    // 上半场让分
    {
      marketType: 16,
      marketStage: 1,
    },
    // 上半场大小
    {
      marketType: 18,
      marketStage: 1,
    },
  ],
  /** 
   * ### 比赛列表中的玩法: 12-网球  
   *
   * * 186 胜负 
   * * 16 让盘 
   * * 153 让局 
   * * 18 局数大小 
   * * 1305 局数单双 
   * * 无
   */
  12: [
    // 胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 让盘
    {
      marketType: 16,
      marketStage: 0,
    },
    // 让局
    {
      marketType: 153,
      marketStage: 0,
    },
    // 局数大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 局数单双
    {
      marketType: 1305,
      marketStage: 0,
    },
    undefined
  ],
  /** 
   * ### 比赛列表中的玩法: 13-排球  
   *
   * * 186 胜负
   * * 16 让盘
   * * 18 大小
   * * 26 单双
   * * 无
   * * 无
   */
  13: [
    // 胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 让盘
    {
      marketType: 16,
      marketStage: 0,
    },
    // 大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 单双
    {
      marketType: 26,
      marketStage: 0,
    },
    undefined,
    undefined
  ],
  /** 
   * ### 比赛列表中的玩法: 14-乒乓球  
   *
   * * 186 胜负
   * * 16 让分
   * * 无
   * * 无
   * * 无
   * * 无
   */
  14: [
    // 胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 让盘
    {
      marketType: 16,
      marketStage: 0,
    },
    undefined,
    undefined,
    undefined,
    undefined
  ],
  /** 
   * ### 比赛列表中的玩法: 15-冰球  
   *
   * * 186 胜负
   * * 16 让分
   * * 18 大小
   * * 26 单双
   * * 无
   * * 无
   */
  15: [
    // 胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 让分
    {
      marketType: 16,
      marketStage: 0,
    },
    // 大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 单双
    {
      marketType: 26,
      marketStage: 0,
    },
    undefined,
    undefined
  ],
  /** 
   * ### 比赛列表中的玩法: 16-棒球  
   * 全场及上半场  
   *
   * * 186 胜负
   * * 16 让分
   * * 18 大小
   */
  16: [
    // 全场胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 上半场胜负
    {
      marketType: 186,
      marketStage: 1,
    },
    // 全场让分
    {
      marketType: 16,
      marketStage: 0,
    },
    // 上半场让分
    {
      marketType: 16,
      marketStage: 1,
    },
    // 全场大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 上半场大小
    {
      marketType: 18,
      marketStage: 1,
    }
  ],
  /** 
   * ### 比赛列表中的玩法: 99-电竞  
   *
   * * 186 胜负
   * * 16 让分
   * * 18 大小
   * * 无
   * * 无
   * * 无
   */
  99: [
    // 全场胜负
    {
      marketType: 186,
      marketStage: 0,
    },
    // 全场让分
    {
      marketType: 16,
      marketStage: 0,
    },
    // 全场大小
    {
      marketType: 18,
      marketStage: 0,
    },
    // 空
    undefined,
    // 空
    undefined,
    // 空
    undefined
  ],
  /** 获取指定体育比赛的列表玩法条件 */
  getMarkets(...sports: Array<Sports>): Array<ListMarket> {
    return uniq(
      sports.map(
        sid => (
          this[sid].map(
            (market: any) => market ? market.marketType : undefined
          )
        )
      ).flat().filter(
        v => Boolean(v)
      )
    );
  }
};

/**
 * ### 比赛状态枚举  
 * * 0	- Early	早盘未开赛
 * * -1	- Today	今日
 * * 1	- Live	滚球进行中
 * * 3	- End	正常结束
 * * 4	- Delay	延期
 * * 5	- Cut	腰斩
 */
export enum MatchState {
  /** 早盘未开赛 */
  EARLY = 0,
  /** 今日 */
  TODAY = -1,
  /** 滚球进行中 */
  LIVE = 1,
  /** 正常结束 */
  END = 3,
  /** 延期 */
  DELAY = 4,
  /** 腰斩 */
  CUT = 5,
}

/**
 * ### 状态栏额外选项  
 * * 1301	- Recommend 推荐
 * * 99	- Combo	串关
 * * 1302	- Result	赛果
 * * 1303	- Live list	直播
 */
export enum StateExtra {
  /** 推荐 */
  SUGGEST = 1301,
  /** 串关 */
  COMBO = 99,
  /** 赛果 */
  RESULT = 1302,
  /** 直播 */
  LIVE_LIST = 1303,
}

/**
 * ### 推送数据类型 
 *
 * * 1 - MATCH_STATE - 比赛状态变化
 * * 2 - ODDS - 投注项赔率或状态变化
 * * 4 - MAIN_MARKET - 主盘变化
 * * 5 - MATCH_DELETE - 整场拉盘
 * * 6 - MATCH_TIME - 比赛时间变化
 * * 7 - MATCH_SCORE - 比赛比分变化(比分,角球,红黄牌)
 * * 8 - QUARTER - 单节统计数据变化
 * * 9 - ORDER - 注单变化
 */
export enum PushNt {
  /** 比赛状态变化 */
  MATCH_STATE = 1,
  /** 投注项赔率或状态变化 */
  ODDS = 2,
  /** 主盘变化 */
  MAIN_MARKET = 4,
  /** 整场拉盘 */
  MATCH_DELETE = 5,
  /** 比赛时间变化 */
  MATCH_TIME = 6,
  /** 比赛比分变化(比分,角球,红黄牌) */
  MATCH_SCORE = 7,
  /** 玩法数量变化 */
  MARKET_COUNT = 20,
  /** 注单变化 */
  ORDER = 100,
}

/**
 * ### 投注项状态
 * * 0 - HIDDEN - 不可见
 * * 1 - AVAILABLE - 正常状态(可见可投)
 * * -1 - DISABLED - 不可投注 (可见不可投)
 */
export enum OptionStatus {
  /** 不可见 */
  HIDDEN = 0,
  /** 正常状态(可见可投) */
  AVAILABLE = 1,
  /** 不可投注 (可见不可投) */
  DISABLED = -1,
}

/**
 * ### 多媒体类型  
 * * info - INFO - 赛事信息
 * * lmt - LMT - 图文直播
 * * video - VIDEO - 视频直播
 */
export enum MediaType {
  INFO = 'info',
  LMT = 'lmt',
  VIDEO = 'video'
}

/**
 * ### 收藏类型
 * * 1 - MATCH - 比赛
 * * 2 - TOURNAMENT - 联赛
 */
export enum FavoriteType {
  /** 比赛 */
  MATCH = 1,
  /** 联赛 */
  TOURNAMENT = 2,
}

/**
 * ### 比赛列表排序规则
 * * 0 - BY_TIME_ASC - 按时间升序
 * * 2 - BY_TIME_DESC - 按时间降序
 * * 1 - BY_TOUR - 按联赛排序
 */
export enum MatchOrderby {
  /** 按时间升序 */
  BY_TIME_ASC = 0,
  /** 按时间降序 */
  BY_TIME_DESC = 2,
  /** 按联赛排序 */
  BY_TOUR = 1
}
