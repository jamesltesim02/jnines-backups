import BaseApi from './BaseApi'

import { Urls } from '../configs/config.local'

export default class Task extends BaseApi {
  constructor () {
    super({ baseURL: Urls.PULL });
  }

  /** 查询任务列表 */
  list (
    params: {
      name?: string,
      executeType?: number,
      currentTaskStatus?: number,
      pageIndex?: number,
      pageSize?: number,
    }
  ) {
    return this._post('task/list', params);
  }

  /** 删除任务 */
  delete (id: any) {
    return this._post('task/delete', { id });
  }

  /** 添加任务 */
  add (params: any) {
    return this._post('task/add', params)
  }

  /** 修改任务 */
  update (params: any) {
    return this._post('task/update', params)
  }

  /** 执行任务 */
  execute (taskId: any) {
    return this._post('task/execute', { taskId });
  }

  /** 查询任务详情 */
  info (id: any) {
    return this._post('task/info', { id });
  }

  /** 上传文件 */
  upload (file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this._post(
      'file/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

}