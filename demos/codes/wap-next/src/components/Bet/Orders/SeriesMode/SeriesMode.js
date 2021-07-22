import React from 'react'
import KeyBoard from '@/components/common/KeyBoard'
import SeriesItem from './SeriesItem'
import OrderList from '../OrderList'

import './SeriesMode.css'
import toast from '@/utils/toast';

export default class SeriesMode extends React.Component {
  constructor(props) {
    super()

    this.state = {
      focusIndex: 1,
      serieses: this.getSerieses(props)
    }
  }

  getSerieses({serieses, seriseLimit, nb_default_bet}) {
    let defaultLimit = seriseLimit.lmt4 || 99999999999999

    return serieses.map((v, i) => {
      let max = parseInt((seriseLimit[v.nm] || defaultLimit)/+v.odds)
      let value = ''

      if(this.state && this.state.serieses && this.state.serieses[i]) {
        value = this.state.serieses[i].value
      }

      return {
        ...v,
        // TODO 确认是否需要默认投注额
        // value: nb_default_bet || '',
        value: value,
        max: max,
        min: 2
      }
    })
  }

  /**
   * 当props修改时 重新计算串关的列表
   * @param {object} newProps
   *      新props
   */
  componentWillReceiveProps (props) {
    this.setState({
      serieses: this.getSerieses(props),
      focusIndex: 1
    })
  }

  /**
   * 修改value事件
   * @param {string} value
   *    新value值
   */
  changeValue (value) {
    let {
      serieses,
      focusIndex
    } = this.state

    let newData = [...serieses]
    newData[focusIndex].value = value

    this.setState({serieses: newData})
  }

  handleSubmit (valideSerieses) {
    let {
      onSubmit
    } = this.props

    if(valideSerieses.filter(v => v.value < 2).length) {
      // TODO 需要从语言文件中获取
      toast('投注金额不能小于2元')
      return 
    }

    onSubmit && onSubmit(valideSerieses)
  }

  render () {
    let {
      items,
      isLoged,
      currentUser,
      matchOptionsCounts,
      onClear,
      onDelete
    } = this.props

    let {
      serieses,
      focusIndex
    } = this.state

    // 获取当前有投注额度的串关项
    let valideSerieses = serieses.filter(({value})=>!!value)
    // 计算订单数量
    let orderCount = valideSerieses.reduce((sum, {mct}) => sum + mct,0)

    return (
      <div>
        <div className="nb-order-operates">
          <div className="nb-order-operates-title">投注选项</div>
          <div className="nb-order-operates-option">
            <a className="nb-order-clear-button" onClick={onClear}>全部清除</a>
          </div>
        </div>
        <div className="nb-order-series">
          <div className="nb-series-form">
            <div className="nb-series-list">
            {
              serieses.map((v,i) => (
                i ? <SeriesItem 
                      key={i}
                      data={v}
                      focus={focusIndex === i}
                      onFocus={() => this.setState({focusIndex: i})} 
                    />
                  : null
              ))
            }
            </div>
            {/* <div className="nb-series-kb-container">
              <KeyBoard
                type={1}
                min={serieses[focusIndex].min}
                max={serieses[focusIndex].max}
                value={serieses[focusIndex].value}
                onValueChange={this.changeValue.bind(this)}
                onSubmit={()=>orderCount && this.handleSubmit(valideSerieses)}
              />
            </div> */}
            <KeyBoard
              type={1}
              max={serieses[focusIndex].max}
              value={serieses[focusIndex].value}
              onValueChange={this.changeValue.bind(this)}
              onSubmit={()=>orderCount && this.handleSubmit(valideSerieses)}
            />
            <div className="nb-series-summary">
              {
                isLoged
                ? (
                  <div>
                    余额: <span>{currentUser.totalBalance}</span>
                  </div>
                )
                : <div></div>
              }
              <div className="nb-series-totalamount">
                可赢额: 
                <span>
                  {
                    valideSerieses.reduce(
                      (sum, {mct, odds, value}) => (sum + (mct * +odds *  +value) + value), 
                      0
                    ).toFixed(2)
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="nb-order-operates">
            <div className="nb-order-operates-title">投注单</div>
            <div className="nb-order-operates-option">
              <span className="nb-order-operates-tips">所选红色项目中有关类似选项不能组合串关</span>
            </div>
          </div>
          <OrderList
            diseries={true}
            matchOptionsCounts={matchOptionsCounts}
            items={items}
            onDelete={onDelete}
          />
        </div>
      </div>
    )
  }
}