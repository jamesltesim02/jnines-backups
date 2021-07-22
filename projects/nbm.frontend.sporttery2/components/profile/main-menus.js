import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../config/config.dev'

import M from '../common/m'
import ButtonArea from '../common/button-area'
import Ag8Link from '../common/ag8-link'

import IconProfileMain from '../icons/icon-profile-main'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      background: '#fff',
      fontSize: 14
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90px',
      '& > div': {
        marginTop: 8,
        fontWeight: 500
      }
    }
  },
  { name: 'MainMenus' }
)

const menus = [
  // 充值
  {
    value: 'saving',
    url: ag8.saving
  },
  // 提现
  {
    value: 'withdrawal',
    url: ag8.withdrawal
  },
  // 设置
  {
    value: 'setting',
    url: ag8.setting
  },
  // 任务
  {
    value: 'task',
    url: ag8.task
  }
]

function MainMenus () {
  const classes = useStyles()

  return (
    <section className={classes.root}>
    {
      menus.map(m => (
        <Ag8Link
          key={m.value}
          href={m.url}
        >
          <ButtonArea>
            <div className={classes.item}>
              <IconProfileMain
                type={m.value}
              />
              <div><M id={`profile.${m.value}`} /></div>
            </div>
          </ButtonArea>
        </Ag8Link>
      ))
    }
    </section>
  )
}

export default MainMenus