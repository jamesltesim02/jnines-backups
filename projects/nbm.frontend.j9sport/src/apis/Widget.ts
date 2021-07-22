import BaseApi from './BaseApi'
import AppConfig from '../configs'

import widgetStore from '../stores/widgets';

export default class User extends BaseApi {
  constructor() {
    super({
      baseURL: AppConfig.AG_USER_URL,
      transformResponse(data: any) {
        const result = data ? JSON.parse(data) : {}
        // 如果处理结果为200, 则表示处理成功,返回内容
        if (result.code === 200) {
          // 判断是否地域限制或者维护
          // 是否包含地域限制属性,如果维护或者地域限制均会包含此属性
          if (
            result.data?.game === 'j9'
            &&
            result.data?.hasOwnProperty('forbbiden')
          ) {
            widgetStore.systemState = result.data;
          }
          return result.data;
        }

        return {
          code: 200,
          data: result
        };
      }
    });
  }

  /**
   * 查询体育厅余额 
   */
  // userBalance() {
  //   return this._get(
  //     'user/balance',
  //     {
  //       params: {
  //         target: 'SABA_API'
  //       }
  //     }
  //   );
  // }
}