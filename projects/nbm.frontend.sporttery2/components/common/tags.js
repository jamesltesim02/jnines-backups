import { makeStyles } from '@material-ui/core/styles'

import M from './m'
import SmallFont from './small-font'

const tagStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      border: '.5px solid #d2d2d2',
      borderRadius: 2,
      marginRight: 4,
      lineHeight: '13px'
    }
  },
  { name: 'RankTag' }
)
const Tag = ({
  children,
  color = 'inherit',
  classes = tagStyles()
}) => (
  <div
    className={classes.root}
    style={{ color }}
  >
    <SmallFont size={8}>{children}</SmallFont>
  </div>
)

const Tags = ({ info }) => (
  <>
    {/* VIP等级 */}
    <Tag color="#fe6601">
      <M
        id="profile.level"
        values={{ value: info.userLevel }}
      />
    </Tag>
    {/* 近几中几 */}
    {
      ((value) => {
        const hits = value.split('-').map(v => +v)
        if (!hits[0]) {
          return null
        }
        return (
          <Tag color="#6482bf">
            <M
              id="profile.recentHit"
              values={{
                v1: hits[0],
                v2: hits[1]
              }}
            />
          </Tag>
        )
      })(info.recentHit || '0-0')
    }
    {/* 月最高连红 */}
    {
      info.monthHit > 0
      ? (
        <Tag color="#d81e06">
          <M
            id="profile.highestHit"
            values={{ value: info.monthHit }}
          />
        </Tag>
      )
      : null
    }
  </>
)

export default Tags