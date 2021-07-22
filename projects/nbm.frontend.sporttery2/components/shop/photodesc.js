import { makeStyles } from '@material-ui/core/styles'

import RemoteImg from '../common/remote-img'

const useStyles = makeStyles(
  {
    root: {
      '& img': {
        width: '100%'
      }
    }
  },
  { name: 'Photodesc' }
)

const Photodesc = ({ photos = [] }) => {
  const classes = useStyles()
  return (
    <section className={classes.root}>
    {
      (photos || []).map(photo => (
        <RemoteImg
          key={photo}
          src={photo}
        />
      ))
    }
    </section>
  )
}

export default Photodesc
