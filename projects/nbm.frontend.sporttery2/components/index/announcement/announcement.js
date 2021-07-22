import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import Block from '../../common/block'
import MoreBar from '../../common/more-bar'

import SpeakerImage from './icons/speaker.png'

const useStyles = makeStyles(
  {
    speakerbtn: {
      marginLeft: -10
    },
    speakerimg: {
      width: 16,
      height: 17
    },
    marquee: {
      flexGrow: 1,
      // borderRight: '10px solid transparent',
      borderLeft: '2px solid transparent',
      borderRight: '2px solid transparent',
      marginLeft: -10,
      '& > span': {
        marginRight: 20
      }
    }
  },
  {
    name: 'Announcement'
  }
)

const Announcement = ({ annos = [] }) => {
  const classes = useStyles()

  return (
    <Block>
      <MoreBar href="/announcement">
        <IconButton
          className={classes.speakerbtn}
        >
          <img
            className={classes.speakerimg}
            src={SpeakerImage}
          />
        </IconButton>
        <marquee className={classes.marquee}>
          {annos.map(({ _id, content }) => (<span key={_id}>{content}</span>))}
        </marquee>
      </MoreBar>
    </Block>
  )
}

export default Announcement