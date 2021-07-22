import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.PULL_URL });

/**
 * 查询商户配置信息
 */
export const finddomaininfo = async () => {
  let domaininfo = await axios.post('portal/finddomaininfo');
  if (Array.isArray(domaininfo)) {
    domaininfo = domaininfo[0];
  }

  return domaininfo;
};

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
 * 查询公告列表
 */
export const findNotice = params => axios.post('portal/findnotice', params);

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

/**
 * 查询比赛赛果
 */
export const findMatchResult = matchDay => axios.post('match/findMacthScore', { matchDay });

/**
 * 查询指定状态比赛数统计
 */
export const findCountInfo = sportID => axios.post('match/findCountInfo', { sportID });

/**
 * 查询最近比赛信息
 */
export const findNearlyMatchList = params => axios.post('match/findNearlyMatchList', params);

/**
 * 查询闯关列表
 */
export const findBunchList = () => axios.get('portal/findBunchList');

/**
 * 查询比赛场次(新版: 最近24小时)
 */
export const findCountOther = params => axios.post('match/findCountOther', params);

/**
 * 查询比赛列表 (新版: 最近24小时)
 */
export const findmatchsListOther = params => axios.post('match/findmatchsListOther', params);

/**
 * 查询赛果
 * @param {object} params 查询条件
 */
export const findMacthScoreOther = params => axios.post('match/findMacthScoreOther', params);

/**
 * 获取热门联赛
 */
export const findhot = () => axios.get('portal/findhot');

export const findNoitce = () => axios.get('nb_sport_pull/portal/findnotice');
