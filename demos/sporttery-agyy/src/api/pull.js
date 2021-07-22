import createAxios from './createAxios';

const axios = createAxios({
  baseURL: window.NBConfig.PULL_URL,
});

/**
 * 查询商户配置信息
 */
export const finddomaininfo = () => axios.post('portal/finddomaininfo');

/**
 * 查询banner列表
 */
export const findSlide = () => axios.post('portal/findslide');

/**
 * 查询新闻列表
 *
 * @param {object} params
 *    查询条件
 *    {
 *      pageNum: 当前第几页
 *      pageSize: 每页条数
 *    }
 *
 * @returns {Array}
 *    新闻记录
 */
export const findnews = params => axios.post('portal/findnews', params);

/**
 * 查询新闻详情
 *
 * @param {string} newID
 *    新闻id
 *
 * @returns {object}
 *    新闻详情内容
 */
export const findnewsbyid = newsID => axios.post('portal/findnewsbyid', { newsID });

/**
 * 查询首页热门联赛
 */
export const findportaltou = () => axios.post('portal/findportaltou');

/**
 * 查询联赛列表
 *
 * @param {object} params
 *    查询条件
 *    {
 *      sportID: 体育类别id
 *      match-state: 比赛状态 null: 所有, 1: 滚球, 0: 早盘
 *    }
 */
export const findtournament = params => axios.post('match/findtournament', params);

/**
 * 插入按日期统计比赛数目
 *
 * @param {object} params
 *    查询条件
 */
export const findmatchscount = params => axios.post('match/findmatchscount', params);

/**
 * 查询比赛列表
 *
 * @param {object} params
 *    查询条件
 *    {
 *      matchState: 比赛状态：0早盘，1滚球，首页不传
 *      sportID: 球类：10足球，11篮球，首页不传
 *      tournamentID: 联赛ID,首页不传
 *      isFocus: 1是焦点比赛-焦点比赛会自动上首页推荐和快捷投注，首页传，其他位置不传
 *      pageNum: 分页参数，页数
 *      pageSize: 分页参数，每页显示条数
 *    }
 */
export const findmatchsList = params => axios.post('match/findmatchsList', params);

/**
 * 查询比赛详情
 *
 * @param {string} matchID
 *    比赛id
 */
export const findmatch = params => axios.post('match/findmatch', params);

/**
 * 查询联赛名称
 * @param {number} tournamentID
 *    联赛id
 */
export const findbyid = tournamentID => axios.post('portal/findbyid', { tournamentID });
