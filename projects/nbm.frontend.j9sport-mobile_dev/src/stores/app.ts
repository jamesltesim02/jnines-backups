import { makeAutoObservable, action, toJS } from 'mobx';

import { saveToStorage, loadFromStorage } from '../utils/StorageUtils';

import {
  Locales,
  DEFAULT_LOCALE,
  CacheKeys,
  DEFAULT_SETTINGS,
  SkinType,
  GoalSoundType
} from '../consts/app';

/** 系统状态 */
class SystemState {
  /** 客户ip */
  clientIP?: string = undefined;
  /** 是否地域限制 403 */
  forbbiden?: boolean = false;
  /** 是否大维护 503 */
  maintenance?: boolean = false;
  /** 是否小维护 503 */
  tempmaintenance?: boolean = false;
  /** 维护时间 */
  maintenancetime?: any = null;

  constructor (state?: any) {
    if (state) {
      this.forbbiden = state.forbbiden;
      this.clientIP = state.clientIP;
      this.maintenance = state.maintenance;
      this.tempmaintenance = state.tempmaintenance;
      this.maintenancetime = state.maintenancetime;
    }
  }

  get mainting () {
    return this.maintenance || this.tempmaintenance;
  }
}

/**
 *  app相关store
 */
class AppStore {

  /** 当前系统语言 */
  private _locale: Locales = DEFAULT_LOCALE;
  private _skin_type = DEFAULT_SETTINGS._skin_type
  private _accept_amount = DEFAULT_SETTINGS._accept_amount
  private _odds_accept = DEFAULT_SETTINGS._odds_accept
  private _goal_sound = DEFAULT_SETTINGS._goal_sound
  private __match_orderBy = DEFAULT_SETTINGS._match_orderBy

  /** 
   * ### 终端类型  
   *
   * 1: MoH5-手机端H5  
   * 2: PcH5-PC端H5  
   * 3: AndroidApp-android客户端  
   * 4: AndroidH5-android H5  
   * 5: IosApp-ios 客户端   
   * 6: IosH5-ios H5  
   * 7: QMoH5-快捷投注手机H5  
   * 8: QPcH5-快捷投注PCH5  
   * 9: Cocos-游戏终端  
   */
  private _clientType?: number = 1;
  /** 来源类型 1: 普通页面, 2: 二级页面 */
  private _originType?: number = 1;
  /** 来源地址 */
  private _origin?: any;
  /** 页面跳转过来的请求参数 */
  private _queryString?: string;

  /** 是否为直接访问本页面或在当前页面刷新过 */
  private _firstRoute: boolean = true;
  /** 当前系统状态 */
  private _systemState: SystemState;

  /** 当前是否为串关 */
  private _combo: boolean = false;

  /* eslint-disable no-self-assign */
  constructor () {
    // 设置当前对象为observeable
    makeAutoObservable(this);

    // 从缓存加载并初始化
    Object.assign(
      this,
      loadFromStorage(
        CacheKeys.STORE_APP,
        {
          _locale: DEFAULT_LOCALE,
          ...DEFAULT_SETTINGS
        }
      )
    );

    this._systemState = new SystemState();

    this.skin = this.skin;
    this.locale = this.locale;
  }

  /** 序列化到缓存中 */
  private serialize () {
    try {
      saveToStorage(
        CacheKeys.STORE_APP,
        toJS(this)
      );
    } catch (e) {
      console.warn(e);
    }
  }

  @action
  set systemState (state: SystemState) {
    this._systemState = new SystemState(state);
  }

  get systemState () {
    return this._systemState;
  }

  /** 当前语言环境 */
  @action
  set locale (locale: Locales) {
    this._locale = locale;
    const classList = document.body.classList
    classList.remove(this._locale);
    classList.add(locale);
    this.serialize();
  }

  /** 当前语言环境 */
  get locale (): Locales {
    return this._locale.split('-')[0] as Locales;
  }

  /** 皮肤*/
  @action
  set skin (skinType: SkinType) {
    const classList = document.body.classList
    classList.remove(this._skin_type);
    classList.add(skinType);
    this._skin_type = skinType;
    this.serialize();
  }
  /** 皮肤*/
  get skin () {
    return this._skin_type
  }
  /** 进球提示音 */
  get goalSound () {
    return this._goal_sound
  }

  @action
  set goalSound (goalSound: GoalSoundType) {
    this._goal_sound = goalSound
    this.serialize();
  }
  /** 当前可接受赔率方式*/
  @action
  set oddsAccept (accept:number){
    this._odds_accept = accept
    this.serialize();
  }
  /** 当前可接受赔率方式*/
  get oddsAccept () {
    return this._odds_accept
  }
  /** 当前默认金额*/
  @action
  set acceptAmount(amount: number){
    this._accept_amount = amount
    this.serialize()
  }
  /** 当前默认金额*/
  get acceptAmount () {
    return this._accept_amount
  }
  /** 列表排序设置 */
  get matchOrderBy () {
    return this.__match_orderBy
  }
  @action
  /** 列表排序设置 */
  set matchOrderBy (orderBy) {
    this.__match_orderBy = orderBy
    this.serialize()
  }

  set clientType (clientType) {
    this._clientType = clientType;
  }
  get clientType () {
    return this._clientType;
  }
  get originType () {
    return this._originType;
  }

  @action
  set firstRoute (isFirst: boolean) {
    this._firstRoute = isFirst;
  }
  get firstRoute () {
    return this._firstRoute;
  }

  @action
  set origin (origin: any) {
    this._origin = origin;
  }

  get origin (){
    return this._origin;
  }

  set queryString (queryString: string | undefined) {
    this._queryString = queryString;
  }

  get queryString (): string | undefined {
    return this._queryString;
  }

  set combo (combo: boolean) {
    this._combo = combo;
  }

  get combo () {
    return this._combo;
  }
}

export default new AppStore();
