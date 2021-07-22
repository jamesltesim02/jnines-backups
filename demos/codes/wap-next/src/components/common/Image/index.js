import React from 'react'

export default (props) => {
  if(!props.src) {
    throw new Error('图片地址不能为空')
  }

  if(!/(^data\:image\/)|(^https?\:\/\/)/i.test(props.src)) {
    let ItemWithOvalueUrl = window.NBServer.p_stm;
    props = {
      ...props,
      src: staticUrl += props.src
    }
  }
  return (
    <img
      {
        ...props
      }
    />
  )
}