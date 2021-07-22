import React from 'react'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/common-utils'

import Layout from '../components/common/layout'
import { withBaseApi } from '../api/base'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
}))

export default withBaseApi(function Logs ({ api }) {
  const classes = useStyles();
  const [message, setMessage] = React.useState('')

  const saveLog = () => {
    api.log({
      message,
      '@version': '1',
      '@timestamp': dateFormat(new Date(), 'yyyy-MM-ddTHH:mm:ss.msZ'),
      'host': window.location.host,
      'key1': 'value1'
    })
  }

  return (
    <Layout title="发送日志到ELK">
      <form
        className={classes.container}
        autoComplete="off"
      >
        <TextareaAutosize
          margin="dense"
          id="mesage"
          label="MESSAGE"
          placeholder="日志的message"
          autoFocus
          rows={5}
          rowsMax={10}
          variant="outlined"
          value={message}
          className={classes.textField}
          onChange={({ target: { value } }) => setMessage(value)}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={saveLog}
        >提交</Button>
      </form>
    </Layout>
  )
})
