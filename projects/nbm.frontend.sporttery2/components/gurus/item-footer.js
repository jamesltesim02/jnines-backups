import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'

import M from '../common/m'
import SmallFont from '../common/small-font'
import IconSportTip from '../icons/icon-sport-tip'

const useStyles = makeStyles(
  {
    footer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      marginTop: 10,
      color: '#999',
      fontSize: 12,
      lineHeight: '13px'
    },
    sportIcon: {
      width: 13,
      height: 13,
      marginRight: 8
    },
    countdown: {
      textAlign: 'right',
      marginRight: -10
    }
  },
  { name: 'ItemFooter' }
)

export default function ItemFooter ({ info }) {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <div>
        <IconSportTip
          type={info.sportId}
          style={{ marginRight: 4 }}
        />
        <SmallFont size={10}>
          <M id={`common.sports.${info.sportId}`} /> | {
            info.bets && info.bets.length > 0
            ? (
              <M
                id="sundires.multis"
                values={{
                  v1: info.bets[0].num,
                  v2: info.bets[0].cnt
                }}
              />
            )
            : null
          }
        </SmallFont>
      </div>
      <div className={classes.countdown}>
        <SmallFont size={10}>
          <M id={`gurus.${info.betState === 3 ? 'createTime' : 'endtime'}`} />:
          <time> {dateFormat(info.betState === 3 ? info.planTime : info.displayTime, 'MM月dd日 HH:mm')}</time>
        </SmallFont>
      </div>
    </div>
  )
}
