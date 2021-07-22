import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { toSignin } from '../../components/common/ag8-link'

import mergeClass from '../../utils/merge-class'
import checkFollow from '../../utils/check-follow'
import checkFocus from '../../utils/check-focus'

import M from '../common/m'
import ButtonArea from '../common/button-area'
import Tags from '../common/tags'
import LocaledLink from '../common/localed-router'
import SmallFont from '../common/small-font'

import IconRank from '../icons/icon-rank'
import IconAvatar from '../icons/icon-avatar'
import withApi from '../../api'

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    info: {
      display: 'grid',
      gridTemplateColumns: '45px 1fr',
      alignItems: 'center'
    },
    name: {
      color: '#333',
      fontSize: 13,
      height: 15,
      display: 'flex',
      alignItems: 'flex-end',
      '& > span': {
        lineHeight: '15px',
        marginRight: 5
      },
      '& > img': {
        marginRight: 5
      }
    },
    content: {
      padding: '0 10px'
    },
    remark: {
      marginLeft: -3
    },
    desc: {
      marginTop: 5,
      fontSize: 12,
      lineHeight: '14px',
      color: '#777',
    },
    sociality: {
      color: '#333',
      fontWeight: 500,
      '& span': {
        marginRight: 10
      }
    },
    button: {
      fontSize: 13,
      padding: 0,
      height: 25,
      minWidth: 60
    },
    focusButton: {
      width: 75,
      minWidth: 75
    }
  },
  { name: 'MasterInfo' }
)

const LinkWrapper = ({ children, href }) => (
  href
  ? <LocaledLink href={href}>{children}</LocaledLink>
  : children
)

function MasterInfo ({
  focusable = false,
  followable = false,
  linkable = true,
  sociality = false,
  info: initInfo,
  store: {
    member,
    toast
  },
  api: { fans }
}) {
  const classes = useStyles()
  const [info, setInfo] = React.useState(initInfo)
  const [memberInfo, setMemberInfo] = React.useState(
    member.isLoged
    ? {
      userId: member.memberInfo.userId,
      focus: member.memberInfo.focus.filter(v => v),
      focusCount: member.memberInfo.focusCount
    }
    : null
  )
  const canFollow = checkFollow(info, memberInfo) && followable
  const focusState = checkFocus(info.userId, memberInfo)

  const handleFocus = async () => {
    if (!member.isLoged) {
      toSignin()
      return
    }

    try {
      toast.loading(true)
      const params = {
        userId: member.memberInfo.userId,
        focusUserId: info.userId
      }
      let newmember
      if (focusState.focused) {
        await fans.unfocus(params)
        newmember = {
          userId: memberInfo.userId,
          focus: memberInfo.focus.filter(v => v !== info.userId),
          focusCount: Math.max(0, memberInfo.focusCount - 1)
        }
      } else {
        await fans.focus(params)
        newmember = {
          userId: memberInfo.userId,
          focus: [...memberInfo.focus, info.userId],
          focusCount: memberInfo.focusCount + 1
        }
      }
      setInfo({
        ...info,
        fansCount: Math.max(0, info.fansCount + ( focusState.focused ? -1 : 1))
      })
      setMemberInfo(newmember)
      member.updateMemberInfo(newmember)
    } finally {
      toast.loading(false)
    }
  }

  return (
    <header
      className={
        mergeClass(
          classes.root,
          focusable && canFollow ? classes.full : null
        )
      }
    >
      <LinkWrapper href={linkable ? `/gurus/master?id=${info.userId}` : null}>
        <ButtonArea>
          <div className={classes.info}>
            <IconAvatar
              size={45}
              index={info.header}
            />
            <section className={classes.content}>
              <h4 className={classes.name}>
                <span>{info.nickName}</span>
                {
                  sociality
                  ? <Tags info={info} />
                  : (
                    <>
                      <IconRank
                        type="profit"
                        size={13}
                      />
                      <IconRank
                        type="hit"
                        size={13}
                      />
                    </>
                  )
                }
              </h4>
              {
                sociality
                ? (
                  <div className={mergeClass(classes.sociality, classes.desc)}>
                    {/* 关注数 */}
                    <span><M id="gurus.focus" />: {info.focusCount}</span>
                    {/* 粉丝数 */}
                    <span><M id="gurus.fan" />: {info.fansCount}</span>
                  </div>
                )
                : (
                  <div className={classes.desc}>
                    <SmallFont
                      size={10}
                      className={classes.remark}
                    ><M id="profile.masterName" /></SmallFont>
                    <Tags info={info} />
                  </div>
                )
              }
            </section>
          </div>
        </ButtonArea>
      </LinkWrapper>
      {
        (
          focusable
          && focusState.visible
        ) ? (
          <Button
            variant="outlined"
            color="inherit"
            className={mergeClass(classes.button, classes.focusButton)}
            onClick={handleFocus}
          >
            <M id={`gurus.${focusState.focused ? 'unfocus' : 'focus'}`} />
          </Button>
        ) : null
      }
      {
        canFollow ? (
          <LocaledLink href={`/gurus/detail?id=${info.ticketId}`}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
            >
              <M id="gurus.follow" />
            </Button>
          </LocaledLink>
        ) : null
      }
    </header>
  )
}

export default withApi('fans')(
  inject('store')(
    observer(
      MasterInfo)
  )
)
