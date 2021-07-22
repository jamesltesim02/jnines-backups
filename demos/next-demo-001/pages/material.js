import Button from '@material-ui/core/Button'
import ButtonBase from '@material-ui/core/ButtonBase'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../components/common/layout'

const useStyles = makeStyles(
  theme => ({
    button: {
      width: 500,
      color: theme.palette.primary.main
    },
    root: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      color: '#ccf'
    },
    left: {
      // background: '#fcc'
    },
    right: {
      // background: '#ccf'
    }
  }),
  { name: 'MaterialButton' }
)

export default () => {
  const classes = useStyles()

  return (
    <Layout title="Material Demo">
      <Button variant="contained">Default</Button>
      <br />
      <Button variant="contained" color="primary">Primary</Button>
      <br />
      <Button variant="contained" color="secondary">Secondary</Button>
      <br />
      <Button variant="contained" color="secondary" disabled>Disabled</Button>
      <br />
      <Button variant="contained" href="#contained-buttons">Link</Button>
      <br />
      <ButtonBase
        className={classes.button}
      >
        <div className={classes.root}>
          <div className={classes.left}>
            left value
          </div>
          <div className={classes.right}>
            right value
          </div>
        </div>
      </ButtonBase>
    </Layout>
  )
}