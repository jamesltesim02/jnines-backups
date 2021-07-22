import { makeStyles } from '@material-ui/core/styles'

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

export default Tag