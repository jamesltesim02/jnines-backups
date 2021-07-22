import { inject, observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'
import { dateFormat } from '../../utils/get-locale-date'
import mergeClass from '../../utils/merge-class'

import IconArrow from '../../components/icons/icon-arrow'
import IconFilter from '../../components/icons/icon-filter'
import IconInfo from '../../components/icons/icon-info'

import M from '../../components/common/m'
import ButtonArea from '../../components/common/button-area'
import MoreButton from '../../components/common/more-button'
import LocaledLink from '../../components/common/localed-router'

import LotteryHeader from '../../components/match/lottery-header'
import TourFilter from '../../components/match/tour-filter'
import LotteryItem from '../../components/match/lottery-item'
import ChoosingMarket from '../../components/match/choosing-market'

import Cart from '../../components/cart'

const useStyles = makeStyles(
  {
    groupHeader: {
      marginBottom: 6,
      lineHeight: '26px',
      fontSize: 12,
      color: '#777',
      backgroundColor: '#fff',
      padding: '0 10px',
      '& > i': {
        position: 'absolute',
        top: 9,
        right: 10
      }
    },
    arrow: {
      transform: 'rotate(90deg) translateX(-2px) scale(.9)',
      marginLeft: 5,
    },
    expandArrow: {
      transform: 'rotate(-90deg) translateX(-2px) scale(.9)',
    },
  },
  { name: 'LotteryPage' }
)

const markets = {
  10: [
    1,
    14,
    21,
    47,
    45
  ],
  11: [
    186,
    16,
    18,
    290
  ]
}

const timeCalcRange = 12 * 60 * 60 * 1000

const LotteryPage = ({
  api: { pull },
  store: { matchs },
  query: { sportId }
}) => {
  const classes = useStyles()
  const sportMarketTypes = markets[sportId]

  const [marketType, setMarketType] = React.useState(sportMarketTypes[0])
  const [loading, setLoading] = React.useState(false)
  const [tourOpen, setTourOpen] = React.useState(false)
  const [tourIds, setTourIds] = React.useState([])

  const [counts, setCounts] = React.useState([])
  const [unexpand, setUnexpand] = React.useState([])

  React.useEffect(
    () => {
      setLoading(true)
      Promise.all([
        pull.getMatchList({
          sportType: sportId,
          marketTypes: sportMarketTypes,
          matchState: 0,
          tourIds: tourIds,
          rowStart: 0,
          pageSize: 1000
        }),
        pull.getMatchCount({
          sportType: sportId,
          matchState: 0,
          tourIds: tourIds
        })
      ]).then(([result = {}, counts]) => {
        setCounts(counts)
        matchs.setMarketTypes(sportMarketTypes)
        matchs.setMatchs(result.list || [])
      }).finally(
        () => setLoading(false)
      )

      return () => matchs.setMatchs([])
    },
    [sportId, tourIds]
  )

  let lastDateStr = ''

  return (
    <>
      <LotteryHeader
        sportId={sportId}
        markets={sportMarketTypes}
        market={marketType}
        onChange={setMarketType}
        options={
          <>
            {
              sportId === 10 ? (
                <IconButton
                  color="inherit"
                  onClick={() => setTourOpen(true)}
                >
                  <IconFilter />
                </IconButton>
              ) : null
            }
            <LocaledLink href="/match/description">
              <IconButton
                color="inherit"
              >
                <IconInfo />
              </IconButton>
            </LocaledLink>
          </>
        }
      />
      <TourFilter
        open={tourOpen}
        sportId={sportId}
        onClose={() => setTourOpen(false)}
        tourIds={tourIds}
        onChange={setTourIds}
      />
      <div>
        {
          matchs.list.length ? (
            matchs.list.map(item => {
              const currentTime = new Date(item.matchDate - timeCalcRange)
              const currentDate = dateFormat(currentTime, 'yyyy-MM-dd')
              const ueIndex = unexpand.indexOf(currentDate)

              const comps = (
                <React.Fragment key={item.matchId}>
                  {
                    lastDateStr !== currentDate ? (
                      <ButtonArea
                        className={classes.groupHeader}
                        onClick={() => {
                          if (ueIndex > -1) {
                            unexpand.splice(ueIndex, 1)
                            setUnexpand([...unexpand])
                            return
                          }

                          setUnexpand([...unexpand, currentDate])
                        }}
                      >
                        {currentDate}
                        (<M id={`common.dow.${currentTime.getDay()}`} />)
                        有{
                          (
                            counts.find(({ date }) => date === currentDate)
                            ||
                            { count: 0 }
                          ).count
                        }场比赛
                        <IconArrow
                          className={
                            mergeClass(
                              classes.arrow,
                              ueIndex === -1 ? classes.expandArrow : null
                            )
                          }
                        />
                      </ButtonArea>
                    ) : null
                  }
                  {
                    ueIndex === -1 ? (
                      <LotteryItem
                        match={item}
                        marketType={marketType}
                      />
                    ) : null
                  }
                </React.Fragment>
              )
              lastDateStr = currentDate
              return comps
            })
          ) : null
        }
        <MoreButton
          data={[]}
          loading={loading}
        />
      </div>
      <Cart lottery />
      <ChoosingMarket />
    </>
  )
}

LotteryPage.getInitialProps = ({
  query: { sportId = 10 },
}) => {
  return {
    query: {
      sportId: Number(sportId)
    }
  }
}

export default withApi('pull')(
  inject('store')(
    observer(LotteryPage)
  )
)
