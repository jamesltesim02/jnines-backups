import React from 'react'

import VerticalMatchs from './vertical-matchs'

const SportFeatured = ({
  list,
  marketTypes
}) => {
  if (!list || !list.length) {
    return null
  }
  return (
    <VerticalMatchs
      titleKey="matchs.featured"
      matchs={list}
      marketTypes={marketTypes}
    />
  )
}

export default SportFeatured
