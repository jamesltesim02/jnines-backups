import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { inject, observer } from 'mobx-react'
import withApi from '../../api'

import M from '../../components/common/m'
import Block from '../../components/common/block'
import SubPage from '../../components/common/sub-page'
import SmallFont from '../../components/common/small-font'
import MoreButton from '../../components/common/more-button'

import IconMedal from '../../components/icons/icon-medal'

import MasterInfo from '../../components/gurus/master-info'
import MasterPrograms from '../../components/gurus/master-programs'
import MasterProgramsTab from '../../components/gurus/master-programs-tab'

const useStyles = makeStyles(
  {
    main: {
      padding: '10px 10px 12px',
      borderBottom: '.5px solid #f0f0f0'
    },
    achievement: {
      marginTop: 18,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      textAlign: 'center',
      fontSize: 17,
      fontWeight: 500,
      lineHeight: '17px',
      '& > li': {
        padding: '5px 0',
        borderRight: '.5px solid #ddd',
        '&:last-child': {
          borderRight: 0
        }
      },
      '& label': {
        display: 'block',
        fontSize: 12,
        marginTop: 1,
        lineHeight: '12px'
      }
    },
    medal: {
      padding: '11.5px 10px',
      lineHeight: '27px',
      fontSize: 13,
      fontWeight: 500,
      '& > label': {
        marginRight: 15
      },
      '& > i': {
        marginRight: 5
      }
    }
  },
  { name: 'Master' }
)

function MasterPage ({
  store: { toast, member },
  api: { guru },
  query,
  initMaster = {},
  initPrograms = {
    currentCount: 0,
    currentPage: 1,
    list: []
  }
}) {
  const classes = useStyles()
  const intl = useIntl()

  const [programs, setPrograms] = React.useState(initPrograms)
  const [loading, setLoading] = React.useState(false)
  const [sport, setSport] = React.useState(-1)

  const loadMore = async () => {
    try {
      setLoading(true)
      const newData = await guru.getMasterPrograms({
        userId: query.id,
        pageSize: data.currentCount,
        pageIndex: data.currentPage + 1,
        ...(sport === -1 ? {} : { sportId: sport })
      })
      setPrograms({
        ...newData,
        list: [...data.list, newData.list]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSportChange = async (sport) => {
    try {
      toast.loading()
      setPrograms(await guru.getMasterPrograms({
        userId: query.id,
        ...(sport === -1 ? {} : { sportId: sport })
      }))
      setSport(sport)
    } finally {
      toast.loading(false)
    }
  }

  if (!initMaster.medal) {
    initMaster.medal = {}
  }

  const hits = (initMaster.recentHit || '0-0').split('-')
  const achievement = [
    // 七日盈利率
    {
      value: `${initMaster.betReturnRateWeek || '0'}%`,
      label: intl.formatMessage({ id: 'gurus.profitOfWeek' })
    },
    // 7天战绩
    {
      value: intl.formatMessage(
        { id: 'profile.recentHit' },
        {
          v1: Math.min(+hits[0], 10),
          v2: hits[1]
        }
      ),
      label: intl.formatMessage({ id: 'gurus.hitOfWeek' })
    },
    // 累计带红
    {
      value: intl.formatMessage(
        { id: 'gurus.ledCount' },
        { value:  initMaster.totalLongRed || 0 }
      ),
      label: intl.formatMessage({ id: 'gurus.ledOfWeek' })
    }
  ]

  const isSelf = (
    member.isLoged
    &&
    member.memberInfo.userId === query.id
  )

  return (
    <SubPage
      titleKey={isSelf ? 'profile.posted' :'gurus.masterTitle'}
      padding={0}
    >
      <Block>
        <div className={classes.main}>
          <MasterInfo
            focusable
            linkable={false}
            sociality
            info={initMaster}
          />
          <ul className={classes.achievement}>
          {
            achievement.map((a, i) => (
              <li key={i}>
                <div>{a.value}</div>
                <label>
                  <SmallFont size={9}>{a.label}</SmallFont>
                </label>
              </li>
            ))
          }
          </ul>
        </div>
        {
          (
            initMaster.medal.totalRed
            &&
            initMaster.medal.historyHit
            &&
            initMaster.medal.winAmount
          ) ? (
            <section className={classes.medal}>
              <label><M id="gurus.medal" /></label>
              {
                initMaster.medal.totalRed
                ? (
                  <IconMedal
                    type="led"
                    size={40}
                    value={initMaster.medal.totalRed}
                    highest
                  />
                ) : null
              }
              {
                initMaster.medal.historyHit
                ? (
                  <IconMedal
                    type="consecutive"
                    size={50}
                    value={initMaster.medal.historyHit}
                    highest
                  />
                ) : null
              }
              {
                initMaster.medal.winAmount
                ? (
                  <IconMedal
                    type="profit"
                    size={48}
                    value={initMaster.medal.winAmount}
                    highest
                  />
                ) : null
              }
              {
                (
                  initMaster.medal.winAmount
                  &&
                  initMaster.medal.totalRed
                ) ? (
                  <IconMedal
                    type="certificated"
                    size={42}
                    value={[
                      initMaster.medal.winAmount,
                      initMaster.medal.totalRed
                    ]}
                    highest
                  />
                ) : null
              }
            </section>
          ) : null
        }
        
      </Block>
      <MasterProgramsTab
        value={sport}
        onChange={handleSportChange}
      />
      <MasterPrograms items={programs.list} />
      <MoreButton
        data={programs}
        loading={loading}
        onClick={loadMore}
      />
    </SubPage>
  )
}

MasterPage.getInitialProps = async ({
  api: { guru },
  query
}) => {
  const [
    initMaster,
    initPrograms
  ] = await Promise.all([
    guru.getMaster(query.id),
    guru.getMasterPrograms({
      userId: query.id
    })
  ])

  return {
    initMaster,
    initPrograms,
    query
  }
}

export default withApi('guru')(
  inject('store')(
    observer(MasterPage)
  )
)
