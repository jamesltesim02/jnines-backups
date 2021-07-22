import React from 'react'

import NumberGroup from './number-group'

const TypeOfXian = ({
  type,
  value,
  onChange = () => {}
}) => {
  return (
    <NumberGroup
      title="不定位"
      value={value}
      onChange={onChange}
    />
  )
}

export default TypeOfXian
