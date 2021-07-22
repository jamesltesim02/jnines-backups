import React from 'react'
import debounce from 'lodash/debounce'
import Swiper from 'react-id-swiper'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import { withLocaledRouter } from '../common/localed-router'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import RemoteImg from '../common/remote-img'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    },
    img: {
      width: '100%',
      height: '100%',
    },
    numberText: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      zIndex: 3,
      color: '#fff',
      background: 'rgba(0, 0, 0, .6)',
      width: '52px',
      lineHeight: '24px',
      textAlign: 'center',
      borderRadius: 100
    }
  },
  { name: 'Banner' }
)

const getSize = (width, proportion = 1) => {
  return {
    width,
    height: width * proportion
  }
}

function Banner ({
  items = [],
  localedRouter,
  hp = 1
}) {
  const classes = useStyles()

  const rootRef = React.useRef(null)
  // banner的宽高值state
  const [size, setSize] = React.useState(getSize(375, hp))
  const handleResize = debounce(() => setSize(getSize((rootRef.current || {}).clientWidth, hp)), 150)
  React.useEffect(
    () => {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    },
    []
  )

  // 当前索引state
  const [index, setIndex] = React.useState(0)

  return (
    <section
      className={classes.root}
      ref={rootRef}
    >
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        on={{
          slideChange () {
            setIndex(this.activeIndex)
          }
        }}
      >
      {
        items.map(item => (
          <div key={item._id}>
            <ButtonArea
              ripple="white"
              onClick={() => {
                if (!item.url) {
                  return
                }
                if (/https?:\/\/.+/.test(item.url)) {
                  window.open(item.url)
                  return
                }
                if (/^\/user.+/i.test(item.url)) {
                  window.location = item.url
                  return
                }
                localedRouter.push(item.url)
              }}
            >
              <RemoteImg
                src={item.thumbnail}
                className={classes.img}
                style={{ minHeight: size.height }}
              />
            </ButtonArea>
          </div>
        ))
      }
      </Swiper>
      <SmallFont
        size={10}
        className={classes.numberText}
      >{index + 1}/{items.length}</SmallFont>
    </section>
  )
}

export default withLocaledRouter(Banner)
