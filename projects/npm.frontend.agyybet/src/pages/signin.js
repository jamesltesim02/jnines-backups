import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'

import withApi from '../api'

import NavBar from '../components/common/nav-bar'

const useStyles = makeStyles(
  {
    form: {
      margin: '50px 0',
      padding: '20px 10px',
      background: '#eee',
      '& > div': {
        display: 'flex'
      }
    },
    signinBar: {
      padding: '40px 0 30px',
      '& > button': {
        width: '100%'
      }
    },
    notNow: {
      justifyContent: 'center',
      marginBottom: 30
    },
    tips: {
      paddingBottom: 20,
      color: '#999',
      fontSize: 12
    }
  },
  { name: 'SigninPage' }
)

const SigninPage = ({
  store: { toast },
  api: { sign }
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')

  const doSignin = async () => {
    if (!/^\w{4,}$/gi.test(username)) {
      toast.warning(
        intl.formatMessage({ id: 'others.invalidAccount' })
      )
      return
    }
    if (password.length < 6) {
      toast.warning(
        intl.formatMessage({ id: 'others.invalidPassword' })
      )
      return
    }

    try {
      toast.loading()
      const result = await sign.login(username, password)
      toast.success(intl.formatMessage({ id: 'others.accountNotMatch' }))
      window.location = `/?token=${result.token}`
    } catch (e) {
      if ([10010, 10086].includes(e.code)) {
        toast.error(intl.formatMessage({ id: 'others.signOK' }))
      }
    } finally {
      toast.loading(false)
    }
  }

  return (
    <>
      <NavBar titleKey="others.signTitle" />
      <div className={classes.form}>
        <TextField
          label={intl.formatMessage({ id: 'others.account' })}
          inputProps={{
            autoCapitalize: 'off',
            autoCorrect: 'off',
          }}
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
        />
        <br />
        <FormControl>
          <InputLabel htmlFor="standard-adornment-password">
            {intl.formatMessage({ id: 'others.password' })}
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={e => e.preventDefault()}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <div className={classes.signinBar}>
          <Button
            variant="contained"
            color="primary"
            onClick={doSignin}
          >{intl.formatMessage({ id: 'others.signin' })}</Button>
        </div>
        <div className={classes.notNow}>
          <a href="/">{intl.formatMessage({ id: 'others.later' })}</a>
        </div>
        <footer className={classes.tips}>
          <div>{intl.formatMessage({ id: 'others.testAccounts' })}: ag021 ~ ag030</div>
          <div>{intl.formatMessage({ id: 'others.testPassword' })}: 111111</div>
        </footer>
      </div>
    </>
  )
}

export default withApi('sign')(
  inject('store')(
    observer(SigninPage)
  )
)
