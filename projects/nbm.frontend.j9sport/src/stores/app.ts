import { makeAutoObservable, action, toJS } from 'mobx';

import { saveToStorage, loadFromStorage, clearStorage } from '../utils/StorageUtils';

import AppConfig from '../configs';

import {
  Locales,
  DEFAULT_LOCALE,
  CacheKeys,
  DEFAULT_SETTINGS,
  SkinType,
  GoalSoundType,
  ClientTypes,
  CACHE_VERSION
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

  /** 当前客户端类型 */
  private _clientType: ClientTypes = ClientTypes.H5_PC;
  /** 来源类型 1: 普通页面, 2: 二级页面 */
  private _originType?: ClientTypes = 1;
  /** 来源地址 */
  private _origin?: any;
  /** 登录地址 */
  private _loginUrl?: any = '';
  /** 页面跳转过来的请求参数 */
  private _queryString?: string;

  /** 在线客服地址 */
  // private _customerServiceUrl: string = '';

  /** 是否为直接访问本页面或在当前页面刷新过 */
  private _firstRoute: boolean = true;
  /** 当前系统状态 */
  private _systemState: SystemState;

  /** 商户id */
  public frontId: string = AppConfig.FRONT_ID;

  constructor () {
    // 设置当前对象为observeable
    makeAutoObservable(this);

    if (!window['__J9SPORT_WIDGET_MODE__' as any]) {
      // 清空缓存
      let cache = loadFromStorage(CacheKeys.CACHE_VERSION)
      if (
        !cache
        ||
        CACHE_VERSION !== cache.version
        ||
        /j9Token/gi.test(window.location.search)
      ) {
        clearStorage();
        cache = {
          version: CACHE_VERSION,
        }
        saveToStorage(CacheKeys.CACHE_VERSION, cache);
      }

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
    }


    const search = window.location.search;
    const params = new URLSearchParams(search);
    const locale = params.get('locale') as Locales;
    if (locale) {
      this._locale = locale;
    } else if (!this._locale) {
      this._locale = DEFAULT_LOCALE;
    }

    this._systemState = new SystemState();
    // eslint-disable-next-line
    this.skin = this.skin;
  }

  /** 序列化到缓存中 */
  private serialize () {
    try {
      if (!window['__J9SPORT_WIDGET_MODE__' as any]) {
        saveToStorage(
          CacheKeys.STORE_APP,
          toJS(this)
        );
      }
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

  set clientType (clientType: ClientTypes) {
    this._clientType = clientType;
  }
  get clientType (): ClientTypes {
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
    this.serialize()
  }

  get origin (){
    return this._origin;
  }

  set loginUrl (loginUrl: string) {
    this._loginUrl = loginUrl;
    this.serialize()
  }

  get loginUrl() {
    return this._loginUrl;
  }

  @action
  setSettings (settings: any) {
    this._accept_amount = settings.acceptAmount;
    this._locale = settings.locale.split('-')[0];
    this._odds_accept = settings.oddsAccept;
    this.skin = (
      [SkinType.WHITE, SkinType.BLACK].includes(settings.theme)
      ? settings.theme
      : SkinType.WHITE
    );
  }

  set queryString (queryString: string | undefined) {
    this._queryString = queryString;
  }

  get queryString (): string | undefined {
    return this._queryString;
  }

  // get customerServiceUrl () : string {
  //   return this._customerServiceUrl;
  // }

  // set customerServiceUrl (url: string) {
  //   this._customerServiceUrl = url;
  // }
}

export default new AppStore();
