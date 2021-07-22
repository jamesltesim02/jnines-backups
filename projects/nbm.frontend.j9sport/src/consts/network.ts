/** 普通接口配置项 */
export const ApiConst = {
  /** 接口请求超时时间: 5秒钟 */
  TIMEOUT: 60000,
  /** 跨域请求是否提供凭据信息(cookie、HTTP认证及客户端SSL证明等) */
  WITH_CREDENTIALS: true,
  /** 数据缓存更新时间 */
  CACHE_REFRESH_DELAY: 30000,
};

/**
 * ### 推送配置项  
 * * RETRY_DELAY - 推送重连时间, 默认( 35秒)
 * * RETRY_TIMES - 最多重连次数, 默认(5次)
 * * RETRY_ON_FOCUS - 窗口获得焦点后是否重连, 默认(false)
 * * DKM_DELAY - 心跳时间: 30秒 (Don't Kill Me, 大哥别杀我), 默认(30秒)
 */
export const PushConst = {
  /** 推送重连时间: 35秒 */
  RETRY_DELAY: 15000,
  /** 最多重连次数 */
  // RETRY_TIMES: 5,
  RETRY_TIMES: Infinity,
  /** 窗口获得焦点后是否重连 */
  RETRY_ON_FOCUS: false,
  /** 心跳时间: 30秒 (Don't Kill Me, 大哥别杀我) */
  DKM_DELAY: 10000
};

/** CDN下静态资源目录 */
export enum ResourceDir {
  /** 比赛配图 */
  MATCH = 'match',
  /** 联赛logo */
  TOURNAMENT = 'tournament',
  /** 球队logo */
  COMPETITOR = 'competitor',
  /** banner大图 */
  SLIDE = 'slide',
  /** 宣传视频 */
  MOVIE = 'movies',
  /** 手工添加的重要赛事 */
  CATEGORY = 'category'
}

/**
 * ### 直播路径
 * * VIDEO 视频直播
 * * LMT 动画直播
 */
export enum MediaPath {
  /** 视频直播 */
  VIDEO = 'video',
  /** 动画直播 */
  LMT = 'lmt'
}
