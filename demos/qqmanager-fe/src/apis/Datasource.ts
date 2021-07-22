import BaseApi from './BaseApi'

import { Urls } from '../configs/config.local'

export default class Datasource extends BaseApi {
  constructor () {
    super({ baseURL: Urls.PULL });
  }

  /** 查询数据源列表 */
  list (
    params: {
      ipAddress?: string,
      datasourceType?: number,
      schemaName?: string,
      pageIndex?: number,
      pageSize?: number,
    }
  ) {
    return this._post('datasource/list', params);
  }

  /** 添加数据源 */
  add (
    params: {
      datasourceName: string,
      ipAddress: string,
      datasourceType: number,
      schemaName: string,
      port: number,
      userName: string,
      password: string,
    }
  ) {
    return this._post('datasource/add', params);
  }

  /** 删除数据源 */
  delete (id: any) {
    return this._post('datasource/delete', { id });
  }

  /** 修改数据源 */
  update (params: any) {
    return this._post('datasource/update', params);
  }

  /** 查询数据源下的表 */
  tableList (datasourceId: any) {
    return this._post('datasource/tableList', { datasourceId });
  }

  /** 添加数据库表 */
  addTable (params: any) {
    return this._post('datasource/addTable', params);
  }

  /** 删除表 */
  deleteTable (params: { datasourceId: any, tableName: any }) {
    return this._post('datasource/deleteTable', params);
  }

  /** 查询表结构 */
  tableStructureInfo (params: { datasourceId: any, tableName: any }) {
    return this._post('datasource/tableStructureInfo', params);
  }
}
