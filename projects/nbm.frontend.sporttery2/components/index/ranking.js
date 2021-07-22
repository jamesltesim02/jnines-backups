import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import Block from '../common/block'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

import IconRank from '../icons/icon-rank'

const useStyles = makeStyles(
  {
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)'
    },
    item: {
      padding: '12px 0',
      textAlign: 'center',
      '& > div': {
        marginTop: 5,
        fontSize: 13,
        fontWeight: 500
      }
    },
    icon: {
      display: 'block',
      height: 32,
      width: 32
    },
  },
  { name: 'Ranking' }
)

const items = [
  // 盈利榜
  'profit',
  // 命中榜
  'hit',
  // 连红榜
  'consecutive',
  // 带红榜
  'led'
]

export default function Ranking () {
  const classes = useStyles()

  return (
    <Block className={classes.list}>
    {
      items.map((key) => (
        <LocaledLink
          key={key}
          href={`/ranking?type=${key}`}
        >
          <ButtonArea className={classes.item}>
            <IconRank type={key} />
            <div>
              <M id={`ranking.${key}`} />
            </div>
          </ButtonArea>
        </LocaledLink>
      ))
    }
    </Block>
  )
}