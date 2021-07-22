import React from 'react'
import FullscreenAds from './fullscreen-ads'

import conf from './ads.config'

const QuickbetAds = () => {
  if (!conf || !conf.image) {
    return null
  }

  const start = conf.startTime ? new Date(conf.startTime) : new Date()
  const end = conf.endTime ? new Date(conf.endTime) : null
  const now = Date.now()

  if (
    now < start.getTime()
    ||
    (end && now > end.getTime())
  ) {
    return null
  }

  return (<FullscreenAds {...conf} />)
}

export default QuickbetAds
