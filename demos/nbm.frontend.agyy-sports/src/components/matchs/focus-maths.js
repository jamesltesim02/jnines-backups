import React from 'react'

import VerticalMatchs from './vertical-matchs/vertical-matchs'

const FocusMatchs = ({ list }) => {
  if (!list || !list.length) {
    return null
  }
  return (
    <VerticalMatchs
      titleKey="matchs.focus"
      matchs={list}
    />
  )
}

export default FocusMatchs
