import { makeAutoObservable, action, computed } from 'mobx';
import { PushEvent, PushMarket } from '../../components/push/PushConnection';
import { OptionStatus } from '../../consts/match';

import Market from './Market';

/**
 * 将推送中的market转为系统market
 *
 * @param mk 推送数据的market对象
 * @param event 推送消息对象
 */
export function transferMarkert (mk: PushMarket, event: PushEvent) {
  return ({
    marketId: mk.gid,
    matchId: event.data?.mid,
    marketType: mk.mtype,
    marketGroup: mk.mgroup,
    marketStage: mk.mstage,
    marketCategory: mk.category,
    betBar: mk.betbar,
    main: mk.ism,
    orderNo: mk.num,
    combo: mk.combo,
    marketParam: mk.mParam,
    options: mk.ops.map((o) => ({
      optionId: o.oid,
      betOption: o.bop,
      odds: o.odds,
      comboOdds: o.comboOdds,
      status: o.bst,
      orderNo: o.num
    }))
  })
}

export default class MarketGroup {
  /** 比赛id */
  readonly matchId: string;
  /** 玩法类型 */
  readonly marketType: number;
  /** 玩法分组类别 */
  readonly marketGroup: number;
  /** 玩法阶段 */
  readonly marketStage: number;
  /** 排序 */
  readonly orderNo: number;
  /** 玩法类别(标签) */
  readonly marketCategory: number;
  /** 支持串关数(0: 不支持, 2: 至少2串1, 3: 至少3串1) */
  readonly combo: number;
  /** 分组下的玩法列表 */
  readonly markets: Array<Market> = [];
  /** 电竞的第x值 */
  readonly marketParam: number;

  constructor (
    init: {
      matchId: string,
      marketType: number,
      marketGroup: number,
      marketStage: number,
      orderNo: number,
      marketCategory: number,
      combo: number,
      marketParam: number
    }
  ) {
    this.matchId = init.matchId;
    this.marketType = init.marketType;
    this.marketGroup = init.marketGroup;
    this.marketStage = init.marketStage;
    this.orderNo = init.orderNo;
    this.marketCategory = init.marketCategory;
    this.combo = init.combo;
    this.marketParam = init.marketParam;

    // 设置当前对象为observeable
    makeAutoObservable(this);
  }

  /** 添加玩法到玩法组 */
  @action
  add (data: any) {
    this.markets.push(
      new Market(data)
    );
  }

  /** 从玩法组中删除玩法 */
  @action
  remove (marketId: string) {
    const index = this.markets.findIndex(
      m => m.marketId === marketId
    );
    if (index !== -1) {
      this.markets.splice(index, 1);
    }
  }

  /** 重新排序 */
  @action
  sort () {
    this.markets.sort((m1, m2) => {
      // 让分
      if (this.marketType === 16) {
        return Number(m1.betBar) - Number(m2.betBar);
      }

      // 大小
      if (this.marketType === 18) {
        return Number(m2.betBar) - Number(m1.betBar);
      }

      if (m1.main) {
        return -1;
      }
      if (m2.main) {
        return 1;
      }

      return m2.orderNo - m1.orderNo;
    })
  }

  /** 赔率或状态变化事件 */
  @action
  onOddsChange (mk: PushMarket, event: PushEvent) {
    // 如果盘口变为不可见,则删除该盘口
    if (mk.mstatus === OptionStatus.HIDDEN) {
      this.remove(mk.gid);
      return;
    }

    // 不存在则添加玩法
    const index = this.markets.findIndex(m => m.marketId === mk.gid);
    if (index === -1) {
      this.add(transferMarkert(mk, event));
      return;
    }

    const market = this.markets[index];
    // 触发事件到盘口对象上
    market.onOddsChange(mk);

    if (market.size === 0) {
      this.markets.splice(index, 0);
    }
  }

  /** 主盘变化事件 */
  @action
  onMainMarketChange (mk: PushMarket, event: PushEvent) {
    const oldMain = this.markets.find(m => m.main);
    if (oldMain) {
      oldMain.main = false;
    }

    const newMain = this.markets.find(m => m.marketId === mk.gid);
    if(newMain) {
      newMain.main = true;
    } else {
      this.add(transferMarkert(mk, event));
    }
  }

  /** 判断玩法是否属于同一个玩法分组中 */
  equals (
    {
      marketType,
      marketGroup,
      marketStage,
      marketParam
    }: {
      marketType: number,
      marketGroup: number,
      marketStage: number,
      marketParam: number
    }
  ) {
    return (
      this.marketType === marketType
      &&
      this.marketGroup === marketGroup
      &&
      this.marketStage === marketStage
      &&
      this.marketParam === marketParam
    );
  }

  /** 获取指定位置玩法 */
  @computed
  get (index: number): Market | undefined {
    if (index >= this.markets.length) {
      return undefined;
    }
    return this.markets[index];
  }

  /** 获取主盘 */
  get mainMarket (): Market | undefined {
    return this.markets.find(({ main }) => main)
  }

  /** 获取玩法唯一标志 */
  @computed
  get key () {
    return `${this.marketType}_${this.marketGroup}_${this.marketStage}_${this.marketParam}`;
  }

  /** 获取option的数量 */
  @computed
  get size () {
    return this.markets.reduce(
      (previous: number, market: Market) => previous + market.size,
      0
    );
  }
}


