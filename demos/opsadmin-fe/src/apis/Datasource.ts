import BaseApi from './BaseApi'

import { Urls } from '../configs/config'

export default class Datasource extends BaseApi {
  constructor () {
    super({ baseURL: Urls.API });
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
  
  /** 检查数据源是否可以被链接 */
  checkConnect (params: {
    ipAddress: string,
    datasourceType: number,
    schemaName: string,
    port: number,
    userName: string,
    password: string,
  }) {
    return this._post('datasource/checkConnect', params);
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

  /** 是否有关联的任务 */
  enableRelateTask (datasourceId: any) {
    return this._post('datasource/enableRelateTask', { datasourceId })
  }

  /** 查询待选择列的列表 */
  columnList () {
    return this._post('tblcol/list');
  }

}
