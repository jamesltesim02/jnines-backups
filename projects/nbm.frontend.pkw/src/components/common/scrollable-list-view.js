import React from 'react'
import { observer } from 'mobx-react'
import throttle from 'lodash/throttle'

import MoreBar from '../common/more-bar'

const ScrollableListView = ({
  list,
  loading = false,
  nomore = false,
  morebar = {},
  nextcheck = undefined,
  onNext = () => {},
  onScroll = () => {},
  children,
  holderHeight = {
    top: 0,
    bottom: 0
  },
  ...props
}) => {
  const rootRef = React.useRef(null)
  const moreRef = React.useRef(null)
  const [direction, setDirection] = React.useState(0)
  const [pa, setPa] = React.useState(true)

  React.useEffect(
    () => {
      // 如果不是向上滚动, 或者正在查询, 或者没有更多数据,则不需要处理下一页判断
      if (direction <= 0 || loading || nomore) {
        return
      }

      // 文档内容高度
      const sheight = document.documentElement.clientHeight
      // 获取moreButton的位置
      const moreRect = moreRef.current.getBoundingClientRect()
      // 判断是否已经显示到底部,如果是则触发下一页事件
      if (moreRect.y - 230 <= sheight) {
        onNext()
      }
    },
    [direction]
  )

  React.useEffect(
    () => {
      const timer = setTimeout(() => {
        if (pa) {
          setDirection(direction + 10)
        }
      }, 300)

      return () => clearTimeout(timer)
    },
    [nextcheck, pa]
  )

  React.useEffect(
    () => {
      let lastY = window.scrollY
      const handlePageScroll = throttle(
        e => {
          const direction = window.scrollY - lastY
          setDirection(direction)
          onScroll({
            ...e,
            y: window.scrollY,
            direction
          })
          lastY = window.scrollY
        },
        80
      )

      window.addEventListener('scroll', handlePageScroll)
      return () => {
        setPa(false)
        window.removeEventListener('scroll', handlePageScroll)
      }
    },
    []
  )

  return (
    <section ref={rootRef}>
      {list.map(item => children(item, props))}
      <MoreBar
        ref={moreRef}
        loading={loading}
        nomore={nomore}
        {...morebar}
        onMore={onNext}
      />
    </section>
  )
}

export default observer(ScrollableListView)
