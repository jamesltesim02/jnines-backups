import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import Tags from '../common/tags'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

import IconArrow from '../icons/icon-arrow'
import IconAvatar from '../icons/icon-avatar'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      backgroundColor: primary.main,
      color: '#fff',
    },
    header: {
      padding: '20px 15px',
      display: 'flex',
      alignItems: 'center'
    },
    info: {
      flexGrow: 1,
      paddingLeft: 10,
      '& > h3': {
        fontSize: 15,
        display: 'flex'
      }
    },
    tags: {
      marginLeft: 5,
      '& > div': {
        borderRadius: 0,
        backgroundColor: '#fff',
        border: 0,
        '& > span': {
          lineHeight: '13px'
        }
      }
    },
    tips: {
      marginTop: 3,
      fontSize: 12,
      color: 'rgba(255, 255, 255, .7)'
    },
    edit: {
      fontSize: 14
    },
    descArrow: {
      '&::before': {
        borderColor: '#fff'
      }
    },
    values: {
      marginTop: -9,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    valueItem: {
      padding: '15px 0',
      textAlign: 'center',
      '& > span': {
        display: 'block',
        fontSize: 17,
        lineHeight: '17px',
        fontWeight: 500
      },
      '& > label': {
        display: 'block',
        lineHeight: '12px',
        marginTop: 5,
        fontWeight: 500
      }
    }
  }),
  { name: 'Profileinfo' }
)

function Profileinfo ({ info }) {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <LocaledLink href="/profile/member">
        {/* 头像和昵称 */}
        <ButtonArea ripple="white">
          <header className={classes.header}>
            <IconAvatar
              index={info.header}
              size={60}
            />
            <div className={classes.info}>
              <h3>
                {info.nickName}
                <div className={classes.tags}>
                  <Tags info={info} />
                </div>
              </h3>
              <div className={classes.tips}>
                {info.userId.replace('H88', '')}
              </div>
            </div>
            <span className={classes.edit}>
              <M id="profile.edit" />
              <IconArrow className={classes.descArrow} />
            </span>
          </header>
        </ButtonArea>
      </LocaledLink>
      <div className={classes.values}>
        {/* 余额 */}
        <ButtonArea ripple="white">
          <div className={classes.valueItem}>
            <span>
              {Number(info.balance || 0).toFixed(2)}
              <M id="sundires.yuan" />
            </span>
            <SmallFont tag="label" size={10}>
              <M id="profile.balance" />
            </SmallFont>
          </div>
        </ButtonArea>
        {/* 关注 */}
        <LocaledLink href={`/profile/focuslist?id=${info.userId}`}>
          <ButtonArea ripple="white">
            <div className={classes.valueItem}>
              <span>{info.focusCount}</span>
              <SmallFont tag="label" size={10}>
                <M id="gurus.focus" />
              </SmallFont>
            </div>
          </ButtonArea>
        </LocaledLink>
        {/* 粉丝 */}
        <LocaledLink href={`/profile/focuslist?id=${info.userId}&type=fans`}>
          <ButtonArea ripple="white">
            <div className={classes.valueItem}>
              <span>{info.fansCount}</span>
              <SmallFont tag="label" size={10}>
                <M id="gurus.fan" />
              </SmallFont>
            </div>
          </ButtonArea>
        </LocaledLink>
      </div>
    </section>
  )
}

export default Profileinfo
