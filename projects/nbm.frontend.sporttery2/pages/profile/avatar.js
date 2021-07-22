import Router from 'next/router'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'

import withApi from '../../api'

import ButtonArea from '../../components/common/button-area'
import SubPage from '../../components/common/sub-page'
import SaveButton from '../../components/common/save-button'
import IconAvatar from '../../components/icons/icon-avatar'
import IconSelected from '../../components/icons/icon-selected'

const avatars = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#fff'
    },
    list: {
      padding: 5,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      lineHeight: 0,
      '& > li': {
        height: 110,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    item: {
      position: 'relative',
      borderRadius: '50%',
      height: 80,
      width: 80
    },
    selected: {
      position: 'absolute',
      bottom: 6,
      right: 0,
      opacity: 0,
      transition: 'opacity .2s ease-in .1s'
    },
    available: {
      opacity: 1
    }
  },
  { name: 'AvatarPage' }
)

function AvatarPage ({
  store: {
    member,
    toast
  },
  api: { member: memberApi }
}) {
  const classes = useStyles()
  const intl = useIntl()
  const [header, setHeader] = React.useState(member.memberInfo.header)

  const handleSave = async () => {
    try {
      toast.loading()
      await memberApi.updateInfo({ header })
      member.updateMemberInfo({ header })
      toast.success('更新成功')
      Router.back()
    } catch(e) {
      toast.error(e.msg || intl.formatMessage({ id: 'common.errorCode.10003' }))
    } finally {
      toast.loading(false)
    }
  }

  return (
    <SubPage
      titleKey="profile.edithead"
      classes={{
        content: classes.root
      }}
    >
      <ul className={classes.list}>
      {
        avatars.map(a => (
          <li key={a}>
            <ButtonArea
              className={classes.item}
              onClick={() => setHeader(a)}
            >
              <IconAvatar index={a} />
              <IconSelected
                className={
                  mergeClass(
                    classes.selected,
                    header === a ? classes.available : null
                  )
                }
              />
            </ButtonArea>
          </li>
        ))
      }
      </ul>
      <SaveButton
        onClick={handleSave}
        disabled={member.memberInfo.header === header}
      />
    </SubPage>
  )
}

export default withApi('member')(
  inject('store')(
    observer(
      AvatarPage
    )
  )
)
