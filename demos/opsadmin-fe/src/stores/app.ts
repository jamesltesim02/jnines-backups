import { makeAutoObservable, action, toJS } from 'mobx';

import { saveToStorage, loadFromStorage } from '../utils/StorageUtils';
import { Locales, DEFAULT_LOCALE, CacheKeys } from '../consts/app';

/**
 *  app相关store
 */
class AppStore {

  /** 当前系统语言 */
  private _locale:Locales = DEFAULT_LOCALE;

  constructor () {
    // 设置当前对象为observeable
    makeAutoObservable(this);

    // 从缓存加载并初始化
    Object.assign(
      this,
      loadFromStorage(
        CacheKeys.STORE_APP,
        {
          _locale: DEFAULT_LOCALE
        }
      )
    );
  }

  /** 序列化到缓存中 */
  private serialize () {
    saveToStorage(
      CacheKeys.STORE_APP,
      toJS(this)
    );
  }

  /** 当前语言环境 */
  @action
  set locale (locale: Locales) {
    this._locale = locale;
    this.serialize();
  }

  /** 当前语言环境 */
  get locale (): Locales{
    return this._locale;
  }

}

export default new AppStore();
