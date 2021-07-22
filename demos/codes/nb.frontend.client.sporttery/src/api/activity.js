import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.ACTIVITY_URL });

/**
 * 根据userId查询个人信息
 *
 * @param {string} userId
 *    被查询的userId
 */
export const getMemberInfo = userId => axios.get('member/getMemberInfo', { params: { userId } });

/**
 * 修改头像
 *
 * @param {object} params
 *    修改的参数信息:
 *      {
 *        userId: 用户id,
 *        header: 新头像信息,
 *      }
 */
export const modifyHeader = params => axios.post('member/modifyHeader', params);

/**
 * 修改昵称
 *
 * @param {object} params
 *    修改的参数信息:
 *      {
 *        userId: 用户id,
 *        nickName: 昵称,
 *      }
 */
export const modifyNickname = params => axios.post('member/modifyNickname', params);

/**
 * 修改描述
 *
 * @param {object} params
 *    修改的参数信息:
 *      {
 *        userId: 用户id,
 *        nickName: 描述,
 *      }
 */
export const modifyRemark = params => axios.post('member/modifyRemark', params);

/**
 * 根据id查询用户专家页信息
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 被查询id,
 *        myUserId: 当前登录用户id
 *      }
 */
export const getMemberByUser = params => axios.get('member/getMemberByUser', { params });

/**
 * 查询短方案排行榜
 */
export const findShortRank = params => axios.post('rank/getShortRank', params);

/**
 * 查询长方案排行榜
 */
export const findLongRank = (url, params) => axios.post(`rank/${url}`, params);

/**
 * 查询方案列表
 */
export const findPublishList = (url, params) => axios.get(`plan/${url}`, { params });

/**
 * 查询方案详情
 */
export const findPublishDetail = params => axios.get('plan/getPlanDetails', { params });

/**
 * 查询跟单列表
 */
export const findFollowList = params => axios.get('plan/getFollowsByPlan', { params });

/**
 * 查询晒单列表
 */
export const findShineList = (url, params) => axios.get(`share/${url}`, { params });

/**
 * 查询粉丝关注列表
 */
export const getFocusFans = (url, params) => axios.get(`fans/${url}`, { params });

/**
 * 查询跟单优惠券列表
 */
export const findCouponList = params => axios.get('coupon/getCouponByPlan', { params });

/**
 * 查询我的卡券列表
 */
export const findMyCouponList = params => axios.post('coupon/getCouponByUser', params);

/**
 * 晒单
 */
export const shinePlan = params => axios.post('plan/showPlan', params);

/**
 * 获取分享图片
 */
export const findSharePicture = params => axios.get('wechatShare/getShareURL', { params });

/**
 * 查询每日奖励
 */
export const findDayTaskInfo = params => axios.get('activity/getDayActivitys', { params });

/**
 * 领取奖励
 */
export const getTaskReward = params => axios.get('coupon/getCouponByShare', { params });

/**
 * 新用户注册
 */
export const memberRegister = params => axios.post('member/register', params);

/**
 * 获取注册验证码
 */
export const findRegisterCode = params => axios.get('member/getCaptcha', { params });

/**
 * 添加关注
 *
 * @param {object} params
 *    添加参数
 *      {
 *        memberUserId: 被关注人id,
 *        myUserId: 当前用户id,
 *      }
 */
export const fansFocus = params => axios.post('fans/focus', params);

/**
 * 取消关注
 *
 * @param {object} params
 *    取消参数
 *      {
 *        memberUserId: 被取消关注人id,
 *        myUserId: 当前用户id,
 *      }
 */
export const cancelFocus = params => axios.post('fans/cancelFocus', params);

/**
 * 查询关注的用户的提案列表
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 用户id,
 *        pageIndex: 当前页码,
 *      }
 */
export const getFocusPlans = params => axios.get('plan/getFocusPlans', { params });

/**
 * 查询站内信列表
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 用户id,
 *        pageSize: 每页条数,
 *        pageIndex: 当前页码,
 *      }
 */
export const getMailsByUser = params => axios.post('mail/getMailsByUser', params);

/**
 * 全部删除
 *
 * @param {object} params
 *    删除条件
 *      {
 *        userId: 用户id,
 *      }
 */
export const deleteAll = params => axios.post('mail/deleteAll', params);

/**
 * 全部已读
 *
 * @param {object} params
 *    设置参数
 *      {
 *        userId: 用户id,
 *      }
 */
export const setAllReaded = params => axios.post('mail/setAllReaded', params);

/**
 * 查询单条站内信
 *
 * @param {object} params
 *    查询条件
 *      {
 *        id: 站内信id,
 *        userId: 用户id,
 *      }
 */
export const getMailInfoById = params => axios.post('mail/getMailInfoById', params);

/**
 * 设置单条站内信已读
 *
 * @param {object} params
 *    设置参数
 *      {
 *        id: 站内信id,
 *        userId: 用户id,
 *      }
 */
export const modifyMailReaded = params => axios.post('mail/modifyMailReaded', params);

/**
 * 查询我的历史方案
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 用户id,
 *        pageIndex: 当前页码,
 *      }
 */
export const getHistoryPlansByUser = params => axios.get('plan/getHistoryPlansByUser', { params });

/**
 * 查询方案
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 用户id,
 *        pageIndex: 当前页码,
 *      }
 */
export const getNewestPlans = params => axios.get('plan/getNewestPlans', { params });

/**
 * 查询佣金记录列表
 *
 * @param {object} params
 *    查询条件
 *      {
 *        userId: 用户id,
 *        pageIndex: 当前页码,
 *      }
 */
export const getCommissionByUser = params => axios.get('plan/getCommissionByUser', { params });

/**
 * 查询指定比赛中的可用方案列表
 *
 * @param {object} params
 *    查询条件
 *      {
 *        matchId: 比赛id,
 *        pageIndex: 当前页码,
 *      }
 */
export const getPlansByMatchId = params => axios.get('plan/getPlansByMatchId', { params });

/**
 * 查询指定比赛可用方案数量
 * @param {object} params
 *    查询条件
 *      {
 *        matchId: 比赛id,
 *      }
 */
export const getPlanCountByMatchId = params => axios.get('plan/getPlanCountByMatchId', { params });
