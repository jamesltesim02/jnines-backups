import { makeAutoObservable } from "mobx";

class GlobalComp {

  /** 入口消息是否已提示 */
  private _hasEnterMsgShown = false;
  /** 首页欧洲杯投注是否已提示 */
  private _hasHomeBetShown = false;

  constructor() {
    makeAutoObservable(this)
  }

  /** 入口消息是否已提示 */
  get hasEnterMsgShown() {
    return this._hasEnterMsgShown;
  };

  /** 入口消息是否已提示 */
  set hasEnterMsgShown(val) {
    this._hasEnterMsgShown = val
  };
  /** 首页欧洲杯投注是否已显示 */
  get hasHomeBetShown () {
    return this._hasHomeBetShown;
  }
  /** 首页欧洲杯投注是否已显示 */
  set hasHomeBetShown (val: boolean) {
    this._hasHomeBetShown = val
  }
}

export default new GlobalComp();