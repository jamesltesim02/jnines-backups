import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'
import SmallFont from '../common/small-font'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      display: 'flex',
      backgroundColor: '#f6f4f4',
      borderRadius: 3,
      overflow: 'hidden',
      textAlign: 'center',
      '& > li': {
        width: '100%',
        padding: '12px 0'
      }
    },
    value: {
      fontSize: 17
    },
    won: {
      color: primary.main
    },
    label: {
      fontWeight: 500,
      color: '#999'
    }
  }),
  { name: 'GuruStatistics' }
)

export default function GuruStatistics ({
  items,
  classes = {}
}) {
  const intl = useIntl()
  const cs = useStyles()

  const getValue = (value, key) => {
    return (
      value 
      ? value
      : (
        key
        ? intl.formatMessage({ id: key })
        : null
      )
    )
  }

  return (
    <ul className={cs.root}>
      {
        items.map(({
          won = false,
          value,
          valueKey,
          suffix,
          suffixKey,
          label,
          labelKey
        }, i) => (
          <li key={i}>
            <div className={mergeClass(cs.value, classes.value, won ? cs.won : null)}>
              {getValue(value, valueKey)}
              {
                (suffix || suffixKey) && (
                  <SmallFont size={10}>{getValue(suffix, suffixKey)}</SmallFont>
                )
              }
            </div>
            <div className={mergeClass(cs.label, classes.label)}>
              <SmallFont size={10}>{getValue(label, labelKey)}</SmallFont>
            </div>
          </li>
        ))
      }
    </ul>
  )
}
