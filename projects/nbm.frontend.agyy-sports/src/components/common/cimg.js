import React from 'react'

const Cimg = ({
  src,
  ...props
}) => {
  const newSrc = (
    /(^https?:\/\/|^data:).+/gi.test(src)
    ? src
    : (window.__AGYY_SPORTS_CONFIG__.RESOURCE_URL + src)
  )
  
  return (
    <img
      src={newSrc}
      alt=""
      {...props}
    />
  )
}

export default Cimg
