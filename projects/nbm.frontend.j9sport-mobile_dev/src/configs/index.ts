import * as LocalConfig from './config.local';
import * as UatConfig from './config.uat';
import * as ProdConfig from './config.prod';

const env = process.env.ENV_TYPE || 'local';

export type UrlsType = {
  /** pull服务接口, 用于查询数据 */
  PULL: string,
  /** 后台系统上传的静态资源CDN地址 */
  RESOURCE_URL: string,
  /** 投注接口地址 */
  BET_URL: string,
  /** 点水接口地址 */
  QUOTE_URL: string,
  /** 推送地址 */
  PUSH_URL: string,
  /** 多媒体资源地址 */
  MEDIA_URL: string,
  /**  默认origin地址, 用于调转登录或存取款 */
  DEFAULT_ORIGIN: string,
  /** 1.0 地址 */
  V1_SITE_URL: string,
  /** 登录地址, 只用于前期测试 */
  TEST_SIGN_API_URL: string,
  /** 用户行为统计上报地址 */
  COLLECT_URL?: string,
};

const configs: Record<string, {
  Urls: UrlsType,
  App: {
    /** 系统版本 */
    VERSION: string,
    /** 缓存版本,缓存版本变化时会清空浏览器所有缓存内容 */
    CACHE_VERSION: number,
    /** 前端应用id */
    FRONT_ID: string,
  }
}> = {
  local: LocalConfig,
  uat: UatConfig,
  prod: ProdConfig
};

const config = configs[env];
// const config = configs['prod'];

// /** 各种地址配置 */
export const Urls = config.Urls;

// /** 应用相关配置 */
export const App = config.App;

