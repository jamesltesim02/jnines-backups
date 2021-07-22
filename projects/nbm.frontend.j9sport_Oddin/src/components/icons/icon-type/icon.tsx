import React from 'react'
import mergeClass from '../../../utils/mergeClass'

export default function Icon({
  size,
  width = size,
  height = size,
  className,
  style = {},
  src,
  alt
}:{
    size:number,
    width?: number,
    height?: number,
    className?: any,
    style?: object,
    src: string,
    alt?: string
}) {

  return (
    <img
      alt={alt}
      className={mergeClass("Icon-base", className)}
      src={src}
      style={{
        width: width,
        height: height,
        ...style
      }}
    />
  )
}