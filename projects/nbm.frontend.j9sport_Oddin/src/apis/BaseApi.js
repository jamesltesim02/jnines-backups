import Axios from 'axios';

import { App } from '../configs';
import { ApiConst } from '../consts/network';

import appStore from '../stores/app'
import memberStore from '../stores/member'

if (process.env.NODE_ENV !== 'production') {
  const mock = require('./mock');
  mock.default();
}

// 统一设置axios公共配置属性
Axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
Axios.defaults.timeout = ApiConst.TIMEOUT;
Axios.defaults.withCredentials = ApiConst.WITH_CREDENTIALS;

function toast (message) {
  window.dispatchEvent(
    new CustomEvent('toast', { detail: message })
  );
}

/** api请求基类, 封装网络请求公共业务 */
class BaseApi {

  /** axios对象,用于请求网络 */
  axios;
  /** 取消接口的凭证 */
  cancelSource = Axios.CancelToken.source();

  constructor(conf) {
    // 创建axios对象
    this.axios = Axios.create(conf);

    // 请求拦截处理
    this.axios.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );
    // 响应拦截处理
    this.axios.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );

    // 触发初始化事件
    this.onCreate(this.axios);
  }

  /** 初始化事件 */
  onCreate () {}
  /** 销毁事件 */
  onDestory () {}

  /**
   * TODO 请求公共参数设置  
   *
   * @param {object} conf 当前已有配置
   */
  handleRequest ({
    cancelable = true,
    ...conf
  }) {
    // 请求语言
    conf.headers['Accept-Language'] = appStore.locale;

    // 如果是get请求,参数在params中,其余在data中
    const paramKey = conf.method === 'get' ? 'params' : 'data';
    // 构造新请求参数, 添加clientType,language与frontId
    const reqData = {
      frontId: App.FRONT_ID,
      clientType: appStore.clientType,
      language: appStore.locale,
      ...(conf[paramKey] || {})
    }

    // 如果已登录则添加用户相关参数
    if (memberStore.isLoged) {
      conf.headers.Authorization = memberStore.token;
      reqData.token = memberStore.token;
      reqData.userId = memberStore.userId;
    }

    conf[paramKey] = reqData;

    // 如果请求为可取消,则添加取消请求对应的token
    if (cancelable) {
      conf.cancelToken = this.cancelSource.token;
    }

    return conf;
  }

  /** TODO 请求阶段出错 */
  handleRequestError (err) {
    console.warn('reqeust error:', err);
    return Promise.reject(err);
  }

  /**
   * 处理响应结果
   *
   * @param {object} result 接口处理结果
   */
  handleResponse ({ data: result }) {
    // 如果处理结果为200, 则表示处理成功,返回内容
    if (result.code === 200) {
      // 判断是否地域限制或者维护
      // 是否包含地域限制属性,如果维护或者地域限制均会包含此属性
      if (result.data?.hasOwnProperty('forbbiden')) {
        appStore.systemState = result.data;
        return Promise.reject();
      }
      return result.data;
    }

    // 如果响应中有msg则提示消息
    if (result.msg) {
      toast({
        type: 'error',
        content: result.msg
      });
    }

    // 返回为失败
    return Promise.reject(result);
  }

  /**
   * TODO 网络连接异常
   * @param {object} err 
   */
  handleResponseError (err) {
    // 如果是因为cancel发生的错误,则不作任何提示
    if (Axios.isCancel(err)) {
      return Promise.reject();
    }
    // 提示网络请求失败
    toast({
      type: 'error',
      key: 'network-error',
      intl: { id: 'common.network_error' }
    });
    return Promise.reject(err);
  }

  /** 销毁对象 */
  destory () {
    // 触发销毁事件
    this.onDestory();
    // 取消所有未完成并可取消的请求
    this.cancelSource.cancel();
  }
}

// 统一添加http请求的几个对应方法
[
  '_get',
  '_post',
  '_put',
  '_delete',
  '_head',
  '_patch'
].forEach(method => {
  BaseApi.prototype[method] = function (...args) {
    return this.axios[method.substring(1)](...args);
  }
});

export default BaseApi;
