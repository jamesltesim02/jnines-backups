import { useIntl } from 'react-intl'
import Router from 'next/router'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import SaveButton from '../../components/common/save-button'
import { withLocaledRouter } from '../../components/common/localed-router'

import withApi from '../../api'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#fff'
    },
    text: {
      width: '100%'
    },
    label: {
      transform: 'translate(0, 40px) scale(1)'
    },
    input: {
      height: 48,
      paddingLeft: 10,
      lineHeight: '48px'
    },
    shrink: {
      transform: 'translate(0, 1.5px) scale(.75)',
      transformOrigin: 'top left'
    },
    genderLabel: {
      display: 'inline-block',
      fontSize: 12,
      marginBottom: 15
    },
    gender: {
      paddingLeft: 10
    }
  },
  { name: 'FieldPage' }
)

function FieldPage ({
  localedRouter,
  store: {
    member,
    toast
  },
  api: { member: memberApi }
}) {
  const {
    query: { field }
  } = localedRouter
  const intl = useIntl()
  const classes = useStyles()

  const [value, setValue] = React.useState(member.memberInfo[field])

  const handleSave = async () => {
    try {
      toast.loading()
      await memberApi.updateInfo({ [field]: value })
      member.updateMemberInfo({ [field]: value })
      toast.success(intl.formatMessage({ id: 'profile.updateSuccess' }))
      Router.back()
    } catch(e) {
      toast.error(e.msg || intl.formatMessage({ id: 'common.errorCode.10003' }))
    } finally {
      toast.loading(false)
    }
  }

  return (
    <SubPage
      title={
        field 
        ? (
          `${
            intl.formatMessage({ id: 'profile.edit'})
          }${
            intl.formatMessage({ id: `profile.${field}` })
          }`
        ) : ''
      }
      classes={{ content: classes.root }}
    >
      {
        field === 'sex'
        ? (
          <FormControl>
            <FormLabel
              component="label"
              classes={{
                root: classes.genderLabel
              }}
            >
              <M id="profile.sex" />
            </FormLabel>
            <RadioGroup
              row
              classes={{
                root: classes.gender
              }}
              value={String(value)}
              onChange={({ target: { value } }) => setValue(value)}
            >
              {/* 男 */}
              <FormControlLabel
                value="1"
                control={<Radio color="primary" />}
                label={intl.formatMessage({ id: `profile.sex1` })}
              />
              {/* 女 */}
              <FormControlLabel
                value="0"
                control={<Radio color="primary" />}
                label={intl.formatMessage({ id: `profile.sex0` })}
              />
            </RadioGroup>
          </FormControl>
        ) : (
          <TextField
            label={
              !field
              ? '' 
              : intl.formatMessage({ id: `profile.${field}` })
            }
            className={classes.text}
            InputLabelProps={{
              classes: {
                root: classes.label,
                shrink: classes.shrink
              }
            }}
            InputProps={{
              classes: {
                input: classes.input
              }
            }}
            inputProps={{ maxLength: 6 }}
            onChange={({ target: { value } }) => setValue(value)}
            value={value}
            
          />
        )
      }
      <SaveButton
        onClick={handleSave}
        disabled={member.memberInfo[field] === value || !value}
      />
  </SubPage>
  )
}

export default  withApi('member')(
  inject('store')(
    observer(
      withLocaledRouter(FieldPage)
    )
  )
)
