import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import Block from '../common/block'
import GrowHolder from '../common/grow-holder'
import MoreButton from '../common/more-button'

import IconArrow from '../icons/icon-arrow'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      padding: '0 10px'
    },
    title: {
      fontSize: 13,
      display: 'flex',
      fontWeight: 500,
      lineHeight: '40px'
    },
    table: {
      width: '100%',
      fontSize: 12,
      borderSpacing: 0,
      lineHeight: '40px',
      textAlign: 'center',
      '& th, & td': {
        fontWeight: 500,
        borderTop: '.5px solid #ddd'
      },
      '& td.win': {
        color: primary.content
      },
    },
    theader: {
      backgroundColor: '#f6f4f4',
      color: '#666'
    },
    moreOrEmpty: {
      fontSize: 13,
      color: '#888',
      textAlign: 'center'
    },
    moreIcon: {
      marginLeft: 8
    }
  }),
  { name: 'FollowList' }
)

export default function FollowList ({
  info,
  items,
  loading = false,
  hasmore = true,
  onNextPage = () => {}
}) {
  const classes = useStyles()

  return (
    <Block padding="0 10px">
      <header className={classes.title}>
        <div><M id="gurus.followLabel" /></div>
        <GrowHolder />
        <div>
          ({info.followCount || '0'}<M id="sundires.people" />, {info.followAmount || '0' }<M id="sundires.yuan" />)
        </div>
      </header>
      <table className={classes.table}>
        <thead>
          <tr className={classes.theader}>
            <th><M id="gurus.follower" /></th>
            <th><M id="gurus.flAmount" /></th>
            <th><M id="gurus.flBonus" /></th>
            <th><M id="gurus.flCommission" /></th>
          </tr>
        </thead>
        <tbody>
        {
          !items.list.length
          ? (
            <tr>
              <td
                colSpan={4}
                className={classes.moreOrEmpty}
              ><M id="gurus.noFollow" /></td>
            </tr>
          ) : null
        }
        {
          items.list.map(item => (
            <tr key={item._id}>
              <td>{item.nickName}</td>
              <td>{item.betAmount}</td>
              <td
                className={
                  info.betState === 3 && item.settlement > 0 
                  ? 'win' : ''
                }
              >{info.betState === 3 ? Number(item.settlement || 0).toFixed(2) : '——'}</td>
              <td>{info.betState === 3 ? Number(item.payCommission || 0).toFixed(2) : '——'}</td>
            </tr>
          ))
        }
        </tbody>
        {
          info.followCount > 10
          ? (
            <tfoot>
              <tr>
                <td colSpan={4}>
                  <MoreButton
                    loadmoreKey="sundires.more"
                    loading={loading}
                    hasmore={hasmore}
                    onClick={onNextPage}
                  />
                  {/* 需要做loading显示 loading */}
                  {/* <a
                    className={classes.moreOrEmpty}
                    onClick={onNextPage}
                  >
                    <M id="sundires.more" />
                    <IconArrow className={classes.moreIcon} />
                  </a> */}
                </td>
              </tr>
            </tfoot>
          ) : null
        }
      </table>
    </Block>
  )
}
