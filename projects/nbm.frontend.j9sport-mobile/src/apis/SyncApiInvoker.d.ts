/** api请求基类, 封装网络请求公共业务 */
declare class SyncApiInvoker {

  public static create (conf: any): SyncApiInvoker;

  /**
   * 发起get请求
   * @param url 请求地址
   * @param conf 请求配置
   */
  public get (
    url: string,
    data?: object,
    conf?: object
  ): any;

  /**
   * 发起post请求
   * @param url 请求地址
   * @param data 请求参数
   * @param conf 请求配置
   */
  public post (url: string, data?: object, conf?: object): any;

  public put (url: string, data?: object, conf?: object): any;
  public delete (url: string, conf?: object): any;
  public head (url: string, conf?: object): any;
  public patch (url: string, data?: object, conf?: object): any;
}
export default SyncApiInvoker;
