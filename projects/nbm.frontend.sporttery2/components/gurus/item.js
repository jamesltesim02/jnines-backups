import { makeStyles } from '@material-ui/core/styles'
import {
  MasterInfo,
  GuruStatistics,
  ItemFooter
} from './'
import mergeClass from '../../utils/merge-class'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

const useStyles = makeStyles(
  {
    item: {
      padding: 10,
      borderRadius: 3,
      border: '.5px solid #dcdcdc',
      '& > a': {
        display: 'block'
      }
    },
    desc: {
      fontSize: 13,
      lineHeight: '13px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '10px 0',
      fontWeight: 500
    },
    slabel: {
      marginTop: -5
    }
  },
  { name: 'GuruItem' }
)

export default function GuruItem ({
  item,
  focusable = false,
  followable = false,
  className
}) {
  const classes = useStyles()

  return (
    <div className={mergeClass(classes.item, className)}>
      <MasterInfo
        focusable={focusable}
        followable={followable}
        info={item}
      />
      <LocaledLink href={`/gurus/detail?id=${item.ticketId}`}>
        <ButtonArea>
          <p className={classes.desc}>{item.planContent}</p>
          <GuruStatistics
            classes={{ label: classes.slabel }}
            items={[
              // 方案金额
              {
                value: item.betAmount,
                suffixKey: 'sundires.yuan',
                labelKey: 'gurus.programAmount'
              },
              // 单倍基数
              {
                value: 2,
                suffixKey: 'sundires.yuan',
                labelKey: 'gurus.radix'
              },
              // 跟单人数
              {
                value: item.followCount || '0',
                suffixKey: 'sundires.people',
                labelKey: 'gurus.followCount'
              },
              // 跟单金额
              {
                value: item.followAmount || '0',
                suffixKey: 'sundires.yuan',
                labelKey: 'gurus.followAmount'
              },
            ]}
          />
        </ButtonArea>
      </LocaledLink>
      <ItemFooter info={item} />
    </div>
  )
}
