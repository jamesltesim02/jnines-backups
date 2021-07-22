import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import dateFormat from '../../utils/simple-date-format'
import { withApi } from '../../api'

import IconSports from '../../components/icons/icon-sports'
import IconMedia from '../../components/icons/icon-media'

import ButtonArea from '../../components/common/button-area'
import MoreBar from '../../components/common/more-bar'
import NavBar from '../../components/common/nav-bar'
import M from '../../components/common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    item: {
      marginTop: 10,
      '& > section': {
        display: 'grid',
        gridTemplateColumns: '15fr 20fr 10fr',
        background: '#f8f8f8',
        textAlign: 'center',
        fontSize: 12,
        padding: 10,
        alignItems: 'center'
      }
    },
    tour: {
      overflow: 'hidden',
      '& > header': {
        color: '#909090',
        marginBottom: 7,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '& i': {
        filter: 'grayscale(1)',
        marginRight: 5
      },
    },
    names: {
      overflow: 'hidden',
      '& > span': {
        display: 'block',
        fontSize: 14,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    button: {
      color: '#909090',
      whiteSpace: 'nowrap',
      '& > i': {
        boxSizing: 'content-box',
        backgroundColor: '#909090',
        padding: '0px',
        borderTop: '2px solid #909090',
        borderBottom: '2px solid #909090',
        borderLeft: '6px solid #909090',
        borderRight: '5px solid #909090',
        marginRight: 3,
        verticalAlign: 'sub'
      }
    },
    active: {
      '& $button': {
        color: primary.main,
        '& > i': {
          backgroundColor: primary.main,
          borderColor: primary.main
        }
      }
    },
  }),
  { name: 'LivePage' }
)

const LivePage = ({
  store: { matchs },
  api: { pull }
}) => {
  const classes = useStyles()
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(
    () => {
      setLoading(true)
      pull.getLiveAnnounce().then(
        result => matchs.addData({ normal: result })
      ).finally(
        () => setLoading(false)
      )

      return () => matchs.clear()
    },
    []
  )

  return (
    <>
    <NavBar titleKey="matchs.livenotice" />
    {
      matchs.normal.list.map(match => {
        const names = match.matchName.split(' vs ')

        return (
          <ButtonArea
            key={match.matchId}
            className={
              mergeClass(
                classes.item,
                match.matchState === 1 ? classes.active : null
              )
            }
            onClick={() => {
              if (match.matchState === 1) {
                history.push(`/match/${match.matchId}`)
              }
            }}
          >
            <section>
              <div className={classes.tour}>
                <header>
                  <IconSports
                    type={match.sportId}
                    size={13}
                  />
                  {match.tournamentName}
                </header>
                <time>
                  {dateFormat(+match.matchDate, 'MM/dd HH:mm')}
                </time>
              </div>
              <div className={classes.names}>
                <span>{names[0]}</span>
                <span>{names[1]}</span>
              </div>
              <div className={classes.button}>
                <IconMedia type="video" />
                <M id="matchs.video" />
              </div>
            </section>
          </ButtonArea>
        )
      })
    }
    <MoreBar
      nomore={true}
      loading={loading}
    />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(LivePage)
  )
)