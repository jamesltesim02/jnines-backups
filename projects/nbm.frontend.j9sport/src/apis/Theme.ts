import BaseApi from './BaseApi';
import AppConfig from '../configs';
import { Md5 } from 'ts-md5'

const MD5_KEY = 'bHORWu7GnirlCXlZ'

export default class Theme extends BaseApi {
  constructor() {
    super({
      baseURL: AppConfig.THEME_URL,
    });
  }

  /**
   * 获取比赛列表，比赛叫game和j9的match几乎一样，不含玩法赔率
   * @param params
   */
  getGameList(
    eventId: string
  ) {
    return this._get(
      '/theme/GetGameList/' + eventId,
      {
        params: {
          sign: Md5.hashStr(eventId + MD5_KEY)
        }
      }
    )
  }

  /**
   * 获取单场比赛含玩法赔率
   * @param eventId
   */
  getGameDetail(
    gameId: string
  ) {
    return this._get(
      '/theme/GetGameDetail/' + gameId,
      {
        params: {
          sign: Md5.hashStr(gameId + MD5_KEY)
        }
      }
    )
  }

  /**
   * 获取早期投注（叫antepost）（也可以叫优胜冠军）列表，含玩法赔率
   * @param eventId
   */
  getAntepostList(
    eventId: string
  ) {
    return this._get(
      '/theme/GetAntepostList/' + eventId,
      {
        params: {
          sign: Md5.hashStr(eventId + MD5_KEY)
        }
      }
    )
  }


  /**
   * 获取积分榜（rank）列表
   * @param eventId
   */
  getRankList(
    eventId: string
  ) {
    return this._get(
      '/theme/GetRankList/' + eventId,
      {
        params: {
          sign: Md5.hashStr(eventId + MD5_KEY)
        }
      }
    )
  }

  /**
   * 获取用户注单
   * @param params
   */
  getBetList(
    params: {
      userId: string,
      StartTime: string
      EndTime: string
      BetStatus: number
      PageSize: number
      Page: number
    }
  ) {
    return this._get(
      '/Theme/GetBetList',
      {
        params: {
          ...params,
          sign: Md5.hashStr(params.userId + MD5_KEY)
        }
      }
    )
  }

  quote(
    params: {
      frontId: string
      token: string
      userId: string
      betType: number
      userName: string
      currency: number
      betItems: Array<{
        gameId: number
        optionId: number
      }>
    }
  ) {
    const sign = Md5.hashStr(
      params.frontId +
      params.token +
      params.userId +
      params.betType +
      MD5_KEY
    )

    return this._post(
      '/Theme/Quote?sign=' + sign,
      {
        ...params
      }
    )
  }

  /**
   * 投注，返回代码跟ted给你的bet接口返回代码完全一样
   * @param params
   */
  bet(
    params: {
      frontId: string
      token: string
      userId: string
      betType: number
      userName: string
      currency: number
      betItems: Array<{
        gameId: number
        optionId: number
        odds: number
        betAmount: number
      }>
    }
  ) {

    const sign = Md5.hashStr(
      params.frontId +
      params.token +
      params.userId +
      params.betType +
      MD5_KEY
    )

    const CODE_MAP: any = {
      200: "投注成功",
      400: "参数错误",
      401: "Sign错误",
      403: "用户未验证或不存在",
      404: "",
      405: "",
      415: "比赛已关盘,投注失败",
      416: "玩法已关盘,投注失败",
      419: "超出限额,投注失败",
      417: "盘口改变,投注失败",
      418: "赔率变化,投注失败",
      500: "系统抛出异常",
      521: "余额不足",
    }

    return this._post(
      '/Theme/Bet?sign=' + sign,
      {
        ...params
      },
      {
        transformResponse(data: any) {
          const reqData = JSON.parse(data)
          return {
            ...reqData,
            msg: CODE_MAP[reqData.code]
          }
        }
      }
    )
  }

  /**
   * 获取淘汰赛对阵
   */
  betKnockout() {
    return this._get(
      '/theme/GetKnockout',
      {
        params: {
          sign: Md5.hashStr("GetKnockout" + MD5_KEY)
        }
      }
    )
  }

  /**
   * 获取投注统计
   * @param UserID
   */
  getBetSummary(
    {UserID}: { UserID: string }
  ) {
    return this._get(
      '/theme/GetBetSummary',
      {
        params: {
          sign: Md5.hashStr(UserID + MD5_KEY),
        }
      }
    )
  }

  /** 获取2021欧洲杯大闯关活动小组赛数据 */
  getEurocup21PrizepoolMatchs() {
    return this._get(
      'Theme/GetEuro2021Group',
      { params: { Sign: Md5.hashStr('GetEuro2021Group' + MD5_KEY) } }
    );
  }

  /** 获取2021欧洲杯大闯关活动淘汰赛数据 */
  getEurocup21PrizepoolElimination() {
    return this._get(
      'Theme/GetEuro2021Elimination',
      { params: { Sign: Md5.hashStr('GetEuro2021Elimination' + MD5_KEY) } }
    );
  }

  /** 获取2021欧洲杯大闯关活动大奖池数据 */
  getEurocup21PrizepoolBonus() {
    return this._get(
      'Theme/GetEuro2021Bonus',
      { params: { Sign: Md5.hashStr('GetEuro2021Bonus' + MD5_KEY) } }
    );
  }

  /**
   * 投注累计额度活动数据
   * @param userId
   */
  getEurope21BonusReward(
    {
      userId
    }: {
      userId: string
    }
  ) {
    return this._get(
      '/theme/GetUserBonus',
      {
        params: { sign: Md5.hashStr(userId + MD5_KEY) }
      }
    )
  }

}