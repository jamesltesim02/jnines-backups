import BaseApi from "./BaseApi";
import AppConfig from '../configs';

// 交易所列表模板code
// const MARKET_TEMPLATE_CODE = '070121';
const MARKET_TEMPLATE_CODE = '020130';

export type UsdtMarket = {
    /** id */
    id: string,
    /** 开始时间 */
    beginTime: string,
    /** 结束时间 */
    endTime: string,
    /** 自定义内容 */
    jsonObj: string,
    /** 大图 */
    maxImageHttpUrl: string,
    /** 小图 */
    minImageHttpUrl: string,
    /** 提示内容 */
    tip: string,
    /** 顺序(推荐) 1: 推荐, 2: 普通 */
    rank: number,
    /** 交易所地址 */
    marketUrl?: string, 
    /** 将jsonObj格式化后的内容 */
    parsedObj?: {
      /** 交易所key */
      key: string,
      /** 描述信息 */
      processText: string,
      /** 精简介绍 */
      usdtText: string,
    }
};

/** CMS相关接口 */
export default class Payment extends BaseApi {
  constructor () {
    super({ baseURL: AppConfig.AG_USER_URL });
  }

  /** 获取交易所列表 */
  getUsdtMarkets () : Promise<Array<UsdtMarket>> {

    return this.getTemplates(MARKET_TEMPLATE_CODE);

    // return Promise.resolve([
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "d37b50c6d76e4e0f8ba81a5287666766",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"kyberbit\",\"processText\":\"（可直接使用人民币充值到账）\",\"usdtText\":\"≤500\",\"type\":\"fast\",\"usdtText\":\"官方推荐，极速到账\"}",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA93QCAWI5aAAI9W6C-7-E616.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/26/wKhkwGA93QCAWI5aAAI9W6C-7-E616.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/01/D8/rBQVwWA93QuANzZ3AACHdP14YHU582.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group2/M00/01/D8/rBQVwWA93QuANzZ3AACHdP14YHU582.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 1,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "fast-kyberbit-交易所",
    //     "userLevelStr": ""
    //   },
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "86cccb45721646b98bef91bf631d2b60",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"gate.io\",\"processText\":\"（该交易所第一次购买USDT，有24小时限制不可转币，这会影响您的充值速度）\",\"usdtText\":\"建议充值范围≤10000\",\"type\":\"big\"} ",
    //     "maxImage": "/group1/M00/03/25/wKhkwGA93LWAaJ_XAAG7iBMxgWk191.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/25/wKhkwGA93LWAaJ_XAAG7iBMxgWk191.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/00/A8/rBQVwGA93MOALZvdAABevrffjEk936.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group2/M00/00/A8/rBQVwGA93MOALZvdAABevrffjEk936.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 1,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "big-gate.io-交易所",
    //     "userLevelStr": ""
    //   },
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "71f71fb7cdb0445fa12a9c963ecbc753",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"coinbase\",\"processText\":\"（该交易所第一次购买USDT，有24小时限制不可转币，这会影响您的充值速度）\",\"usdtText\":\"建议充值范围≤10000\",\"type\":\"big\"} ",
    //     "maxImage": "/group1/M00/03/25/wKhkwGA93H-AIDizAAG7iBMxgWk200.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/25/wKhkwGA93H-AIDizAAG7iBMxgWk200.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/01/D7/wKhkwWA93IWAH64rAAAx9DNK6cQ169.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group2/M00/01/D7/wKhkwWA93IWAH64rAAAx9DNK6cQ169.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 1,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "big-coinbase-交易所",
    //     "userLevelStr": ""
    //   },
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "ed2cdfc21f7c418cbabed86850b6d889",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"okex\",\"processText\":\"（无24小时交易限制，购买后可快速充值到九游会）\",\"usdtText\":\"建议充值范围≤500\",\"type\":\"fast\"}",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA93T6ADBCAAAG7iBMxgWk648.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/26/wKhkwGA93T6ADBCAAAG7iBMxgWk648.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/01/D7/wKhkwWA93UaADve5AAAp9HK4Xn8119.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group2/M00/01/D7/wKhkwWA93UaADve5AAAp9HK4Xn8119.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 2,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "fast-okex-交易所",
    //     "userLevelStr": ""
    //   },
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "2f40b57a0b814c72808dc824800bd6e3",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"bian\",\"processText\":\"（该交易所第一次购买USDT，有24小时限制不可转币，这会影响您的充值速度）\",\"usdtText\":\"建议充值范围≤10000\",\"type\":\"big\"} ",
    //     "maxImage": "/group1/M00/03/25/wKhkwGA929eAZACOAAG7iBMxgWk640.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/25/wKhkwGA929eAZACOAAG7iBMxgWk640.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/01/D7/wKhkwWA92-mAJIXhAAAgg41u2qY527.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group2/M00/01/D7/wKhkwWA92-mAJIXhAAAgg41u2qY527.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 2,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "big-bian-交易所",
    //     "userLevelStr": ""
    //   },
    //   {
    //     "beginTime": "2021-03-02 00:00:00",
    //     "closeWindowType": 1,
    //     "defaultAction": "",
    //     "endTime": "",
    //     "hotIcon": "",
    //     "hotIconHttpUrl": "",
    //     "hotIconHttpUrlWebp": "",
    //     "id": "3d1874fdb0924b0bae91be2552783410",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"bitpie\",\"processText\":\"（无24小时交易限制，但凌晨时段可能延迟到账）\",\"usdtText\":\"≤500\",\"type\":\"fast\",\"usdtText\":\"建议充值范围≤500\"}",
    //     "maxImage": "/group1/M00/03/25/wKhkwGA93CGAaksgAAG7iBMxgWk074.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/25/wKhkwGA93CGAaksgAAG7iBMxgWk074.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/25/wKhkwGA93C-AEcB0AABJIzpy1Zs174.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.jintushi.net/group1/M00/03/25/wKhkwGA93C-AEcB0AABJIzpy1Zs174.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "020130",
    //     "ossType": null,
    //     "pageModuleId": "a7e2cc6e482746d5ab77a83d96fee677",
    //     "productId": "HC6",
    //     "rank": 3,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "fast-bitpie-交易所",
    //     "userLevelStr": ""
    //   }
    // ] as any)
  }

  /**
   * 查询CMS模板数据
   * 
   * @param {string} moduleCode 模板code
   */
  getTemplates (moduleCodes: string) {

    return this._get(
      'cms/templates',
      { params: { moduleCodes } }
    );
  }
}
