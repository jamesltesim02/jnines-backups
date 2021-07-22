import React  from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TabMenu from '../common/tab-menu'

const useStyles = makeStyles(
  {
    tabs: {
      backgroundColor: '#fff',
      borderBottom: '.5px solid #ddd'
    },
    fixed: {
      top: 50
    }
  },
  { name: 'MasterPrograms' }
)

const sports = [
  {
    value: -1,
    labelKey: 'sundires.all'
  },
  {
    value: 10,
    labelKey: 'sundires.s10'
  },
  {
    value: 11,
    labelKey: 'sundires.s11'
  }
]

export default function MasterProgramsTab ({
  value = -1,
  onChange = () => {}
}) {
  const classes = useStyles()
  const [tabFixed, setTabFixed] = React.useState(false)
  const el = React.useRef(null)

  const handleScroll = () => {
    const st = document.documentElement.scrollTop
    setTabFixed(st >= el.current.offsetTop - 50)
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <TabMenu
      id="masterProgramTab"
      ref={el}
      menus={sports}
      value={value}
      onChange={onChange}
      classes={{
        root: classes.tabs,
        fixed: classes.fixed
      }}
      fixed={tabFixed}
    />
  )
}
