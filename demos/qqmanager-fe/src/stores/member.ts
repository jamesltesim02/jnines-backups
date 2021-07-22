import { makeAutoObservable, action, toJS } from 'mobx';

import { saveToStorage, loadFromStorage } from '../utils/StorageUtils';

import { CacheKeys } from '../consts/app';

/** 用户相关store */
class MemberStore {

  /** 用户token */
  // private _token?: string;
  /** 已登录用户信息 */
  private _info?: any|null;

  constructor () {
    makeAutoObservable(this);

    // 从缓存加载并初始化
    Object.assign(
      this,
      loadFromStorage(CacheKeys.STORE_MEMBER)
    );
  }

  /** 序列化到缓存中 */
  private serialize () {
    saveToStorage(
      CacheKeys.STORE_MEMBER,
      toJS(this)
    );
  }

  /** 用户token */
  get token (): string|undefined|null {
    if (!this._info) {
      return null
    }
    return this._info.token;
  }

  /** 是否已登录 */
  get isLoged (): boolean {
    return Boolean(this._info);
  }

  /** 用户信息 */
  @action
  set memberInfo (memberInfo: any|null) {
    this._info = memberInfo;
    this.serialize ();
  }

  /** 用户信息 */
  get memberInfo (): any|null {
    return this._info;
  }
}

export default new MemberStore()
