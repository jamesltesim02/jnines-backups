import { makeAutoObservable, action, computed } from 'mobx';
import { PushEvent, PushMarket, ScoreChange } from '../../components/push/PushConnection';

import { GroupOfMarket, MarketCategory, MarketStage, MediaType, PushNt, Sports } from '../../consts/match';

import { ListMarket, LIST_MARKETS, MatchState, SportType } from '../../consts/match';
import Market from './Market';

import MarketGroup, { transferMarkert } from './MarketGroup';

import matchStore from './Matchs';

export default class Match {
  /** 比赛id */
  readonly matchId: string;
  /** 比赛名称 */
  readonly matchName: string;
  /** 主队名称 */
  team1: string;
  /** 客队名称 */
  team2: string;
  /** 数据提供商 */
  provider?: any;
  /**
   * ### 比赛状态  
   * 0	Early	早盘未开赛
   * -1	Today	今日
   * 1	Live	滚球进行中
   * 3	End	正常结束
   * 4	Delay	延期
   * 5	Cut	腰斩
   */
  matchState?: number;
  /**
   * ### 支持串关类型
   * 0:不支持串关
   * 1：仅支持早盘串关
   * 2：仅支持滚球串关
   * 3：支持早盘，滚球串关
   */
  readonly comboState: number;
  /** 当前玩法数 */
  matchMarket: number;
  /** 比赛开始时间(时间戳) */
  matchDate: string;
  /** 焦点比赛时传的图片 */
  readonly logo: string;
  /** 主队logo */
  readonly logo1: string;
  /** 客队logo */
  readonly logo2: string;
  /** 体育类型id; 10: 足球 11: 篮球 99: 电竞 */
  readonly sportId: SportType;
  /** 联赛id */
  readonly tournamentId: string;
  /** 联赛名称 */
  readonly tournamentName: string;
  /** 联赛logo */
  readonly tournamentLogo: string;
  /** 当前比赛阶段 */
  matchPeriod?: number;
  /** 数据统计 */
  matchStatistic?: {corners?: string, redCard?: string, yellowCard?: string };
  /** 直播源id */
  nanoId?: string;
  /** 直播地址 */
  liveUrl?: string;
  /** 滚球状态 */
  liveState?: number;
  /** 滚球时间 */
  liveTime?: any;
  /**  网球,排球,冰球,乒乓球等用于标志 n局几胜, 篮球为几场比赛 */
  gameSession?: number;
  /** 滚球比分 */
  liveScore?: any;
  /** 本场比赛主要玩法的投注量统计值 */
  betStatistics?: any;
  /** 本场比赛比分信息 */
  matchResult?: Array<{ marketGroup: number, marketStage: number, score?: string}>;
  /** 活动信息 */
  activityInfo?: { actId: string, show: boolean };
  /** 玩法列表 */
  marketGroups: Array<MarketGroup> = [];
  /** 处理事件映射 */
  events: Record<number, Function>;

  constructor (init: any) {
    this.matchId = init.matchId;
    this.matchName = init.matchName;
    this.provider = init.provider;
    this.matchState = init.matchState;
    // this.matchState = 1;
    this.comboState = init.comboState;
    this.matchMarket = init.matchMarket;
    this.matchDate = init.matchDate;
    this.logo = init.logo;
    this.logo1 = init.logo1;
    this.logo2 = init.logo2;
    this.sportId = init.sportId;
    this.tournamentId = init.tournamentId;
    this.tournamentName = init.tournamentName;
    this.tournamentLogo = init.tournamentLogo;
    this.matchStatistic = init.matchStatistic;
    this.matchPeriod = init.matchPeriod;
    this.nanoId = init.nanoId;
    this.liveUrl = init.liveUrl;
    this.liveState = init.liveState;
    this.liveTime = init.liveTime;
    this.gameSession = init.gameSession;
    this.liveScore = init.liveScore;
    this.betStatistics = init.betStatistics;
    this.matchResult = init.matchResult;
    this.activityInfo = init.activityInfo;
    [this.team1, this.team2] = init.matchName.split(' vs ');

    this.events = {
      [PushNt.MATCH_STATE]: this.onScoreChange.bind(this),
      [PushNt.ODDS]: this.onOddsChange.bind(this),
      [PushNt.MAIN_MARKET]: this.onMainMarketChange.bind(this),
      [PushNt.MATCH_DELETE]: this.onMatchDelete.bind(this),
      [PushNt.MATCH_TIME]: this.onTimeChange.bind(this),
      [PushNt.MATCH_SCORE]: this.onScoreChange.bind(this),
      [PushNt.MARKET_COUNT]: this.onMarketCountChange.bind(this),
      // TODO 提取到常量
      1001: this.onRedEnvelopeStart.bind(this),
      1003: this.onRedEnvelopeEnd.bind(this),
    };

    // 将玩法添加到列表中
    this.addMarkets(...init.markets)
    // 设置当前对象为observeable
    makeAutoObservable(this);

    // 计算比分
    this.calcBasketballPeriodScore();
  }

  /** nt1, 比赛状态变化 */
  onStateChange (event: PushEvent) {
    this.matchState = event.data?.nst;
  }

  /** 玩法数据变化 */
  onMarketChange (event: PushEvent, callback: Function) {
    event.data?.mks?.forEach(mk => {
      const index = this.marketGroups.findIndex(
        group => group.equals({
          marketType: mk.mtype,
          marketGroup: mk.mgroup,
          marketStage: mk.mstage,
          marketParam: mk.mParam
        })
      );

      if (index === -1) {
        if (!mk.ops.filter(o => o.bst !== -1).length) {
          return;
        }

        this.addMarkets(transferMarkert(mk, event));
        return;
      }

      const group = this.marketGroups[index];
      callback(group, mk);
      if (group.size === 0) {
        this.marketGroups.splice(index, 1);
      }
    });
  }

  /** nt2 赔率或状态变化 */
  onOddsChange (event: PushEvent) {
    this.onMarketChange(
      event,
      (group: MarketGroup, mk: PushMarket) => group.onOddsChange(mk, event)
    );
  }

  /** nt4 主盘变化 */
  onMainMarketChange (event: PushEvent) {
    this.onMarketChange(
      event,
      (group: MarketGroup, mk: PushMarket) => group.onMainMarketChange(mk, event)
    );
  }

  /** nt5, 整场拉盘 */
  onMatchDelete () {
    this.marketGroups = [];
  }

  /** nt6 比赛时间变化 */ 
  onTimeChange (event: PushEvent) {
    this.liveTime = {
      reamindTime: event.data?.rtime,
      remaindTimeInPeriod: event.data?.rptime,
      runTime: event.data?.time,
      stoppageTime: event.data?.stime,
      stoppageTimeAnnounced: event.data?.satime,
      timeRun: event.data?.run
    };
    if (this.matchPeriod !== event.data?.period) {
      this.matchPeriod = event.data?.period;
      // 计算比分
      this.calcBasketballPeriodScore();
    }
  }

  /**
   * nt7 比分变化
   * 
   * 1 比分 2角球 3黄牌 4红牌
   *
   * @param {object} even 事件内容
   */
  onScoreChange (event: PushEvent) {
    switch (event.data?.etype) {
      // 比分
      case ScoreChange.SCORE:
        const lastScore = this.score;
        // 修改比分
        this.liveScore = {
          ...this.liveScore,
          score: event.data.score
        };
        // 如果是足球进球,则判断是否需要吹哨和弹出提示消息
        if (this.sportId === Sports.SOCCER) {
          if (
            (Number(this.score[0]) + Number(this.score[1]))
            >
            (Number(lastScore[0]) + Number(lastScore[1]))
          ) {
            matchStore.addGoal(this);
          }
        }
        // 计算比分
        this.calcBasketballPeriodScore();
      break;
      // 角球
      case ScoreChange.CORNER:
        this.matchStatistic = {
          ...this.matchStatistic,
          corners: event.data.score
        };
      break;
      // 黄盘
      case ScoreChange.YELLOW:
        this.matchStatistic = {
          ...this.matchStatistic,
          yellowCard: event.data.score
        }
      break;
      // 红牌
      case ScoreChange.RED:
        this.matchStatistic = {
          ...this.matchStatistic,
          redCard: event.data.score
        };
      break;
    }
  }

  /**
   * nt20 玩法数量变化
   *
   * @param event 事件内容
   */
  onMarketCountChange (event: PushEvent) {
    this.matchMarket = event.data?.mkCount as number;
  }

  /** nt1001 红包开始事件 */
  onRedEnvelopeStart (event: any) {
    this.activityInfo = {
      actId: event.data.actId,
      show: true,
    };
  }

  /** nt1002 红包结束事件 */
  onRedEnvelopeEnd (event: any) {
    if (this.activityInfo?.actId !== event.data.actId) {
      return;
    }
    this.activityInfo = {
      actId: event.data.actId,
      show: false,
    };
  }

  /** 推送事件 */
  @action
  onDataChange (event: PushEvent) {
    this.events[event.nt as number](event);
  }

  /** 计算篮球各阶段比分 */
  calcBasketballPeriodScore () {
    if (
      this.sportId !== Sports.BASKETBALL
      ||
      !this.isLive
    ) {
      return;
    }

    const group = GroupOfMarket.SCORE;

    if (!this.matchResult) {
      this.matchResult = [];
    }

    let period = this.matchPeriod as number;
    if (this.gameSession as number <= 2) {
      period = ({ 1: MarketStage.PERIOD_H1, 2: MarketStage.PERIOD_H2 } as any)[period];
    }
    // 如果是单节
    if (period < MarketStage.PERIOD_H1) {
      const stage = period + 50;
      // 获取并设置当前节比分
      this.setResultScore({
        marketGroup: group,
        marketStage: stage,
        score: this.calcCurrentStageResult()
      })

      // 计算上半场
      if (
        stage === MarketStage.Q1
        ||
        stage === MarketStage.Q2
      ) {
        this.setResultScore({
          marketGroup: group,
          marketStage: MarketStage.H1,
          score: this.reduceResults(mr => (
            mr.marketGroup === group
            &&
            [MarketStage.Q1, MarketStage.Q2].includes(mr.marketStage)
          ))
        });
      }

      // 计算下半场
      if (stage >= MarketStage.Q3) {
        this.setResultScore({
          marketGroup: group,
          marketStage: MarketStage.H2,
          score: this.reduceResults(mr => (
            mr.marketGroup === group
            &&
            [MarketStage.Q3, MarketStage.Q4].includes(mr.marketStage)
          ))
        });
      }
      return;
    }

    // 当前为上半场
    if (period === MarketStage.PERIOD_H1) {
      this.setResultScore({
        marketGroup: group,
        marketStage: MarketStage.H1,
        score: this.score.join(':')
      });
      return;
    }

    // 当前为下半场
    if (period === MarketStage.PERIOD_H2) {
      const h1Score = this.getResultScore(
        group,
        MarketStage.H1
      ).split(':');
      const h0Score = this.score;

      this.setResultScore({
        marketGroup: group,
        marketStage: MarketStage.H2,
        score: [
          Number(h0Score[0]) - Number(h1Score[0]),
          Number(h0Score[1]) - Number(h1Score[1])
        ].join(':')
      });
    }
  }

  /** 往比赛中添加玩法 */
  @action
  addMarkets (...markets: any[]) {
    if (!markets.length) {
      return;
    }

    markets.forEach(market => {
      let marketGroup = this.marketGroups.find(group => group.equals(market));
      if (!marketGroup) {
        marketGroup = new MarketGroup(market);
        this.marketGroups.push(marketGroup);
      }
      marketGroup.add(market);
    });

    this.marketGroups.forEach(
      group => group.sort()
    )
  }

  /** 根据点水更新比分 */
  @action
  setScoreByQuote (score: string, marketGroup: GroupOfMarket) {
    if (marketGroup === GroupOfMarket.CORNER) {
      this.matchStatistic = {
        ...this.matchStatistic,
        corners: score
      };
      return;
    }
    this.liveScore = {
      ...this.liveScore,
      score: score
    };
  }

  /** 获取指定玩法分组 */
  @computed
  getMarketGroup (listMarket: ListMarket): MarketGroup | undefined {
    if (!listMarket) {
      return undefined;
    }

    const target = {
      ...listMarket,
      marketGroup: 1,
      marketParam: 0
    };

    return this.marketGroups.find(
      group => group.equals(target)
    );
  }

  /** 获取列表玩法所有的主盘 */
  @computed
  getMainMarkets (): Array<Market | undefined> {
    return LIST_MARKETS[this.sportId].map(
      (listMarket: any) => {
        const group = this.getMarketGroup(listMarket)
        if (group) {
          return group.mainMarket;
        }
        return undefined;
      }
    );
  }

  /** 获取列表玩法指定索引处盘口 */
  @computed
  getMarkets (index: number): Array<Market | undefined> {
    return LIST_MARKETS[this.sportId].map(
      (listMarket: any) => {
        const group = this.getMarketGroup(listMarket)
        if (group) {
          return group.get(index);
        }
        return undefined;
      }
    );
  }
  /** 获取指定类别的玩法 */
  @computed
  categoryMarkets(category: string | number, combo: boolean | undefined = false) {
    // 根据条件过滤出玩法
    const markets = this.marketGroups.filter(
      group => {
        // 玩法没有投注项则不显示  
        if (!group.size) {
          return false;
        }
        // 角球和谁先开球不支持串关, 所以需要过滤掉  
        if (
          combo
          &&
          group.marketGroup !== GroupOfMarket.SCORE
        ) {
          return false;
        }
        // 全部  
        if (category === MarketCategory.ALL) {
          return true;
        }

        // 其他情况分拣
        switch (category) {
          // 主要玩法
          case MarketCategory.FAVORITE:
            return (
              group.marketCategory === MarketCategory.FAVORITE
              &&
              group.marketGroup === GroupOfMarket.SCORE
            );
          // 半场玩法
          case MarketCategory.HALF:
            return (
              // 取上半场和下半场
              [
                MarketStage.H1,
                MarketStage.H2
              ].includes(group.marketStage)
              &&
              // 半场玩法, 不包含半场角球
              group.marketGroup !== GroupOfMarket.CORNER
            );
          // 角球玩法
          case MarketCategory.CORNER:
            return group.marketGroup === GroupOfMarket.CORNER;
          // 单节玩法
          case MarketCategory.QUARTER:
            return (
              [
                MarketStage.Q1,
                MarketStage.Q2,
                MarketStage.Q3,
                MarketStage.Q4
              ].includes(group.marketStage)
            );
        }

        return group.marketCategory === category;
      }
    );

    // 排序
    return markets.sort((m1: MarketGroup, m2: MarketGroup) => {
      // 谁先开球玩法排到第一个位置
      if (m1.marketGroup === GroupOfMarket.FIRSTKICKOFF) {
        return -1;
      }
      if (m2.marketGroup === GroupOfMarket.FIRSTKICKOFF) {
        return 1;
      }
      // 角球排到最后
      if (m1.marketGroup !== m2.marketGroup) {
        return m1.marketGroup - m2.marketGroup;
      }
      // 半场玩法排到全场之后
      if (m1.marketStage !== m2.marketStage) {
        return m1.marketStage - m2.marketStage
      }
      // 按配置排序
      return m1.orderNo - m2.orderNo;
    });
  }

  /**
   * 获取篮球在 resultScore中无法找到值的比分
   *
   * @param marketStage 阶段
   */
  calcCurrentStageResult () {
    // 计算当前节:
    // 当前节为 当前总比分减去之前所有节的比分总和
    // 使用array的reduce计算
    // * 当前总比分为 +
    // * 之前所有节的比分为 -
    // 依此累加
    return (
      [
        // 添加当前总比分到数组
        {
          marketGroup: GroupOfMarket.SCORE,
          marketStage: MarketStage.H0,
          score: this.liveScore.score,
        },
        // 其他节
        ...(
          this.matchResult?.filter(mr => (
            mr.marketStage > 50
            &&
            mr.marketStage < Number(this.matchPeriod) + 50
          )) || []
        )
      ].reduce(
        (previous, current) => {
          // 上一次计算出的分数
          const preScore = previous.split(':');
          // 本次迭代比分
          const curScore = current.score.split(':');

          const symbol = (
            current.marketStage === MarketStage.H0
            ? 1
            : -1
          )

          return (
            `${
              Number(preScore[0]) + (symbol * (Number(curScore[0]) || 0))
            }:${
              Number(preScore[1]) + (symbol * (Number(curScore[1]) || 0))
            }`
          );
        },
        '0:0'
      )
    );
  }

  /** 计算指定阶段的分数 */
  reduceResults (filter: (mr: any) => boolean): string {
    return this.matchResult?.filter(filter).reduce(
      (previous, current: any) => {
        // 上一次计算出的分数
        const preScore = previous.split(':');
        // 本次迭代比分
        const curScore = current.score.split(':');

        return (
          `${
            Number(preScore[0]) + (Number(curScore[0]) || 0)
          }:${
            Number(preScore[1]) + (Number(curScore[1]) || 0)
          }`
        );
      },
      '0:0'
    ) || '-:-';
  }

  /**
   * 设置指定阶段比分
   *
   * @param marketGroup 比分所属分组
   * @param marketStage 比分阶段
   * @param score 比分
   */
  setResultScore (
    data: {
      marketGroup: number,
      marketStage: number,
      score: string
    }
  ) {
    if (!this.matchResult) {
      this.matchResult = [];
    }

    // 查找当前节
    let srIndex = this.matchResult.findIndex(sr => (
      sr.marketGroup === data.marketGroup
      &&
      sr.marketStage === data.marketStage
    ));
    // 如果未找到,则直接添加
    if (srIndex === -1) {
      this.matchResult.push(data);
    } else {
      this.matchResult[srIndex] = data;
    }
  }

  /**
   * ### 获取已确定阶段比分
   *
   * @param marketGroup 分组
   * @param marketStage 阶段
   * @param defaultValue 默认值
   */
  @computed
  getResultScore (
    marketGroup: number,
    marketStage: number,
    defaultValue?: string
  ) {
    // 从查询结果中获取
    const rescore = this.matchResult?.find(
      r => (
        r.marketGroup === marketGroup
        &&
        r.marketStage === marketStage
      )
    )?.score;

    return (
      rescore
      ||
      defaultValue
      ||
      ':'
    );
  }

  /** 获取网球, 排球, 冰球, 棒球等体育项的滚球各阶段比分 */
  get gameScore () {
    if (!this.liveScore.gameScore) {
      return [];
    }

    let scores: Array<string> = (
      this.liveScore?.gameScore.split(',')
    );

    if (this.isLive) {
      scores = scores.slice(0, this.gameSession)
    }

    if (!scores) {
      return [];
    }

    return (
      scores.map(
        s => s.split(':')
      )
    );
  }

  /** 当前比赛的阶段值 */
  get currPeriod () {
    if (
      this.sportId === Sports.BASEBALL
      &&
      this.gameSession === 2
    ) {
      return ({1: MarketStage.PERIOD_H1, 2: MarketStage.PERIOD_H2 } as any)[this.matchPeriod as number];
    }
    return this.matchPeriod;
  }

  /** 获取lmt的id */
  @computed
  get lmtId () {
    return this.provider?.betradarKey?.replace('sr:match:', '')
  }

  /** 获取是否滚球中 */
  @computed
  get isLive () {
    return this.matchState === MatchState.LIVE;
  }

  /** 获取直播地址 */
  @computed
  get videoSrc () {
    return this.isLive ? this.liveUrl : null
  }

  /** 获取多媒体列表 */
  get medias () {
    const arr: MediaType[] = [];

    if (this.isLive && this.liveUrl) {
      arr.push(MediaType.VIDEO);
    }

    if (this.lmtId) {
      arr.push(MediaType.LMT)
    }

    return arr;
  }

  /** 获取当前比分 */
  @computed
  get score () {
    if (!this.isLive) {
      return null;
    }
    let score = this.liveScore?.score;
    // 如果当前为滚球并且暂未获取到比分信息则设置为0:0
    if (
      this.matchState === MatchState.LIVE
      &&
      !score
    ) {
      score = '0:0';
    }
    return score?.split(':');
  }

  /** 获取红牌数 */
  @computed
  get redCard () {
    return this.matchStatistic?.redCard?.split(':');
  }

  /** 获取分类列表 */
  @computed
  get categories () {
    const allCategories:Array<number> = [];

    this.marketGroups.forEach(
      group => {
        // 如果无option或者是谁先开球的分组则不添加到任何其他分组中
        if (
          !group.size
          ||
          group.marketGroup === GroupOfMarket.FIRSTKICKOFF
        ) {
          return
        }

        let category = group.marketCategory;

        // 针对足球和篮球特殊分类规则处理
        switch (this.sportId) {
          // 足球的角球和半场处理
          case Sports.SOCCER:
            /*
             * 角球玩法分拣到角球中
             * 半场角球也只放到角球分组中
             * 不在半场分组中显示
             */
            if (group.marketGroup === GroupOfMarket.CORNER) {
              category = MarketCategory.CORNER;
            }
            // 半场单独分拣到半场分组中
            else if ([MarketStage.H1, MarketStage.H2].includes(group.marketStage)) {
              category = MarketCategory.HALF;
            }
            break;
          // 篮球的单节玩法处理
          case Sports.BASKETBALL:
            if (
              [
                MarketStage.Q1,
                MarketStage.Q2,
                MarketStage.Q3,
                MarketStage.Q4
              ].includes(group.marketStage)
            ) {
              category = MarketCategory.QUARTER;
            }
            break;
        }

        if (
          category !== 0
          &&
          !allCategories.includes(category)
        ) {
          allCategories.push(category);
        }
      }
    );

    if (allCategories.length) {
      allCategories.unshift(MarketCategory.ALL);
    }

    /** 玩法排序 */
    return allCategories.sort((v1, v2) => v1 - v2);
  }

  /** 获取活动id */
  @computed
  get actId () {
    const actId = this.activityInfo?.actId;
    if (
      this.isLive
      &&
      Boolean(actId)
      &&
      actId !== '0'
    ) {
      return actId;
    }
    return undefined;
  }

  @computed
  get teamLogo1 () {
    if (
      [
        Sports.SOCCER,
        Sports.BASKETBALL,
        Sports.ESPORTS
      ].includes(this.sportId)
    ) {
      return this.logo1;
    }

    return undefined;
  }
  @computed
  get teamLogo2 () {
    if (
      [
        Sports.SOCCER,
        Sports.BASKETBALL,
        Sports.ESPORTS
      ].includes(this.sportId)
    ) {
      return this.logo2;
    }

    return undefined;
  }
}
