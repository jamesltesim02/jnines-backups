import React from 'react'
import { useLocation } from 'react-router'

import './lmt.css'

const LmtPage = () => {
  const widget = React.useRef(null)
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  React.useEffect(
    () => {
      const initWidget = () => {
        if(window.SIR) {
          window.SIR(
            'addWidget',
            widget.current,
            'match.lmtPlus',
            {
              showOdds:true,
              scoreboard: "disable",
              detailedScoreboard: "disable",
              matchId: params.get('id')
            }
          )
        }
      }
      if (!window.SIR) {
        window.SIR = (...params) => {
          if (!window.SIR.q) {
            window.SIR.q = []
          }
          window.SIR.q.push(params)
        }

        window.SIR.l = Date.now()
        window.SIR.o = {
          theme: false,
          language: params.get('locale') || 'zh'
        }

        const el = document.createElement('script')
        el.async = 1
        // el.src = 'https://widgets.sir.sportradar.com/sportradar/widgetloader'
        // 新token: 1b894c940384c6f2e961a67f416901e5
        // el.src = 'https://widgets.sir.sportradar.com/713ad42ed654599df32c28e1f95b871b/widgetloader'
        // el.src = 'https://widgets.sir.sportradar.com/1b894c940384c6f2e961a67f416901e5/widgetloader'
        el.src = 'https://widgets.sir.sportradar.com/713ad42ed654599df32c28e1f95b871b/widgetloader'
        el.setAttribute('n', 'SIR')
        el.addEventListener('load', initWidget)

        document.querySelector('head').appendChild(el)
      } else {
        initWidget()
      }
    },
    [params]
  )
  return (
    <div
      ref={widget}
      className="lmt-root"
    />
  )
}

export default LmtPage
