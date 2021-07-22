import { makeAutoObservable, action, computed } from 'mobx';

enum OddsStatus {
  NORMAL = 'normal',
  UPPER = 'upper',
  LOWER = 'lower',
}

/** 投注项store */
export default class Option {
  /** 投注项id */
  readonly optionId: string;
  /** 投注项标识 */
  readonly betOption: string;
  /** 排序依据字段 */
  readonly orderNo: number;
  /** 赔率 */
  odds: number;
  /** 串关赔率 */
  comboOdds: number;
  /**
   * 投注项状态  
   *
   * -1: 可见不可投  
   *  0: 不可见  
   *  1: 可见可投  
   */
  status: number;
  /** 赛前累计投注额 */
  earlyAmount?: number;
  /** 赛前累计投注数 */
  earlyCount?: number;
  /** 滚球累计投注额 */
  liveAmount?: number;
  /** 滚球累计投注数 */
  liveCount?: number;
  /**
   * 赔率变化状态  
   * 小于0: 赔率降低
   * 0: 赔率没有变化
   * 大于0: 赔率升高
   */
  private _oddsStatus: number = 0;
  /** 赔率变化复原定时对象 */
  private timer: any;

  /**
   * 构造函数  
   * @param initData 初始化数据  
   *```typescript
   *   {  
   *      // 投注项id  
   *      optionId: string,
   *      // 投注项标识  
   *      betOption: string,
   *      // 赔率  
   *      odds: number,
   *      // 投注项状态 -1: 可见不可投,0: 不可见,1: 可见可投 
   *      status: number,
   *      // 排序依据字段  
   *      orderNo: number,
   *      // 赛前累计投注额  
   *      earlyAmount?: number,
   *      // 赛前累计投注数  
   *      earlyCount?: number,
   *      // 滚球累计投注额  
   *      liveAmount?: number,
   *      // 滚球累计投注数  
   *      liveCount?: number,
   *      // 赔率变化状态 小于0: 赔率降低, 0: 赔率没有变化, 大于0: 赔率升高
   *      oddsStatus?: number,
   *   }
   *```
   */
  constructor (init: any) {
    this.optionId = init.optionId;
    this.betOption = init.betOption;
    this.orderNo = init.orderNo;
    this.odds = init.odds;
    this.comboOdds = init.comboOdds;
    this.status = init.status;
    this.earlyAmount = init.earlyAmount;
    this.earlyCount = init.earlyCount;
    this.liveAmount = init.liveAmount;
    this.liveCount = init.liveCount;

    // 设置当前对象为observeable
    makeAutoObservable(this);
  }

  /** 推送的变化处理 */
  @action
  onOddsChange (
    opt: {
      bst: number,
      odds?: number,
      comboOdds?: number,
    }
  ) {
    let oldOdds, newOdds;

    this.status = opt.bst;

    if (opt.odds) {
      oldOdds = this.odds;
      newOdds = opt.odds;

      this.odds = opt.odds;
    }

    if (opt.comboOdds) {
      if (!oldOdds || !newOdds) {
        oldOdds = this.comboOdds;
        newOdds = opt.comboOdds;
      }
      this.comboOdds = opt.comboOdds;
    }

    if (oldOdds && newOdds) {
      this._oddsStatus = newOdds - oldOdds;
      this.timer = setTimeout(
        action(() => this._oddsStatus = 0),
        1500
      );
    }
  }
  
  @action
  destory () {
    this._oddsStatus = 0;
    clearTimeout(this.timer);
  }

  /** 获取赔率 */
  @computed
  getOdds (combo = false) {
    const value = combo ? this.comboOdds : this.odds;
    return value.toFixed(2);
  }

  /**
   * 当前赔率状态
   *
   * * upper 升
   * * lower 降
   * * normal 无变化
   */
  @computed
  get oddsStatus () {
    if (this._oddsStatus === 0) {
      return OddsStatus.NORMAL;
    }

    return (
      this._oddsStatus > 0
      ? OddsStatus.UPPER
      : OddsStatus.LOWER
    );
  }
}
