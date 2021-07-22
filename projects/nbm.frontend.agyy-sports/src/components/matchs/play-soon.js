import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import BannerAnim, { Element } from 'rc-banner-anim'

import mergeClass from '../../utils/merge-class'
import dateFormat from '../../utils/simple-date-format'
import { getSlideUrl } from '../../utils/resource-url'
import DefaultImage from '../../assets/images/default-banner.jpg'

import M from '../common/m'
import ButtonArea from '../common/button-area'
import VerticalInfo from './vertical-matchs/vertical-info'

import 'rc-banner-anim/assets/index.css'

const useStyles = makeStyles(
  ({ palette: { primary } }) => {
    const mobileMatchs = {
      height: 100,
      borderRadius: 3,
      background: primary.main,
      overflow: 'hidden',
    }

    return ({
      root: {
        display: 'grid',
        gridTemplateColumns: '205fr 160fr',
        gridColumnGap: 5,
        marginTop: 6,
        height: 140,
        fontSize: 12,
        color: '#fff',
        whiteSpace: 'nowrap'
      },
      banner: {
        height: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      },
      matchs: {
        background: '#fff',
        padding: '0 10px 10px',
      },
      mheader: {
        letterSpacing: -.5,
        fontWeight: 500,
        color: '#000',
        height: 30,
        lineHeight: '30px',
        '& > label': {
          fontSize: 15,
        },
      },
      mlist: {
        ...mobileMatchs,
        '& > div': {
          height: '200%',
          overflow: 'hidden',
        },
        '& button': {
          borderRadius: 3,
          height: '50%',
          overflow: 'hidden',
        }
      },
      empty: {
        ...mobileMatchs,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      item: {
        height: '100%',
        padding: '16px 0 17px',
        display: 'grid',
        gridTemplateRows: '20fr 22fr',
        alignItems: 'center',
        overflow: 'hidden',
      },
      tour: {
        padding: '0 8px',
        opacity: .7,
        display: 'grid',
        gridTemplateColumns: '1fr 30px',
        overflow: 'hidden',
        '& > label': {
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      },
      team: {
        display: 'grid',
        gridTemplateColumns: '1fr 16px 1fr',
        textAlign: 'center',
        overflow: 'hidden',
        '& > label': {
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      },
      '@keyframes slideUp': {
          from: {
            transform: 'translate3d(0, 0, 0)',
            visibility: 'visible'
          },
          to: {
            transform: 'translate3d(0, -50%, 0)'
          }
      },
      animating: {
        animation: '$slideUp .3s'
      },
      pc: {
        gridTemplateColumns: '780fr 380fr',
        gridColumnGap: 20,
        height: 280,
        color: '#333',
        '& $banner': {
          borderRadius: 4
        },
        '& $mheader': {
          marginTop: -10,
          padding: '10px 0',
          height: 40,
          '& > header': {
            display: 'flex',
            lineHeight: '12px',
            fontWeight: 400,
            '& > label': {
              flexGrow: 1,
              fontSize: 12,
            },
            '& > span': {
              position: 'relative',
              paddingRight: 17,
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 5,
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                width: 5,
                height: 5,
                borderTop: '1px solid #4c4c4c',
                borderRight: '1px solid #4c4c4c',
              }
            },
          },
        },
        '& $empty': {
          height: 250,
          background: '#fff'
        },
        '& $matchs': {
          backgroundColor: 'transparent',
          padding: 0
        },
        '& $mlist': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 250,
          backgroundColor: 'transparent',
          '& > button': {
            height: 120,
            background: '#fff',
            borderRadius: 4,
            '& > ul':{
              '& > li > img': {
                transform: 'scale(1.35)'
              },
              '& > li > label': {
                marginTop: 20
              },
              '& > li:nth-child(2)': {
                '& > div, & > time': {
                  width: 100,
                  marginLeft: -40
                },
                '& > label': {
                  width: 40,
                  marginLeft: -10,
                  fontSize: 20,
                  textAlign: 'center'
                }
              },
              '&::after': {
                display: 'none'
              }
            },
            '&:nth-child(2)': {
              marginTop: 10,
              textAlign: 'center'
            }
          }
        },
        '& .holder': {
          textAlign: 'center',
          color: '#999',
          backgroundColor: '#f5f5f5'
        }
      },
    })
  },
  { name: 'PlaySoon' }
)

const PlaySoon = ({
  store: { app },
  ad: adList,
  list
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [matchs, setMatchs] = React.useState([])
  const [animating, setAnimating] = React.useState(false)

  const handleClick = mid => {
    if (!animating) {
      history.push(`/match/${mid}`)
    }
  }

  React.useEffect(
    () => {
      if (app.pcMode) {
        setMatchs(list.slice(0, 2))
        return
      }
      if (list.length < 2) {
        setMatchs(list)
        return
      }
      let index = 0
      const setMatchsFromList = () => {
        if (index === list.length - 1) {
          setMatchs([list[index], list[0]])
        } else {
          setMatchs(list.slice(index, index + 2))
        }
      }

      let changeIndexTimer = null
      const loopInterval = setInterval(
        () => {
          index = (
            index === list.length - 1
            ? 0
            : index + 1
          )
          setAnimating(true)
          changeIndexTimer = setTimeout(
            () => {
              setMatchsFromList()
              setAnimating(false)
            },
            300
          )
        },
        3000
      )

      setMatchsFromList()

      return () => {
        clearInterval(loopInterval)
        clearTimeout(changeIndexTimer)
      }
    },
    [list]
  )

  // let ad = (
  //   (
  //     adList
  //     &&
  //     adList.length > 0
  //   ) ? ({
  //     ...adList[0],
  //     imageWap: `${getSlideUrl(adList[0].imageWap)}`
  //   }) : ({
  //     imageWap: DefaultImage,
  //     url: null,
  //     matchId: null
  //   })
  // )

  // const banners = (
  //   adList
  //   ? adList.filter(({ imageWap }) => Boolean(imageWap))
  //   : []
  // )

  return (
    <section
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <ButtonArea
        className={classes.banner}
        style={{ backgroundImage: `url(${DefaultImage})` }}
      />
      {/* {
        banners && banners.length ? (
          <BannerAnim
            arrow={false}
            autoPlay
            type="across"
          >
          {
            banners.map(item => (
              <Element
                key={item.slideId}
                prefixCls="banner-user-elem"
              >
                <ButtonArea
                  className={classes.banner}
                  style={{ backgroundImage: `url(${getSlideUrl(item.imageWap)})` }}
                  onClick={() => {
                    if (item.matchId && item.matchId !== 'null') {
                      history.push(`/match/${item.matchId}`)
                      return
                    }
                    if (/^https?:\/\//i.test(item.url)) {
                      window.open(item.url)
                      return
                    }
                    if (item.url) {
                      history.push(item.url)
                      return
                    }

                    history.push(`/promo-detail/${item.slideId}`)
                  }}
                />
              </Element>
            ))
          }
          </BannerAnim>
        ) : (
          <ButtonArea
            className={classes.banner}
            style={{ backgroundImage: `url(${DefaultImage})` }}
          />
        )
      } */}
      <div className={classes.matchs}>
        <ButtonArea
          onClick={() => history.push('/playing-soon')}
          className={classes.mheader}
        >
          <header>
            <label><M id="matchs.playsoon" /></label>
            {
              matchs.length > 0 ? (
                <span><M id="categories.all" /></span>
              ) : null
            }
          </header>
        </ButtonArea>
        {
          matchs.length ? (
            <div className={classes.mlist}>
              {
                app.pcMode ? (
                  <>
                    {
                      matchs.map(match => (
                        <VerticalInfo
                          key={match.matchId}
                          pcMode={app.pcMode}
                          match={match}
                        />
                      ))
                    }
                    {
                      matchs.length === 1
                      ? (
                        <ButtonArea className={classes.holder}>
                          <M id="common.empty1" />
                        </ButtonArea>
                      )
                      : null
                    }
                  </>
                ) : (
                  <div className={animating ? classes.animating : null}>
                    {
                      matchs.map(match => {
                        const teams = match.matchName.split(' vs ')
                        return (
                          <ButtonArea
                            key={match.matchId}
                            onClick={() => handleClick(match.matchId)}
                          >
                            <div className={classes.item}>
                              <div className={classes.tour}>
                                <label>{match.tournamentName}</label>
                                <time>{dateFormat(+match.matchDate, 'HH:mm')}</time>
                              </div>
                              <div className={classes.team}>
                                <label>{teams[0]}</label>
                                <span>VS</span>
                                <label>{teams[1]}</label>
                              </div>
                            </div>
                          </ButtonArea>
                        )
                      })
                    }
                  </div>
                )
              }
            </div>
          ) : (
            <div className={classes.empty}><M id="matchs.nomatchs" /></div>
          )
        }
      </div>
    </section>
  )
}

export default inject('store')(
  observer(PlaySoon)
)
