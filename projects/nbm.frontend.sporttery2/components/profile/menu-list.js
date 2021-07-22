import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { inject } from 'mobx-react'

import { ag8 } from '../../config/config.dev'

import Ag8Link from '../common/ag8-link'

import IconProfiles from '../icons/icon-profiles'

import MenuItem from './menu-item'

const useStyles = makeStyles(
  {
    root: {
      padding: '10px 0'
    },
    messagedot: {
      display: 'block',
      height: 8,
      width: 8,
      backgroundColor: '#f00',
      marginLeft: 7,
      borderRadius: '50%'
    }
  },
  { name: 'MenuList' }
)

function MenuList ({
  info,
  store: {
    toast,
    member
  }
}) {
  const classes = useStyles()
  const intl = useIntl()
  return (
    <div className={classes.root}>
      {/* 积分商城 */}
      <MenuItem
        href="/shop"
        icon={<IconProfiles type="shop" />}
        mainValue={intl.formatMessage({ id: 'profile.shop' })}
        secondaryValue={
          `${
            intl.formatMessage({ id: 'profile.integral'})
          }: ${
            info.integral
          }`
        }
        // onClick={() => {
        //   toast.warning(intl.formatMessage({ id: 'sundires.comingsoon' }))
        // }}
      />

      {/* 投注记录 */}
      <MenuItem
        href="/betslip"
        icon={<IconProfiles type="records" />}
        mainValue={intl.formatMessage({ id: 'profile.records' })}
        borderd
      />
      {/* 交易记录 */}
      <Ag8Link href={ag8.amountRecords}>
        <MenuItem
          icon={<IconProfiles type="amountrecords" />}
          mainValue={intl.formatMessage({ id: 'profile.amountrecords' })}
          borderd
        />
      </Ag8Link>

      {/* 我的发单 */}
      <MenuItem
        href={`/gurus/master?id=${info.userId}`}
        icon={<IconProfiles type="posted" />}
        mainValue={intl.formatMessage({ id: 'profile.posted' })}
        margined
      />
      {/* 我的佣金 */}
      <MenuItem
        icon={<IconProfiles type="commission" />}
        mainValue={intl.formatMessage({ id: 'profile.commission' })}
        secondaryValue={
          `${
            Number(info.commission || 0).toFixed(2)
          }${
            intl.formatMessage({ id: 'sundires.yuan' })
          }`
        }
        borderd
        onClick={() => {
          toast.warning(intl.formatMessage({ id: 'sundires.comingsoon' }))
        }}
      />

      {/* 我的消息 */}
      <MenuItem
        href="/announcement"
        icon={<IconProfiles type="message" />}
        mainValue={intl.formatMessage({ id: 'profile.message' })}
        secondaryValue={
          member.memberInfo.unreadCount > 0
          ? <i className={classes.messagedot} />
          : null
        }
        margined
      />
      {/* 我的勋章 */}
      <MenuItem
        href="/medals"
        icon={<IconProfiles type="medal" />}
        mainValue={intl.formatMessage({ id: 'medal.title' })}
        borderd
      />

      {/* 收货地址 */}
      <MenuItem
        margined
        href="/shop/address"
        icon={<IconProfiles type="address" />}
        mainValue={intl.formatMessage({ id: 'shop.address' })}
      />
    </div>
  )
}

export default inject('store')(MenuList)
