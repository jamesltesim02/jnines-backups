import { IntlShape } from 'react-intl';
import AppConfig from '../configs';

import memberStore from '../stores/member';
import appStore from '../stores/app';

import { toOptionName } from '../components/match/OptionName';

/**
 * 数据类型
 * * SURFING  - surfing  - 路由更新 (普通浏览网页动作)
 * * ORDER    - order    - 投注
 * * EVENTLOG - eventlog - 页面报错
 */
export enum CollectType {
  /** SURFING  - surfing  - 路由更新 (普通浏览网页动作) */
  SURFING  = 'surfing',
  /** ORDER    - order    - 投注 */
  ORDER    = 'order',
  /** EVENTLOG - eventlog - 页面报错 */
  EVENTLOG = 'eventlog',
}

let CollectImage : HTMLImageElement | undefined = undefined;

/**
 * 上报用户行为数据
 */
export function collect (
  params: {
    /**
     * 数据类型
     * * surfing  -   路由更新 (普通浏览网页动作)
     * * order    -   投注
     * * eventlog  -   页面报错
     */
    type: CollectType,
    /** 网页加载耗时 */
    loadTime?: number,
    /** 网页渲染耗时 */
    renderTime?: number,
    /** 投注的注单号 */
    orderNo?: string,
    /**
     * 注单信息
     * JSON字符串, 包含以下内容:
     * {
     *   // 注项列表
     *   options: [
     *     {
     *       // 联赛名
     *       tournamentName: string
     *       // 比赛名
     *       matchName string
     *       // 玩法名
     *       marketName: string
     *       // 投注项名
     *       optionName: string
     *       // 滚球比分, 非滚球则为空
     *       liveScore: string | undefined
     *       // 赔率
     *       odds: number
     *     }
     *   ],
     *   // 投注额
     *   amount: number
     * }
     */
    orderInfo?: string,
    /**
     * 注单结果
     * ``` javascript
     * {
     *   // 是否成功
     *   success: boolean,
     *   // 描述
     *   msg: string
     * }
     * ```
     */
    orderResult?: string,
    /** 错误信息 */
    error?: string
  }
) {
  // 如果没有配置上报的路径,则不执行上报
  if (!AppConfig.COLLECT_URL) {
    return;
  }

  // 创建上报用的图片
  if (!CollectImage) {
    CollectImage = document.createElement('img');
    CollectImage.style.position = 'absolute';
    CollectImage.style.top = '0px';
    CollectImage.style.right = '0px';
    CollectImage.style.zIndex = '0';
    CollectImage.style.width = '1px';
    CollectImage.style.height = '1px';
    CollectImage.style.opacity = '0';
    document.body.appendChild(CollectImage);
  }

  // 需要上报的数据
  const urlParams: any = {
    ...params,
    // 当前完整路径
    fullpath: encodeURIComponent(window.location.href),
    // 用户信息
    nbToken: memberStore.nbToken,
    agToken: memberStore.agToken,
    nbUid: memberStore.userId,
    j9Uid: memberStore.username,
    // 系统环境信息
    frontId: AppConfig.FRONT_ID,
    clientType: appStore.clientType,
    language: appStore.locale,
  };

  // 设置到图片对象发起请求
  CollectImage.src = `${AppConfig.COLLECT_URL}?params=${JSON.stringify(urlParams)}`;
}

/**
 * 
 * @param intl 多语言处理对象
 * @param orderNo 注单号
 * @param options 投注项列表
 * @param amount 投注金额
 */
export function collectOrder (
  intl: IntlShape,
  orderNo: string,
  options: any[],
  amount: number
) {
  collect({
    type: CollectType.ORDER,
    orderNo,
    orderInfo: JSON.stringify({
      options: options.map(({ match, market, option }) => {
        const marketName = intl.formatMessage({
          id: `market.${match.sportId}.${market.marketGroup}_${market.marketStage}_${market.marketType}`
        });
        const on = toOptionName(
          market.marketType,
          market.marketGroup,
          market.betBar,
          option.betOption
        );
        const optionName = `${
          on.prefix || ''
        }${
          on.key ? intl.formatMessage(
            { id: `option.${on.key}` },
            {
              ...on.params,
              betOption: option.betOption,
              betBar: market.betBar
            }
          ) : ''
        }${
          on.value || ''
        }`;

        return {
          tournamentName: match.tournamentName,
          matchName: match.matchName,
          marketName,
          optionName,
          liveScore: match.liveScore?.score,
          odds: option.odds
        };
      }),
      amount
    })
  });
}

export default collect;