import React from 'react'
import { inject, observer } from 'mobx-react'
import { isServer } from '../../utils/env-utils'

import withApi from '../../api'

import {
  Profileinfo,
  MenuList,
  MainMenus
} from '../../components/profile'

function ProfilePage ({
  store: { member },
  initMemberInfo
}) {

  React.useEffect(() => {
    if (initMemberInfo) {
      member.updateMemberInfo(initMemberInfo)
    }
  }, [])

  return (
    <>
      <Profileinfo info={member.memberInfo} />
      <MainMenus info={member.memberInfo} />
      <MenuList info={member.memberInfo} />
    </>
  )
}

ProfilePage.getInitialProps = async ({
  api: { member }
}) => {
  if (isServer()) {
    return
  }

  const initMemberInfo = await member.getMemberInfo({ balance: true })
  return {
    initMemberInfo
  }
}

export default withApi('member')(
  inject('store')(
    observer(ProfilePage)
  )
)