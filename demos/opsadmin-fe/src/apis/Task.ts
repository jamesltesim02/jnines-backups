import BaseApi from './BaseApi'

import { Urls } from '../configs/config'

export default class Task extends BaseApi {
  constructor () {
    super({ baseURL: Urls.API });
  }

  /** 查询任务列表 */
  async list (
    params: {
      name?: string,
      executeType?: number,
      currentTaskStatus?: number,
      pageIndex?: number,
      pageSize?: number,
    }
  ) {
    const result = await this._post('task/list', params);
    return result || [];
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

  /** 查询详情 */
  edit (id: any) {
    return this._post('task/edit', { id });
  }

  /** 上传文件 */
  async upload (file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const result = await this._post(
      'file/upload',
      formData,
      {
        timeout: 0,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    return result?.url;
  }

  /** 查询执行结果 */
  resultDataList (
    params: {
      id: any,
      pageIndex?: number,
      pageSize?: number,
    }
  ) {
    return this._post(
      'task/resultDataList',
      params
    );
  }

  /** 加载日志文件 */
  loadLogContent (file: string) {
    const {
      protocol,
      host
    } = window.location;
    return this._get(
      file,
      {
        baseURL: `${protocol}//${host}`,
        transformResponse (data: any) {
          return {
            code: 0,
            msg: '',
            data
          };
        }
      }
    );
  }

  /** 获取当前服务器时间 */
  getCurrentTimestamp () {
    return this._get('task/getCurrentTimestamp');
  }
}