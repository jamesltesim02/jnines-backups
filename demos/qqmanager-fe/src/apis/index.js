import React from 'react';
import { observer } from 'mobx-react';
import { useIntl, injectIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
  withRouter,
} from 'react-router-dom';

/**
 * 创建api对象  
 * 
 * @param {class} Type 需要创建的api类型
 * @param {object} props 当前环境需要的props
 */
function createApi (Type, props) {
  const api = new Type();
  api.setProps(props)
  return api;
}

/**
 * 根据api映射或数组构造api对象  
 *
 * @param {object|arry} apiMapping 需要注入的api映射或数组
 * @param {object} props 当前环境所需的props
 */
function makeApis (apiMapping, props) {
  // 如果API是数组则构建为数组
  if (Array.isArray(apiMapping)) {
    return apiMapping.map(Type => createApi(Type, props))
  }

  // 否则构建为对象
  return Object.fromEntries(
    Object.entries(apiMapping).map(
      ([key, Type]) => ([key, createApi(Type, props)])
    )
  )
}

/**
 * 创建api列表hooks 
 *
 * @param  {...any} apis 需要创建的api类型列表
 *
 * @deprecated hooks方式暂时行不通
 */
export function useApi (apiMapping) {
  // history对象
  const history = useHistory();
  // location对象
  const location = useLocation();
  // intl 对象
  const intl = useIntl();

  // 创建api
  const [apis] = React.useState(makeApis(
    apiMapping,
    {
      history,
      location,
      intl
    }
  ))

  // 调用销毁函数, 取消请求
  React.useEffect(
    () => () => (
      (
        Array.isArray(apis) ? apis : Object.values(apis)
      ).forEach(
        api => api.destory()
      )
    ),
    [apis]
  )

  return apis;
}

// TODO 第三种方案使用 装饰器(decorator)实现

/**
 * 高阶函数: 注入api到指定组件  
 * 
 * @param {object} apis 需要注入的api映射
 */
export function withApi (apis) {
  return SubComponent => {
    class WithApiWrappedComponent extends React.Component {
      apiProps;
  
      constructor (props) {
        super(props);
        // 创建api对象列表
        this.apiProps = makeApis(apis, props);
      }
      /** 当组件被卸载时取消当前组件正在发起的所有请求 */
      componentWillUnmount () {
        Object.values(this.apiProps).forEach(
          api => api.destory()
        );
      }

      /** props有变化后更新到api中 */
      componentDidUpdate () {
        Object.values(this.apiProps).forEach(
          api => api.setProps(this.props)
        );
      }
  
      render () {
        return (
          <SubComponent
            {...this.props}
            api={this.apiProps}
          />
        );
      }
    }

    return (
      withRouter(
        injectIntl(
          observer(
            WithApiWrappedComponent
          )
        )
      )
    )
  };
}
