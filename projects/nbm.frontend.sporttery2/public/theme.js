import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#d81e06',
      content: '#d41d15'
    },
    secondary: {
      main: '#bfbfbf',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f0f0f0',
    },
  },
  typography: {
    body2: {
      fontSize: '16px',
      color: '#333'
    }
  }
})

export default responsiveFontSizes(theme)
