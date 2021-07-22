import { makeAutoObservable, action, computed } from 'mobx';

import { FavoriteType } from '../consts/match';
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage
} from '../utils/StorageUtils';
import AppConfig from '../configs';

import { CacheKeys } from '../consts/app';

/** 用户相关store */
class MemberStore {

  /** 已登录用户信息 */
  private _info?: any | null;

  /** 收藏的比赛列表 */
  private _favMatchs: Array<string> = [];
  /** 收藏的联赛列表 */
  private _favTours: Array<string> = [];

  private _reloadVersion: number = 1;
  /** 当前收藏的比赛数量 */
  private _favCount: number = 0;

  /** 刷新余额加载中 */
  reloadLoading = false;
  /** 独立站余额*/
  private _j9Balance = {
    sportBalance: 0,
    withdrawableBalance: 0,
    exchangeRate: 0,
    gameBalance: 0,
    integral: 0,
    level: 0,
    localBalance: 0,
    totalBalance: 0,
    totalCNYBalance: 0,
    transferAmount: 0,
    targetBalance: 0,
  }
  /** 独立站余额加载状态*/
  private _j9Reloading = false

  /** 控制拉取本地余额弹窗显示*/
  private _j9TransModalVisible = false
  /**  */
  private _j9ReloadReadOnly = false;

  /** 与主站额度互转中 */
  creditTransfering = false;

  constructor () {
    makeAutoObservable(this);
    if (!window['__J9SPORT_WIDGET_MODE__' as any]) {
      this._info = loadFromStorage(CacheKeys.STORE_MEMBER)
    }
  }

  /** 序列化到缓存中 */
  private serialize () {
    if (!window['__J9SPORT_WIDGET_MODE__' as any]) {
      saveToStorage(
        CacheKeys.STORE_MEMBER,
        {
          nbToken: this.nbToken,
          agToken: this.agToken
        }
      );
    }
  }

  /** 用户信息 */
  @action
  set memberInfo (memberInfo: any | null) {
    this._info = memberInfo;
    if (memberInfo) { 
      this.serialize ();
    } else {
      removeFromStorage(CacheKeys.STORE_MEMBER);
    }
  }

  /** 批量设置收藏的比赛和联赛 */
  @action
  setFavs (favs: Array<any>) {
    this.clearFav();
    favs.forEach(item => {
      if (item.favType === FavoriteType.TOURNAMENT) {
        this._favTours.push(item.objId);
      } else {
        this._favMatchs.push(item.objId);
      }
    })
  }

  /** 添加到收藏 */
  @action
  addFav (id: string, type: number) {
    if (type === FavoriteType.TOURNAMENT) {
      this._favTours.push(id);
    } else {
      this._favMatchs.push(id);
    }
  }

  /** 取消收藏 */
  @action
  cancelFav (id: string, type: number) {
    const list = (
      type === FavoriteType.TOURNAMENT
      ? this._favTours
      : this._favMatchs
    );
    const index = list.indexOf(id);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  /** 清空收藏 */
  @action
  clearFav () {
    this._favMatchs = [];
    this._favMatchs = [];
  }

  set favCount (favCount: number) {
    this._favCount = favCount;
  }
  
  get favCount () {
    return this._favCount;
  }

  /** 是否已经添加到收藏中 */
  @computed
  isFavorited (id: string, type: number) {
    return (
      type === FavoriteType.TOURNAMENT
      ? this._favTours.includes(id)
      : this._favMatchs.includes(id)
    );
  }

  /** 用户token */
  @computed
  get nbToken(): string | undefined | null {
    if (!this._info) {
      return null
    }
    return this._info.nbToken;
  }

  /** 用户token */
  @computed
  get agToken(): string | undefined | null {
    if (!this._info) {
      return null
    }
    return this._info.agToken;
  }

  /** 是否已登录 */
  @computed
  get isLoged (): boolean {
    // return Boolean(this._info?.customerId);
    return Boolean(this._info?.nbToken);
  }

  /** 获取用户id */
  @computed
  get userId (): string | undefined {
    if(!this._info) {
      return undefined;
    }
    return this._info.userId
  }

  /** 用户账号 */
  @computed
  get username () {
    return this._info?.customerId;
  }

  /** 刷新余额 */
  @action
  reload(onlyRead: boolean = false) {
    this._reloadVersion = this._reloadVersion + 1;
    this._j9ReloadReadOnly = onlyRead;
  }

  /** 用户余额 */
  @computed
  get balance() {
    if (AppConfig.THIRD_MODE) {
      return this._info?.balance;
    }
    return this._j9Balance.targetBalance;
  }

  /** 设置用户余额 */
  set balance(newBalance: number) {
    if (AppConfig.THIRD_MODE) {
      this._info.balance = newBalance;
    }
    this._j9Balance.targetBalance = newBalance;
  }

  /** 独立站余额 */
  get j9Balance() {
    return this._j9Balance
  }
  /** 设置独立站余额*/
  set j9Balance(newBalance) {
    this._j9Balance = newBalance;
  }

  /** 独立站余额请求状态 */
  @computed
  get j9Reloading() {
    return this._j9Reloading;
  }

  /** 设置独立站余额请求状态 */
  set j9Reloading(status: boolean) {
    this._j9Reloading = status
  }

  /** 拉取本地余额弹窗显示*/
  get j9TransModalVisible() {
    return this._j9TransModalVisible;
  }

  /** 设置拉取本地余额弹窗显示*/
  set j9TransModalVisible(status) {
    this._j9TransModalVisible = status
  }

  /** 1, 2, 101 */
  @computed
  get currency (): any {
    return this._info?.currency || 1;
  }

  /** 用户信息 */
  get memberInfo (): any | null {
    return this._info;
  }

  @computed
  get reloadVersion () {
    return this._reloadVersion;
  }

  get reloadOnlyRead () {
    return this._j9ReloadReadOnly;
  }

  /** 登录 */
  login(
    memberInfo: {
      agToken: string,
      nbToken: string
    }) {
    this.memberInfo = memberInfo;
  }
}

export default new MemberStore()
