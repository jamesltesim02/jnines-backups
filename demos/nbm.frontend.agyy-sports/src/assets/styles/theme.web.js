import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#bd2b28',
      main1: '#e5c6a3',
    },
    secondary: {
      main: '#ffe400',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#1d1d1d',
    },
  },
  typography: {
    body2: {
      fontSize: '16px',
      color: '#333',
      minHeight: '100%'
    }
  },
  spacing: 5
})

export default responsiveFontSizes(theme)
