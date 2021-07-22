import React from 'react';
import { Icon } from 'antd-mobile';
import mergeClass from '../../../utils/mergeClass';

/**
 * ### 显示快标题组件
 * 
 * @param param组件参数
 * ```typescript
 * {
 *  title {any} 标题主要内容
 *  subTitle {any} 标题次要内容
 *  arrow {boolean} 是否显示箭头
 *  className {string | undefined} 自定义样式
 * }
 * ```
 */
function BlockTitle (
  {
    title,
    subTitle,
    arrow,
    className,
    onClick
  }: {
    title: any,
    subTitle?: any,
    arrow?: boolean,
    className?: string,
    onClick?: () => void
  }
) {
  return (
    <header
      className={mergeClass('block-title', className)}
      onClick={onClick}
    >
      <label>{title}</label>
      {
        subTitle
        ? <span>{subTitle}</span>
        : null
      }
      {
        arrow
        ? <Icon type="right" />
        : null
      }
    </header>
  );
}

export default BlockTitle;
