import React from 'react'
import {connect} from 'react-redux'

const WfLocaleText = ({
  sno,
  bcontent,
  bstage,
  gtp,
  wfkey = '',
  global: {
    locale = {wf:{}}
  }
}) => {
  let key = wfkey || `wf_${sno}_${bcontent}_${bstage}_${gtp}`
  return locale.wf[key] || key
}
export default connect(state => state,null)(WfLocaleText)