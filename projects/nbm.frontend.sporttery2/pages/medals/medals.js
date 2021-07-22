import React from 'react'
import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Swiper from 'react-id-swiper'

import SubPage from '../../components/common/sub-page'
import LocaledLink from '../../components/common/localed-router'

import MedalTab from '../../components/medals/medal-tab'
import Led from '../../components/medals/led'
import Consecutive from '../../components/medals/consecutive'
import Profit from '../../components/medals/profit'
import Certificated from '../../components/medals/certificated'

import IconNotes from '../../components/icons/icon-notes'


import BgImage from '../../public/images/medal-bg.png'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: primary.main,
      display: 'flex',
      flexDirection: 'column'
    },
    bg: {
      width: '100%',
    },
    container: {
      flexGrow: 1,
      backgroundColor: '#fbe9e8',
      paddingTop: 10,
      margin: '0 15px',
      marginBottom: 37,
      borderRadius: 15,
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    tabs: {
      padding: '0 7%'
    },
    medals: {
    }
  }),
  { name: 'MedalsPage' }
)

function MedalsPage ({
  store: {
    member: {
      memberInfo = {}
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
      titleKey="medal.title"
      padding={0}
      classes={{ content: classes.root }}
      options={
        <LocaledLink href="/medals/desc">
          <IconButton color="inherit">
            <IconNotes />
          </IconButton>
        </LocaledLink>
      }
    >
      <img
        src={BgImage}
        className={classes.bg}
      />
      <div className={classes.container}>
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
              { tag: Led },
              { tag: Consecutive },
              { tag: Profit },
              { tag: Certificated },
            ].map((item, i) => (
              <div key={i}>
                <item.tag info={memberInfo} />
              </div>
            ))
          }
        </Swiper>
      </div>
    </SubPage>
  )
}

export default inject('store')(MedalsPage)
