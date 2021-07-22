import React from 'react'
import BetEditText from '@/components/common/BetEditText'

/**
 * 串关数字到中文的映射
 * TODO 本地化需要从语言文件中获取
 */
const SERIES_NAMES = [
  ,,
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五'
]

export default class SeriesItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    let {
      onFocus,
      focus,
      data: {
        mct,
        nm,
        odds,
        value
      }
    } = this.props

    return (
      <div>
        <div className="nb-series-item">
          <div className="nb-series-item-name">{`${SERIES_NAMES[nm]}串一`}</div>
          <div className="nb-series-item-input">
            <label>共{mct}注</label>
            <BetEditText
              value={value || ''}
              style={{
                width: '2rem',
                height: '.6rem'
              }}
              focus={focus}
              placeholder="投注金额"
              onClick={onFocus}
            />
          </div>
        </div>
      </div>
    )
  }
}