import React from 'react';
import fromPairs from 'lodash/fromPairs';

const forwardRefSymbol = Symbol.for("react.forward_ref");

/**
 * 根据api映射或数组构造api对象  
 *
 * @param {object|arry} apiMapping 需要注入的api映射或数组
 * @param {object} props 当前环境所需的props
 */
function makeApis (apiMapping) {
  // 如果API是数组则构建为数组
  if (Array.isArray(apiMapping)) {
    return apiMapping.map(Type => new Type())
  }

  // 否则构建为对象
  return fromPairs(
    Object.entries(apiMapping).map(
      ([key, Type]) => ([key, new Type()])
    )
  )
}

/**
 * 创建api列表hooks 
 *
 * @param  {...any} apis 需要创建的api类型列表
 */
export function useApi (apiMapping) {
  // 创建api
  const [apis] = React.useState(makeApis(apiMapping));

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

/**
 * 高阶函数: 注入api到指定组件  
 * 
 * @param {object} apis 需要注入的api映射
 */
export const withApi = apis => SubComponent => React.forwardRef((props, ref) => {
  const api = useApi(apis);
  let newProps = { api, ...props };
  if (SubComponent["$$typeof"] === forwardRefSymbol) {
    newProps.ref = ref;
  }
  return React.createElement(
    SubComponent,
    newProps,
  );
});
