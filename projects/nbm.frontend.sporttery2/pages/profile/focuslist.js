import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'

import M from '../../components/common/m'
import Tags from '../../components/common/tags'
import NavBar from '../../components/common/nav-bar'
import { HeaderTab } from '../../components/common/tab-menu'
import BackButton from '../../components/common/back-button'
import ButtonArea from '../../components/common/button-area'
import MoreButton from '../../components/common/more-button'
import LocaledLink, { withLocaledRouter } from '../../components/common/localed-router'

import IconAvatar from '../../components/icons/icon-avatar'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#fff',
      minHeight: '100%'
    },
    toolbar: {
      display: 'flex',
      paddingRight: 48
    },
    tabs: {
      flexGrow: 1
    },
    list: {
      padding: '0 15px',
      '& > button': {
        borderBottom: '.5px solid #ddd',
      }
    },
    item: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 88px',
      height: 80,
      alignItems: 'center',
    },
    name: {
      paddingLeft: 10,
      '& > h3': {
        fontSize: 14,
        fontWeight: 500
      },
      '& > div': {
        marginTop: 4
      }
    },
    plancount: {
      display: 'inline-block',
      color: primary.main,
      padding: 0,
      width: 90,
      height: 25,
      fontSize: 12,
      border: `.5px solid ${primary.main}`,
      lineHeight: '25px',
      textAlign: 'center',
      borderRadius: 200
    }
  }),
  { name: 'FocuslistPage' }
)

function FocuslistPage ({
  initList = [],
  query: { id, type },
  localedRouter
}) {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <NavBar
        customLayout
        classes={{ toolbar: classes.toolbar }}
      >
        <BackButton />
        <HeaderTab
          value={type}
          menus={[
            {
              value: 'focus',
              labelKey: 'profile.myfocus'
            },
            {
              value: 'fans',
              labelKey: 'profile.myfans'
            }
          ]}
          classes={{ root: classes.tabs }}
          onChange={value => {
            localedRouter.replace(`/profile/focuslist?id=${id}&type=${value}`)
          }}
        />
      </NavBar>
      <div className={classes.list}>
      {
        initList.map(item => (
          <LocaledLink
            key={item._id}
            href={`/gurus/master?id=${item.userId}`}
          >
            <ButtonArea>
              <div className={classes.item}>
                <IconAvatar
                  size={50}
                  index={item.header}
                />
                <div className={classes.name}>
                  <h3>{item.nickName}</h3>
                  <div><Tags info={item} /></div>
                </div>
                  <span className={classes.plancount}>
                    <M id="profile.guruCount" />: {item.usablePlan}
                  </span>
              </div>
            </ButtonArea>
          </LocaledLink>
        ))
      }
      </div>
      {!initList.length ? <MoreButton hashmore={false} /> : null}
    </section>
  )
}

FocuslistPage.getInitialProps = async ({
  api: { fans },
  query: {
    id,
    type = 'focus'
  } = {}
}) => {
  const initList = await fans.list(type, id)

  return {
    initList,
    query: { id, type }
  }
}

export default withApi('fans')(
  withLocaledRouter(FocuslistPage)
)