import React from 'react'
import { RESOURCE_URL } from '../../config/config.ops'

const Cimg = ({
  src,
  ...props
}) => {
  const newSrc = /(^https?:\/\/|^data:).+/gi.test(src) ? src : (RESOURCE_URL + src)

  return (
    <img
      src={newSrc}
      {...props}
    />
  )
}

export default Cimg
