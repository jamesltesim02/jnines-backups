import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import { inject, observer } from 'mobx-react'

import mergeClass from '../../../utils/merge-class'

import CsgoImage from './images/19.jpg'
import Dota2Image from './images/20.jpg'
import WzryImage from './images/24.jpg'
import LolImage from './images/25.jpg'

import ButtonArea from '../../common/button-area'

// DOta2: 20,  csgo:19 LOL:25 王者荣耀：24
const useStyles = makeStyles(
  {
    root: {
      margin: '6px 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: 2,
      '& i': {
        display: 'block',
        width: '100%',
        height: '24.193548387096775vw',
        maxHeight: 232,
        backgroundSize: '100% 100%'
      }
    },
    pc: {
      marginTop: 30,
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: 20,
      '& button': {
        borderRadius: 4,
        overflow: 'hidden',
      },
      '& i': {
        height: 180,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }
    }
  },
  { name: 'EsportTypes' }
)

/**
 * 电竞快捷入口类型
 * 19: CS GO
 * 20: Dota2
 * 24: 王者荣耀
 * 25: LOL
 */
const TYPES = [
  {
    value: 19,
    image: CsgoImage,
  },
  {
    value: 20,
    image: Dota2Image,
  },
  {
    value: 24,
    image: WzryImage,
  },
  {
    value: 25,
    image: LolImage,
  },
]

const EsportTypes = ({
  store: { app }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  return (
    <section
    className={
      mergeClass(
        classes.root,
        app.pcMode ? classes.pc : null
      )
    }
    >
      {
        TYPES.map(({ value, image }) => (
          <ButtonArea
            key={value}
            ripple="white"
            onClick={
              () => history.push(`/category/esports/99/${value}-${intl.formatMessage({ id: `esports.${value}` })}`)
            }
          >
            {/* <img src={image} alt="" /> */}
            <i style={{ backgroundImage: `url(${image})` }} />
          </ButtonArea>
        ))
      }
    </section>
  )
}

export default inject('store')(
  observer(EsportTypes)
)
