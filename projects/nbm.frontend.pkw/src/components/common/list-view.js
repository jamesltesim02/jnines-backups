import React from 'react'
import throttle from 'lodash/throttle'

import MoreBar from '../common/more-bar'

const ListView = ({
  list,
  loading = false,
  nomore = false,
  children = () => {},
  morebar = {},
  itemHeight,
  onNext = () => {}
}) => {
  const rootRef = React.useRef(null)
  const moreRef = React.useRef(null)

  const [direction, setDirection] = React.useState(0)

  const [content, setContent] = React.useState({
    top: 0,
    bottom: 0,
    size: 0
  })

  React.useEffect(
    () => {
      const sheight = document.documentElement.clientHeight
      if (!list.length) {
        setContent({
          top: 0,
          bottom: 0,
          size: 0
        })
        return
      }
      const contentRect = rootRef.current.getBoundingClientRect()
      const size = Math.min(Math.ceil(sheight / itemHeight) + 11, list.length)

      const topCount = Math.ceil((contentRect.y * -1) / itemHeight) - 5
      const top = Math.max(topCount - topCount % 5, 0)
      const bottom = Math.max(list.length - size - top, 0)

      setContent({top, bottom, size })

      // 如果不是向上滚动, 或者正在查询, 或者没有更多数据,则不需要处理下一页判断
      if (direction <= 0 || loading || nomore) {
        return
      }

      // 获取moreButton的位置
      const moreRect = moreRef.current.getBoundingClientRect()
      // 判断是否已经显示到最后3个,如果是则触发下一页事件
      if (moreRect.y - itemHeight * 3 <= sheight) {
        onNext()
      }
    },
    [direction, list.length]
  )

  React.useEffect(
    () => {
      let lastY = window.scrollY
      const handlePageScroll = throttle(
        () => {
          setDirection(window.scrollY - lastY)
          lastY = window.scrollY
        },
        80
      )
      window.addEventListener('scroll', handlePageScroll)
      return () => {
        window.removeEventListener('scroll', handlePageScroll)
      }
    },
    []
  )

  return (
    <section ref={rootRef}>
      <div style={{ height: content.top * itemHeight }} />
      <div>
      {
        content.size ? (
          list.slice(content.top, content.top + content.size)
            .map(item => children(item))
        ) : null
      }
      </div>
      <div style={{ height: content.bottom * itemHeight }} />
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

export default ListView
