import React from 'react'
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
  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')

  const doSignin = async () => {
    if (!/^\w{4,}$/gi.test(username)) {
      toast.warning('Username invalid')
      return
    }
    if (password.length < 6) {
      toast.warning('Password invalid')
      return
    }

    try {
      toast.loading()
      const result = await sign.login(username, password)
      toast.success('Sign successful')
      window.location = `/?token=${result.token}`
    } catch (e) {
      if ([10010, 10086].includes(e.code)) {
        toast.error('Invalid username or password')
      }
    } finally {
      toast.loading(false)
    }
  }

  return (
    <>
      <NavBar title="Sign in" />
      <div className={classes.form}>
        <TextField
          label="Username"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
        />
        <br />
        <FormControl>
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            aria-describedby="standard-weight-helper-text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
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
          >Sign in</Button>
        </div>
        <div className={classes.notNow}>
          <a href="/">Not now</a>
        </div>
        <footer className={classes.tips}>
          <div>Test username is pkk011 ~ pkk020</div>
          <div>Test password is 111111</div>
        </footer>
      </div>
    </>
  )
}

export default inject('store')(
  observer(
    withApi('sign')(SigninPage)
  )
)
