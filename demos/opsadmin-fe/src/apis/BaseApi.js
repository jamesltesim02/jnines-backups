import Axios from 'axios';
import { message } from 'antd';

import { ApiConst } from '../consts/network';
import AppStore from '../stores/app'
import MemberStore from '../stores/member'

if (process.env.NODE_ENV !== 'production') {
  const mock = require('./mock');
  mock.default();
}

// 统一设置axios公共配置属性
Axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
Axios.defaults.timeout = ApiConst.TIMEOUT;
Axios.defaults.withCredentials = ApiConst.WITH_CREDENTIALS;

/** api请求基类, 封装网络请求公共业务 */
class BaseApi {

  /** axios对象,用于请求网络 */
  axios;
  /** 取消接口的凭证 */
  cancelSource = Axios.CancelToken.source();
  /** 当前环境的props */
  props;

  constructor(conf) {
    // 创建axios对象
    this.axios = Axios.create({
      headers: {
        'Accept-Language': AppStore.locale,
        'Authorization': MemberStore.token
      },
      ...conf
    });

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

  /** 初始化: 设置当前组件相关的props */
  setProps (props) {
    this.props = props;
  }

  /**
   * TODO 请求公共参数设置  
   *
   * @param {object} conf 当前已有配置
   */
  handleRequest ({
    cancelable = true,
    ...conf
  }) {
    // 如果请求为可取消,则添加取消请求对应的token
    if (cancelable) {
      conf.cancelToken = this.cancelSource.token;
    }

    // TODO 添加测试i18n
    // console.log(this.props.intl.formatMessage({ id: 'message.success' }))
    // TODO 测试toast
    // message.info('handle request');

    // message.info(
    //   this.props.intl.formatMessage({ id: 'message.success' })
    // );

    // TODO 测试跳转
    // setTimeout(
    //   () => {
    //     this.props.history.push('/other')
    //   },
    //   1000
    // )

    return conf;
  }

  /** TODO 请求阶段出错 */
  handleRequestError (err) {
    console.warn('reqeust error:', err);
    return Promise.reject(err);
  }

  /**
   * TODO 处理响应结果
   *
   * @param {object} result 接口处理结果
   */
  handleResponse ({ data: result }) {
    if (result.code === 0) {
      return result.data;
    }

    if (result.message) {
      message.error(result.message);
    }

    return Promise.reject(result)
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
    message.error({
      content: '网络请求错误,请稍后再试!',
      key: 'network-error'
    });
    return Promise.reject(err);
  }

  /** 销毁对象 */
  destory () {
    // 触发销毁事件
    this.onDestory();
    // 取消所有未完成并可取消的请求
    this.cancelSource.cancel();
    console.log('destoried');
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
