import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#14805e',
      frontend: '#ffe400',
      background: '#404040'
    },
    secondary: {
      main: '#ffe400',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#494949',
    },
  },
  typography: {
    body2: {
      fontSize: '16px',
      color: '#fff'
    }
  },
  spacing: 5
})

export default responsiveFontSizes(theme)
