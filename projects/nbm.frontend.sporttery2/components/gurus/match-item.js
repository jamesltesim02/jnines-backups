import { makeStyles, styled } from '@material-ui/core/styles'

import SmallFont from '../common/small-font'

import SportteryOptionName from '../betslip/betslip-item/sporttery-option-name'

const FontLite = styled(SmallFont)({
  fontWeight: 500
})

const useStyles = makeStyles(
  ({
    palette: { primary }
  }) => ({
    item: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr 90px',
      borderTop: '.5px solid #ddd',
      padding: '10px 0',
      fontSize: 12,
      textAlign: 'center',
      '&:first-child': {
        borderTop: 'none'
      },
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        placeContent: 'center'
      }
    },
    time: {
      background: '#f6f4f4',
      display: 'inline-block',
      padding: '3px 5px',
      borderRadius: 3
    },
    tour: {
      marginTop: 6,
      color: '#666'
    },
    teams: {
      fontSize: 14,
      fontWeight: 500,
      '& > span': {
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },
    team1: {
      textAlign: 'right'
    },
    team2: {
      textAlign: 'left'
    },
    score: {
      color: primary.content
    },
    options: {
      alignItems: 'flex-end !important',
      paddingRight: 10,
      whiteSpace: 'nowrap',
    }
  }),
  { name: 'MatchItem' }
)

export default function MatchItem ({ item, settled }) {
  const classes = useStyles()

  const [hname, aname] = item.macthName.split(' vs ')

  return (
    <li className={classes.item}>
      <div>
        <div className={classes.time}>
          <FontLite size={11}>
            {item.options[0].lotteryId}
          </FontLite>
        </div>
        <div className={classes.tour}>
          <FontLite size={11}>{item.tourName}</FontLite>
        </div>
      </div>
      <div className={classes.teams}>
        <span className={classes.team1}>{hname}</span>
        <span className={classes.score}>
          {item.insHomeScore} - {item.insAwayScore}
        </span>
        <span className={classes.team2}>{aname}</span>
      </div>
      <div className={classes.options}>
        {
          item.options.map(opt => (
            <SportteryOptionName
              key={opt.optionId}
              option={opt}
              vertical
              win={opt.setResult > 0}
              settled={settled}
            />
          ))
        }
      </div>
    </li>
  )
}
