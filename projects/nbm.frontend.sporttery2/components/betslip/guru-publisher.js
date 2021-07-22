import React from 'react'
import { useIntl } from 'react-intl'
import { inject } from 'mobx-react'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'

import M from '../common/m'
import Slider from '../common/slider'

const guruStyles = makeStyles(
  {
    container: {
      backgroundColor: '#fff',
      padding: '12px 10px 0'
    },
    title: {
      fontSize: 12,
      color: '#666',
      fontWeight: 500
    },
    textarea: {
      width: '100%',
      border: '.5px solid #ddd',
      padding: '8px 10px',
      fontSize: 14,
      fontWeight: 500,
      marginTop: 12
    },
    buttons: {
      textAlign: 'right',
      padding: '13px 0',
      '& > button': {
        fontSize: 13,
        width: 85,
        height: 35,
        padding: 0,
        marginLeft: 10
      }
    }
  },
  { name: 'GuruPublisher' }
)
const GuruPublisher = ({
  api: { guru },
  store: { toast },
  item,
  classes = guruStyles(),
  onClose = () => {},
  onSuccess = () => {},
  intl = useIntl()
}) => {
  const [content, setContent] = React.useState('')

  const handleSubmit = async () => {
    if (!content) {
      return
    }
    try {
      toast.loading()
      await guru.publish({
        ticketId: item.ticketId,
        content
      })
      toast.success(intl.formatMessage({ id: 'betslip.success' }))
      onSuccess()
    } finally {
      toast.loading(false)
    }
  }

  return (
    <Slider
      open={!!item}
      onClose={onClose}
      classes={{
        container: classes.container,
      }}
    >
      <p className={classes.title}><M id="betslip.guruTitle" /></p>
      <TextareaAutosize
        rows={5}
        rowsMax={12}
        className={classes.textarea}
        placeholder={intl.formatMessage({ id: 'betslip.guruHolder' })}
        value={content}
        onChange={({ target: { value } }) => setContent(value.substring(0, Math.min(50, value.length)))}
      />
      <div className={classes.buttons}>
        <Button onClick={onClose}>
          <M id="sundires.cancel" />
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleSubmit}
        ><M id="betslip.publish" /></Button>
      </div>
    </Slider>
  )
}

export default withApi('guru')(
  inject('store')(GuruPublisher)
)
