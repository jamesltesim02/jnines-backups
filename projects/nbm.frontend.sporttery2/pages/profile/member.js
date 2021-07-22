import { useIntl } from 'react-intl'
import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import SubPage from '../../components/common/sub-page'

import MenuItem from '../../components/profile/menu-item'
import IconAvatar from '../../components/icons/icon-avatar'

const useStyles = makeStyles(
  {
    avatarItem: {
      padding: '10px 0'
    }
  },
  { name: 'Member' }
)

function MemberPage ({
  store: {
    member: { memberInfo }
  }
}) {
  const classes = useStyles()
  const intl = useIntl()

  return (
    <SubPage
      titleKey="profile.memberTitle"
      padding={0}
    >
      <MenuItem
        href="/profile/avatar"
        mainValue={intl.formatMessage({ id: 'profile.head' })}
        secondaryValue={
          <IconAvatar
            index={memberInfo.header}
            size={50}
          />
        }
        classes={{
          root: classes.avatarItem
        }}
        margined
      />

      <MenuItem
        mainValue={intl.formatMessage({ id: 'profile.nickName' })}
        href="/profile/field?field=nickName"
        secondaryValue={memberInfo.nickName}
        margined
      />
      <MenuItem
        mainValue={intl.formatMessage({ id: 'profile.sex' })}
        href="/profile/field?field=sex"
        secondaryValue={
          intl.formatMessage({ id: `profile.sex${memberInfo.sex}` })
        }
        borderd
      />
    </SubPage>
  )
}

export default inject('store')(MemberPage)
