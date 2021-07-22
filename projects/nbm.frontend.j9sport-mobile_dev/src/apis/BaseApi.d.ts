import { AxiosStatic } from "axios";

/** api请求基类, 封装网络请求公共业务 */
declare abstract class BaseApi {
  constructor (conf: { baseURL: string });

  /** 初始化事件 */
  protected onCreate (axios:BaseApi): void;
  /** 销毁事件 */
  protected onDestory (): void;

  /**
   * 发起get请求
   * @param url 请求地址
   * @param conf 请求配置
   */
  protected _get (url: string, conf?: { params?: object }): Promise<any>;
  /**
   * 发起post请求
   * @param url 请求地址
   * @param data 请求参数
   * @param conf 请求配置
   */
  protected _post (url: string, data?: object, conf?: object): Promise<any>;

  protected _put (url: string, data?: object, conf?: object): Promise<any>;
  protected _delete (url: string, conf?: object): Promise<any>;
  protected _head (url: string, conf?: object): Promise<any>;
  protected _patch (url: string, data?: object, conf?: object): Promise<any>;

  /** 销毁对象 */
  destory (): void;
}

export default BaseApi;
