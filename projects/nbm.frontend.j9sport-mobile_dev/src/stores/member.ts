import { makeAutoObservable, action, computed } from 'mobx';

import { FavoriteType } from '../consts/match';
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage
} from '../utils/StorageUtils';

import { CacheKeys } from '../consts/app';

/** 用户相关store */
class MemberStore {

  /** 已登录用户信息 */
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

  constructor () {
    makeAutoObservable(this);
    this._info = {
      token: loadFromStorage(CacheKeys.STORE_MEMBER)
    };
  }

  /** 序列化到缓存中 */
  private serialize () {
    saveToStorage(
      CacheKeys.STORE_MEMBER,
      this.token
    );
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

  /** 刷新余额 */
  @action
  reload () {
    this._reloadVersion = this._reloadVersion + 1;
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
  get token (): string | undefined | null {
    if (!this._info) {
      return null
    }
    return this._info.token;
  }

  /** 是否已登录 */
  @computed
  get isLoged (): boolean {
    return Boolean(this._info?.customerId);
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
  /** 用户余额 */
  @computed
  get balance () {
    return +Number(this._info?.balance || 0).toFixed(2);
  }
  /** 设置用户余额 */
  set balance (newBalance: number) {
    this._info.balance = newBalance
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
}

export default new MemberStore()
