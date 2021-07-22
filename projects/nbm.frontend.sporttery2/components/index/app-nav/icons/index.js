import { makeStyles } from '@material-ui/core/styles'
import ServiceImage from './service-ol.png'
import MemberImage from './member-center.png'

const useStyles = makeStyles(theme => ({
  icon: {
    width: 22,
    height: 23
  }
}))

const IconService = () => (
  <img
    className={useStyles().icon}
    src={ServiceImage}
  />
)

const IconMember = () => (
  <img
    className={useStyles().icon}
    src={MemberImage}
  />
)

export {
  IconService,
  IconMember
}
