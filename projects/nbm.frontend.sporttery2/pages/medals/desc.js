import React from 'react'
import { inject } from 'mobx-react'
import Swiper from 'react-id-swiper'
import { makeStyles } from '@material-ui/core/styles'
import SubPage from '../../components/common/sub-page'

import MedalTab from '../../components/medals/medal-tab'
import DescItem from '../../components/medals/desc-item'

const useStyles = makeStyles(
  {
    tabs: {
      backgroundColor: '#fff'
    }
  },
  { name: 'MedalDescPage' }
)

function MedalDescPage ({
  store: {
    member: {
      memberInfo: {
        medal = {}
      } = {}
    }
  }
}) {
  const classes = useStyles()
  const [type, setType] = React.useState(0)
  const [swiper, setSwiper] = React.useState(null)

  React.useEffect(() => {
    if (swiper) {
      swiper.slideTo(type)
    }
  }, [type])

  return (
    <SubPage
      titleKey="medal.desc"
      padding={0}
    >
      <MedalTab
        value={type}
        className={classes.tabs}
        onChange={setType}
      />
      <Swiper
        on={{
          slideChange () {
            setType(this.activeIndex)
          }
        }}
        getSwiper={setSwiper}
      >
      {
        [
          {
            type: 'led',
            value: medal.totalRed || 0
          },
          {
            type: 'consecutive',
            value: medal.historyHit || 0
          },
          {
            type: 'profit',
            value: medal.winAmount || 0
          },
          {
            type: 'certificated',
            value: [
              medal.winAmount || 0,
              medal.totalRed || 0
            ]
          }
        ].map((item, i) => (
          <div key={i}>
            <DescItem {...item} />
          </div>
        ))
      }
      </Swiper>
    </SubPage>
  )
}

export default inject('store')(MedalDescPage)