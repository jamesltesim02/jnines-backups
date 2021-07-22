import React from 'react'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import dateFormat from '../../utils/simple-date-format'

import Ad01Image from '../../assets/images/ad01.jpg'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      display: 'grid',
      gridTemplateColumns: '203fr 162fr',
      gridGap: 5,
      height: '30.666666666666664vw',
      maxHeight: 300,
      fontSize: 12,
      color: '#fff',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      '& > div': {
        height: '30.666666666666664vw',
        maxHeight: 300,
      },
      '& img': {
        width: '100%',
        height: '100%'
      }
    },
    matchs: {
      background: '#fff',
      display: 'grid',
      gridTemplateRows: '30px 1fr',
      alignItems: 'center',
      padding: '0 10px 10px',
      overflow: 'hidden',
    },
    mheader: {
      letterSpacing: -.5,
      fontWeight: 500,
      overflow: 'hidden',
      color: '#000',
      height: 30,
      '& > label': {
        fontSize: 15,
      },
    },
    mlist: {
      height: 'calc(30.666666666666664vw - 40px)',
      maxHeight: 260,
      borderRadius: 3,
      background: '#be2b28',
      overflow: 'hidden',
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
      height: '50%',
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
  },
  { name: 'PlaySoon' }
)

const PlaySoon = ({ list }) => {
  const classes = useStyles()
  const history = useHistory()

  const [matchs, setMatchs] = React.useState([])
  const [animating, setAnimating] = React.useState(false)
  const handleClick = mid => {
    if (animating) {
      return
    }

    history.push(`/match/${mid}`)
  }

  React.useEffect(
    () => {
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

  return (
    <section className={classes.root}>
      <div>
        <img
          src={Ad01Image}
          alt=""
        />
      </div>
      <div className={classes.matchs}>
        <ButtonArea
          className={classes.mheader}
          onClick={() => history.push('/playing-soon')}
        >
          <label><M id="matchs.playsoon" /></label>
        </ButtonArea>
        <section className={classes.mlist}>
          <div className={animating ? classes.animating : null}>
            {
              matchs && matchs.length ? (
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
              ) : (
                <div className={classes.empty}><M id="matchs.nomatchs" /></div>
              )
            }
          </div>
        </section>
      </div>
    </section>
  )
}

export default observer(PlaySoon)
