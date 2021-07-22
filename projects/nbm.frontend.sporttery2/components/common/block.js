import { makeStyles } from '@material-ui/core/styles'
import LineHolder from '../common/line-holder'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      background: '#fff'
    }
  },
  { name: 'Block' }
)

export default function Block({
  children,
  holder = true,
  className,
  padding = undefined
}) {
  const {root} = useStyles()

  const style = {}
  if (typeof(padding) !== 'undefined') {
    style.padding = padding
  }

  return (
    <>
      <section
        className={mergeClass(root, className)}
        style={style}
      >
        {children}
      </section>
      {holder && <LineHolder />}
    </>
  )
}