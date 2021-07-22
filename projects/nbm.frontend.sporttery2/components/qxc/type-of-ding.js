import React from 'react'

import NumberOfGroup from './number-group'

const NS = [
  {
    index: 0,
    name: '千位'
  },
  {
    index: 1,
    name: '百位'
  },
  {
    index: 2,
    name: '十位'
  },
  {
    index: 3,
    name: '个位'
  },
]

const TypeOfDing = ({
  type,
  value,
  onChange = () => {}
}) => {

  if (!value) {
    value = [
      [],
      [],
      [],
      []
    ]
  }

  const handleChange = (v, i) => {
    value[i] = v
    onChange([...value])
  }

  return (
    <section>
      {NS.map(ns => (
        <NumberOfGroup
          key={ns.index}
          title={ns.name}
          value={value[ns.index]}
          onChange={value => handleChange(value, ns.index)}
        />
      ))}
    </section>
  )
}

export default TypeOfDing
