import { makeAutoObservable, action, computed } from 'mobx';
import { PushMarket, PushOption } from '../../components/push/PushConnection';
import { OptionStatus } from '../../consts/match';

import Option from './Option';

/** 波胆玩法类型值 */
const CORRECT_MARKET = 45;

/** 详情中玩法每行最大数量 */
const FLOW_MAP: any = {
  // 精准进球数
  21: 2,
  // 总分范围
  25: 3,
  // 净胜球数
  27: 2,
  // // 得分球队
  // 30: 2,
  // 主队准确得分
  31: 2,
  // 客队准确得分
  32: 2,
  // 零失球
  37: 2,
  // 首先/最后进球
  38: 2,
  // 波胆(正确比分)
  45: 3,
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
  290: 2,
  // 第x图精准得分
  9088: 2,
  /** 赛果/大小 */
  144: 3,
  /** 双胜彩/大小 */
  449: 3,
  /** 两队均得分/双胜彩 */
  451: 3,
  /** 单双/大小 */
  450: 2,
};

/** 玩法信息store */
export default class Market {

  /** 玩法id */
  readonly marketId: string;
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
  /** 电竞的第x值 */
  marketParam: number;
  /** 球头 */
  betBar: string;
  /** 是否为主盘 */
  main: boolean = false;
  /** 投注项列表 */
  options: Array<Option> = [];

  /** 构造函数 */
  constructor (init: any) {
    this.marketId = init.marketId;
    this.matchId = init.matchId;
    this.marketType = init.marketType;
    this.marketGroup = init.marketGroup;
    this.marketStage = init.marketStage;
    this.orderNo = init.orderNo;
    this.marketCategory = init.marketCategory;
    this.combo = init.combo;
    this.betBar = init.betBar;
    this.main = init.main;
    this.marketParam = init.marketParam;
    this.add(...init.options);
    // 设置当前对象为observeable
    makeAutoObservable(this);
  }

  @action
  add (...options: Array<any>) {
    options.forEach(o => {
      if (o.status !== OptionStatus.HIDDEN) {
        this.options.push(new Option(o));
      }
    });
  }

  @action
  remove (optionId: string) {
    const index = this.options.findIndex(opt => opt.optionId === optionId);
    if (index > -1) {
      this.options[index].destory();
      this.options.splice(index, 1);
    }
  }

  /** 更新betBar值 */
  @action
  setBetBar (betBar: string) {
    this.betBar = betBar;
  }

  /** 点水后更新玩法 */
  @action
  updateByQuote (
    {
      optionId,
      odds,
      comboOdds,
      status,
      betBar
    }: {
      optionId: string,
      odds?: number,
      comboOdds?: number,
      status: number,
      betBar: string
    }
  ) {
    this.betBar = betBar;
    const option = this.options.find(o => o.optionId === optionId);
    if (option) {
      option.onOddsChange({
        bst: status,
        odds,
        comboOdds
      });
    }
  }

  /** 赔率或投注项发生变化 */
  @action
  onOddsChange (mk: PushMarket) {
    this.betBar = mk.betbar;
    this.marketParam = mk.mParam;
    this.main = mk.ism;

    mk.ops.forEach((po: PushOption) => {
      // 不可见则删除
      if (po.bst === OptionStatus.HIDDEN) {
        this.remove(po.oid);
        return;
      }

      const option = this.options.find(
        o => o.optionId === po.oid
      );
      // 不存在则添加
      if (!option) {
        this.add({
          optionId: po.oid,
          betOption: po.bop,
          odds: po.odds,
          comboOdds: po.comboOdds,
          status: po.bst,
          orderNo: po.num
        });
        return;
      }

      // 触发投注项事件
      option.onOddsChange(po);
    });
  }

  /** 获取option的数量 */
  @computed
  get size () {
    return this.options.length;
  }

  /** 获取已排序后的options */
  @computed
  get sortedOptions () {
    if (this.marketType === CORRECT_MARKET) {
      return this.getCorrectOptions();
    }
    let options: Array<Option | undefined> = [...this.options].sort(
      (o1, o2) => o1.orderNo - o2.orderNo
    );
    if (this.colums) {
      const needCound = this.colums - (options.length % this.colums);
      if (needCound > 0 && needCound !== this.colums) {
        for (let i = 0; i < needCound; i++) {
          options.push(undefined);
        }
      }
    }
    return options;
  }

  /** 当前玩法投注项列数 */
  get colums (): number | undefined {
    return FLOW_MAP[this.marketType];
  }

  /** 分拣波胆的options */
  getCorrectOptions () {
    const optCols: Array<Array<Option>> = [[], [], []];
    let otherOption = null;
    this.options.forEach(o => {
      if (!/\d+:\d+/i.test(o.betOption)) {
        otherOption = o;
        return;
      }

      const values = o.betOption.split(/[-:]/);
      let columnIndex = 0;

      if (values[0] === values[1]) {
        columnIndex = 1;
      } else if (values[0] < values[1]) {
        columnIndex = 2;
      }

      optCols[columnIndex].push(o);
    });
    
    if (otherOption) {
      optCols[1].push(otherOption);
    }

    optCols[0].sort((o1, o2) => {
      const bo1 = (o1.betOption || '0:0').split(':');
      const bo2 = (o2.betOption || '0:0').split(':');
      
      const s1 = Number(bo1[0]) - Number(bo2[0]);
      if (s1 !== 0) {
        return s1;
      }

      return Number(bo1[1]) - Number(bo2[1])
    })

    optCols[2].sort((o1, o2) => {
      const bo1 = (o1.betOption || '0:0').split(':')
      const bo2 = (o2.betOption || '0:0').split(':')
      
      const s1 = Number(bo1[1]) - Number(bo2[1]);
      if (s1 !== 0) {
        return s1;
      }

      return Number(bo1[0]) - Number(bo2[0]);
    })

    const groups = [];
    const groupLength = Math.max(...optCols.map(col => col.length));
    for (let i = 0; i < groupLength; i++) {
      groups.push(
        optCols[0][i],
        optCols[1][i],
        optCols[2][i]
      );
    }

    return groups;
  }
}
