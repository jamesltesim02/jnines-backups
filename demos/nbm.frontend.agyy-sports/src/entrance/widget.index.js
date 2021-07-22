import React from 'react'
import ReactDOM from 'react-dom'

import WidgetApp from './widget.app'

window.addEventListener('NBWidget:addWidget', ({
  options: {
    target,
    ...options
  }
}) => {

  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  if (!target instanceof HTMLElement) {
    console.error(`BetWidge-addWidget: Render failed, target option must be exists element or selector.`)
    return
  }

  ReactDOM.render(
    <WidgetApp
      {...options}
    />,
    target
  )
})
