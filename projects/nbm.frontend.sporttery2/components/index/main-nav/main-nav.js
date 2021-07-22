import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { AG_SPORTS_URL, DIGITAL_LOTTERY_AVAILABLE } from '../../../config/config.ops'
import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'
import Block from '../../common/block'
import ButtonArea from '../../common/button-area'
import { withLocaledRouter } from '../../common/localed-router'

import SoccerImage from './icons/soccer.png'
import BasketballImage from './icons/basketball.png'
import OnlineImage from './icons/online.png'
import RecommendImage from './icons/recommend.png'
import LiveImage from './icons/live.png'
import NewsImage from './icons/news.png'
import ShopImage from './icons/shop.png'
import QxcImage from './icons/qxc.png'
import PlwImage from './icons/plw.png'
import AgyyImage from './icons/agyybet.png'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      '& > button': {
        position: 'relative',
        '&::before, &::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          background: '#ddd',
          transformOrigin: 'right bottom',
          transform: 'scale(.5)',
        },
        '&::before': {
          width: 1,
          height: '200%',
          right: 0,
          bottom: 0,
        },
        '&::after': {
          width: '200%',
          height: 1,
          right: 0,
          bottom: 0,
        },
        '&:nth-child(3n)::before': {
          display: 'none'
        },
        '&:nth-last-child(-n + 3)::after': {
          display: 'none'
        }
      },
    },
    item: {
      display: 'grid',
      width: '100%',
      padding: '15px 0',
      gridTemplateColumns: '1fr 1fr'
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 7,
      '& > img': {
        width: 45,
        height: 45
      }
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      whiteSpace: 'nowrap'
    },
    title: {
      position: 'relative',
      fontSize: 13,
      '& > i': {
        position: 'absolute',
        display: 'block',
        width: 8,
        height: 8,
        backgroundColor: primary.main,
        borderRadius: '50%',
        right: -5,
        top: -5
      }
    },
    desc: {
      fontSize: 12,
      color: '#888'
    },
    hl: {
      color: primary.main
    }
  }),
  { name: 'MainNav' }
)

// 列表项
const items = [
  // 竞彩足球
  {
    key: 'soccer',
    icon: SoccerImage,
    url: '/match/lottery?sportId=10'
  },
  // 竞彩篮球
  {
    key: 'basketball',
    icon: BasketballImage,
    url: '/match/lottery?sportId=11'
  },
  // 现场竞彩
  {
    key: 'online',
    icon: OnlineImage,
    url: '/match/inplay'
  },
  // 神单推荐
  {
    key: 'recommend',
    icon: RecommendImage,
    url: '/gurus'
  },
  // 赛事直播
  {
    key: 'live',
    icon: LiveImage,
    url: '/match/live'
  },
  // 积分商城
  {
    key: 'shop',
    icon: ShopImage,
    url: '/shop'
  },
  // 七星彩
  {
    key: 'qxc',
    icon: QxcImage,
    url: '/qxc?group=1'
  },
  // 排列五
  {
    key: 'plw',
    icon: PlwImage,
    url: '/qxc?group=2'
  },
  // 热门资讯
  // {
  //   key: 'news',
  //   icon: NewsImage,
  //   url: '/news'
  // },
  // 亚游体育
  {
    key: 'agsports',
    icon: AgyyImage,
    url: AG_SPORTS_URL
  },
]

function MainNav ({
  store: { toast },
  localedRouter
}) {
  const classes = useStyles()

  return (
    <Block className={classes.list}>
    {
      items.map((item) => (
        <ButtonArea
          key={item.key}
          onClick={() => {
            if (
              !DIGITAL_LOTTERY_AVAILABLE
              &&
              ['qxc', 'plw'].includes(item.key)
            ) {
              toast.warning('即将开放, 敬请期待...')
            } else {
              if (/^https?:/i.test(item.url)) {
                window.open(item.url)
              } else {
                localedRouter.push(item.url)
              }
            }
          }}
        >
          <div className={classes.item}>
            <div className={classes.icon}>
              <img src={item.icon} />
            </div>
            <div className={classes.content}>
              <header
                className={
                  mergeClass(
                    classes.title,
                    item.key === 'shop' ? classes.hl : null
                  )
                }
              >
                <M id={`index.${item.key}`} />
                {item.key === 'shop' ? <i /> : null}
              </header>
              <p className={classes.desc}>
                <M id={`index.${item.key}desc`} />
              </p>
            </div>
          </div>
        </ButtonArea>
      ))
    }
    </Block>
  )
}

export default inject('store')(
  observer(
    withLocaledRouter(MainNav)
  )
)
