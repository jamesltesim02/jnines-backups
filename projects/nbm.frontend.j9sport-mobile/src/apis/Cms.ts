import BaseApi from "./BaseApi";

import AppConfig from "../configs";

// 交易所列表模板code
const MARKET_TEMPLATE_CODE = '070121';
// const MARKET_TEMPLATE_CODE = '020130';

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
    //     "id": "2814e853a6a843c28202254e773d5e52",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"kyberbit\",\"processText\":\"可直接使用人民币充值到账\",\"usdtText\":\"官方推荐，极速到账\"}",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA930OAN9ZMAAJQFHT3bRQ149.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA930OAN9ZMAAJQFHT3bRQ149.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/26/wKhkwGA931SAEhEJAABUaVx2tQA889.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA931SAEhEJAABUaVx2tQA889.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 1,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "kyberbit-交易所",
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
    //     "id": "793b80431d1e4953ac445cb8582dd159",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"bitpie\",\"processText\":\"无24小时交易限制，但凌晨时段可能延迟到账\",\"usdtText\":\"建议充值≤500\"}",
    //     "maxImage": "/group2/M00/01/D7/wKhkwWA94AiAWeiCAAH2jC3USrQ219.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group2/M00/01/D7/wKhkwWA94AiAWeiCAAH2jC3USrQ219.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/26/wKhkwGA93_aABZ8eAAAq4eEAR8w199.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA93_aABZ8eAAAq4eEAR8w199.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 2,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "bitpie",
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
    //     "id": "6d92c2a625a64b7da37971140c70aa64",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"coinbase\",\"processText\":\"该交易所每笔购买的USDT都有24小时交易限制，可能影响您的充值进度\",\"usdtText\":\"建议充值≤10000\",\"type\":\"fast\"} ",
    //     "maxImage": "/group2/M00/01/D7/wKhkwWA93n6AWKeJAAH2jC3USrQ665.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group2/M00/01/D7/wKhkwWA93n6AWKeJAAH2jC3USrQ665.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/26/wKhkwGA93nmAEg13AAAg4yefLvM722.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA93nmAEg13AAAg4yefLvM722.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 2,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "coinbase-交易所图片",
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
    //     "id": "4fe7dd651b58441dbc862aad50f3e8ab",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"okex\",\"processText\":\"无24小时交易限制，购买USDT后可快速充值到九游会\",\"usdtText\":\"建议充值≤500\"}",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA937aAWPWfAAH2jC3USrQ484.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA937aAWPWfAAH2jC3USrQ484.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/26/wKhkwGA939WATKhrAAAUwW_W8P0097.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA939WATKhrAAAUwW_W8P0097.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 2,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "okex",
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
    //     "id": "adbe330ea66d4f20ae5a3347b3d9b7e4",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"bian\",\"processText\":\"该交易所每笔购买的USDT都有24小时交易限制，可能影响您的充值进度\",\"usdtText\":\"建议充值≤10000\",\"type\":\"fast\"} ",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA934iAMTXzAAH2jC3USrQ159.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA934iAMTXzAAH2jC3USrQ159.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group2/M00/01/D7/wKhkwWA935KAJ0bIAAAPddP04g0487.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group2/M00/01/D7/wKhkwWA935KAJ0bIAAAPddP04g0487.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 3,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "bian-交易所",
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
    //     "id": "3d7eeda7e4c84e92a272e5d9ea1c8f7e",
    //     "isWhite": 0,
    //     "jsonObj": "{\"key\":\"gate.io\",\"processText\":\"该交易所每笔购买的USDT都有24小时交易限制，可能影响您的充值进度\",\"usdtText\":\"建议充值≤10000\"}",
    //     "maxImage": "/group1/M00/03/26/wKhkwGA93b-AE6okAAH2jC3USrQ451.png",
    //     "maxImageAction": "",
    //     "maxImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA93b-AE6okAAH2jC3USrQ451.png",
    //     "maxImageHttpUrlWebp": "",
    //     "minImage": "/group1/M00/03/26/wKhkwGA93d2AWYfZAAA4bPeOMqg332.png",
    //     "minImageAction": "",
    //     "minImageHttpUrl": "https://staticff.nmgsya.com/group1/M00/03/26/wKhkwGA93d2AWYfZAAA4bPeOMqg332.png",
    //     "minImageHttpUrlWebp": "",
    //     "moduleCode": "070121",
    //     "ossType": null,
    //     "pageModuleId": "afb32c778df94f3ca9e22606e7045729",
    //     "productId": "HC6",
    //     "rank": 4,
    //     "status": 1,
    //     "targetType": "target",
    //     "templateButtons": [],
    //     "templateType": null,
    //     "textDescription": "",
    //     "tip": "gate.io交易所",
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
      {
        params: {
          moduleCodes,
          terminalType: 'HC6_APP',
          whiteType: 1
        }
      }
    );
  }
}
