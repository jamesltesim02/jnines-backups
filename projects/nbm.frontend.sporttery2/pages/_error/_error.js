import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../config/config.dev'

import SubPage from '../../components/common/sub-page'
import M from '../../components/common/m'
import ButtonArea from '../../components/common/button-area'
import Ag8Link from '../../components/common/ag8-link'
import { withLocaledRouter } from '../../components/common/localed-router'

import LogoImage from './images/logo.png'
import NameImage from './images/site-name.png'
import Code404Image from './images/404.png'
import Code403Image from './images/403.png'
import Code500Image from './images/500.png'

const useStyles = makeStyles(
  {
    root: {
      height: '100vh',
      backgroundColor: '#f5f5f5',
      textAlign: 'center',
      padding: '0 20px',
      fontSize: 14,
      lineHeight: '18px',
      '& img': {
        marginTop: 20
      }
    },
    codeContent: {
      marginTop: 20,
      '& > p': {
        textAlign: 'left'
      }
    },
    service: {
      position: 'relative',
      marginTop: 30,
      textAlign: 'left',
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        background: 'linear-gradient(to right, #fff, #fdb023, #fff)',
        width: '100%',
        height: 1,
        top: -15,
        left: 0
      },
      '& > header': {
        marginTop: 10
      },
      '& > ul': {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        marginTop: 5,
        lineHeight: '22px',
        '& div': {
          color: '#ff5d37'
        },
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          background: 'linear-gradient(to bottom, #fff, #ccc, #fff)',
          height: '100%',
          width: 2,
          top: 0,
          left: 'calc(50% - 1px)',
        },
        '& > li:last-child': {
          paddingLeft: 16
        }
      },
      '& > a': {
        display: 'inline-block',
        margin: '15px 0'
      }
    },
    button: {
      backgroundColor: '#ff5d37',
      color: '#fff',
      height: 40,
      textAlign: 'center',
      borderRadius: 5
    }
  },
  { name: 'Error' }
)

const codes = {
  403: Code403Image,
  404: Code404Image,
  500: Code500Image
}

const Error = ({
  statusCode,
  localedRouter
}) => {
  const classes = useStyles()

  const pageContent = (
    <div className={classes.root}>
      <div><img src={LogoImage} /></div>
      <div><img src={NameImage} /></div>
      <div><img src={codes[statusCode]} /></div>
      <section className={classes.codeContent}>
        <header>
          <M id={`errorPage.${statusCode}.header`} />
        </header>
        <p>
          <M id={`errorPage.${statusCode}.content`} />
        </p>
      </section>
      <section className={classes.service}>
        <p>
          <M id={`errorPage.csTip`} />
        </p>
        <header><M id={`errorPage.callCs`} /></header>
        <ul>
          <li>
            <header><M id={`errorPage.hk`} /></header>
            <div>+852-3841-5777</div>
            <div>+852-3008-3777</div>
          </li>
          <li>
            <header><M id={`errorPage.ph`} /></header>
            <div>+63-2-949-8222</div>
          </li>
        </ul>
        <a href="mailto:agcash@ag9.com">
          <M id={`errorPage.email`} />
          agcash@ag9.com
        </a>
      </section>
      <Ag8Link href={ag8.service}>
        <ButtonArea
          ripple="white"
          className={classes.button}
        >
          <M id={`errorPage.800`} />
        </ButtonArea>
      </Ag8Link>
    </div>
  )

  return (
    [404, 500].includes(statusCode) ? (
      <SubPage
        title={statusCode}
        onBack={() => {
          localedRouter.replace('/')
        }}
      >
        {pageContent}
      </SubPage>
    ) : pageContent
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default withLocaledRouter(Error)
