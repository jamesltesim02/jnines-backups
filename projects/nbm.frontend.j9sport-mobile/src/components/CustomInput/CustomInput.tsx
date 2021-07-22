import React, {useEffect, useState} from 'react';
import mergeClass from "../../utils/mergeClass";

import { Icon } from "antd-mobile";
import warnImg from "../../pages/Account/components/Input/img/warn.png";

export type CUSTOM_INPUT_TYPE =  {
  value?: any
  onChange?: Function
  type?: string
  maxLength?: number
  check?: boolean
  required?: boolean
  className?: string
  before?: React.ReactElement
  after?: React.ReactElement
  onFocus?: Function
  onBlur?: Function
  placeholder?: string
  message?: string
  trim?: boolean
}

/**
 *  CustomInput
 * @param option CustomInput
 * @param option.value value
 * @param option.onChange onChange
 * @param option.type input框类型
 * @param option.maxLength 最大长度
 * @param option.check 控制显示右侧绿色勾
 * @param option.required 控制显示左侧
 * @param option.className className
 * @param option.before 左侧自定义槽位
 * @param option.after 右侧自定义槽位
 * @param option.onFocus onFocus
 * @param option.onBlur onBlur
 * @param option.placeholder placeholder
 * @param option.message 表单验证显示的信息
 */
function CustomInput(
  {
    value,
    onChange,
    type = 'text',
    maxLength = 50,
    check = false,
    required = false,
    className,
    before,
    after,
    onFocus,
    onBlur,
    placeholder,
    message,
    trim
  }: CUSTOM_INPUT_TYPE
) {
  const [showClear, setShowClear] = useState(false)

  const handleFocus = (event: React.FocusEvent) => {
    !!value && setShowClear(true)
    onFocus && onFocus(event)
  }

  const handleBlur = (event: React.FocusEvent) => {
    setTimeout(()=> {
      setShowClear(false)
    })
    onBlur && onBlur(event)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   onChange && onChange(event)
  }

  useEffect(() => {
    !!value && setShowClear(true)
  },[value])

  return (
    <div
      className="custom-input"
      style={message ? {marginBottom: 0} : {}}
    >
      <div className={
        mergeClass({
          "acc-custom-input": true,
          "check-pot": required,
          [`${className}`]: className
        })
      }
      >
        {/*左边*/}
        {
          before
          &&
          <span className="acc-custom-input-before">
        {before}
      </span>
        }
        <div className="acc-custom-input-input">
          {/*输入框*/}
          <input
            type={type}
            maxLength={maxLength}
            placeholder={placeholder}
            value={value || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Icon
            className={mergeClass({
              "hide": !check ||  showClear
            })}
            type="check-circle"
            color="#3ada45"
            size={"xxs"}
          />
          {/*清除按钮*/}
          <Icon
            className={mergeClass({
              "hide": !showClear
            })}
            type="cross"
            color="#d4d4d4"
            size={"xs"}
            onClick={() => onChange && onChange('')}
          />
        </div>
        {/*右边*/}
        {
          after
          &&
          <span className="acc-custom-input-after">
            {after}
          </span>
        }
      </div>
      {
        message
        &&
        <div className="acc-custom-verify">
          <img src={warnImg} alt=""/>
          {message}
        </div>
      }
    </div>
  );
}

export default CustomInput;