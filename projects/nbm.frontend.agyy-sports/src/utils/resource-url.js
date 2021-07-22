import { resourceDir } from '../config/config.dev'

/**
 * 指定媒体类型地址
 * @param {string} type 
 * @param {string} path 
 */
export const getResourceUrl = (type, path) => `${window.__AGYY_SPORTS_CONFIG__.RESOURCE_URL}${type}/${path}`

/**
 * 比赛相关大图
 * @param {string} path 
 */
export const getMatchUrl = path => getResourceUrl(resourceDir.match, path)

/**
 * 联赛相关图片
 * @param {string} path 
 */
export const getTourUrl = path => getResourceUrl(resourceDir.tour, path)

/**
 * 球队logo
 * @param {string} path 
 */
export const getTeamLogoUrl = path => getResourceUrl(resourceDir.competitor, path)

/**
 * banner大图
 * @param {string} path 
 */
export const getSlideUrl = path => getResourceUrl(resourceDir.slide, path)

/**
 * 视频地址
 * @param {string} path 
 */
export const getMovieUrl = path => getResourceUrl(resourceDir.movie, path)
