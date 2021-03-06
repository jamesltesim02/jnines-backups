import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import CommonFooter from '../../components/promotions/common-footer'

import ExperienceImage from '../../components/promotions/experience/images/experience.tiny.jpg'
import RequirementsImage from '../../components/promotions/experience/images/requirements-title.png'
import LimitImage from '../../components/promotions/experience/images/btn.bg.tiny.png'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      backgroundColor: '#e48800',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '6vw',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: '100vw',
        height: '125vw',
        backgroundImage: `url(${ExperienceImage})`,
        backgroundPosition: 'center top',
        backgroundSize: 'auto 80vw',
        backgroundRepeat: 'repeat-x',
        zIndex: 0,
      },
      '& > *': {
        position: 'relative',
        zIndex: 1
      },
    },
    nav: {
      zIndex: 5
    },
    holder: {
      height: '68vw'
    },
    limit: {
      position: 'absolute',
      top: '48vw',
      left: '23%',
      transform: 'translateX(-50%)',
      display: 'inline-block',
      width: 164,
      height: 58,
      backgroundImage: `url(${LimitImage})`,
      backgroundSize: '100% 100%',
      color: '#2f7c13',
      textAlign: 'center',
      fontSize: 12,
      lineHeight: '28px',
      fontWeight: 500,
      letterSpacing: 1,
      paddingLeft: 29,
    },
    container: {
      padding: '0 10px',
    },
    requirements: {
      position: 'relative',
      display: 'grid',
      gridGap: 10,
      backgroundColor: '#f4a822',
      padding: '12px 15px',
      borderRadius: 8,
      lineHeight: '40px',
      fontSize: 12,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -23,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: 194,
        height: 24,
        backgroundImage: `url(${RequirementsImage})`,
        backgroundSize: '100% 100%'
      },
      '& > li': {
        backgroundColor: '#2f7c13',
        color: '#fed626',
        borderRadius: 8,
        paddingLeft: 15,
      }
    },
    rules: {
      margin: '10px 0 20px',
      backgroundColor: '#f4a822',
      borderRadius: 8,
      padding: '8px 15px 24px',
      fontWeight: 500,
      '& > header': {
        lineHeight: '40px',
      },
      '& > ol': {
        paddingLeft: 15,
        fontSize: 12,
        letterSpacing: 0,
        lineHeight: '20px',
        '& > li': {
          listStyleType: 'decimal',
        }
      }
    },
    pc: {
      padding: 0,
      fontSize: 16,
      '&::before': {
        top: 40,
        height: 1770,
        backgroundSize: 'auto auto',
        backgroundColor: '#e48800',
      },
      '& > $holder': {
        height: 730
      },
      '& > $limit': {
        top: 485,
        left: '23%',
        width: 327,
        height: 115,
        fontSize: 24,
        lineHeight: '64px',
        paddingLeft: 58
      },
      '& > $container': {
        padding: 0
      },
      '& $requirements': {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: 35,
        padding: 25,
        lineHeight: '80px',
        fontSize: 18,
        whiteSpace: 'nowrap',
        '&::before': {
          width: 388,
          height: 48,
          top: -47
        },
        '& > li': {
          paddingLeft: 0,
          textAlign: 'center'
        }
      },
      '& $rules': {
        marginTop: 40,
        padding: '14px 26px 20px',
        '& > header': {
          fontSize: 24,
          lineHeight: '62px'
        },
        '& > ol': {
          lineHeight: '35px',
          fontSize: 18,

        }
      }
    }
  },
  { name: 'ExperiencePage' }
)

const REQUIREMENT = [
  '1.????????????????????????????????????',
  '2.????????????????????????????????????',
  '3.??????????????? 20 USDT?????????'
]

const ExperiencePage = ({
  store: { app },
  api: { pull }
}) => {
  const classes = useStyles()
  const [limit, setLimit] = React.useState(0)

  const title = '???????????? ????????????20 USDT'

  React.useEffect(
    () => {
      pull.getExpericenceLimit({ actId: 1}).then(
        ({ count }) => setLimit(count)
      )
    },
    []
  )

  return (
    <SubPage
      navProps={{
        title,
        links: [
          { to: '/', textKey: 'common.home' },
          { text: title }
        ]
      }}
      classes={{
        root: mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        ),
        nav: classes.nav,
        breadcrumbs: classes.nav
      }}
    >
      <div className={classes.holder}></div>
      <div className={classes.limit}>
        ????????????: {limit}
      </div>
      <div className={classes.container}>
        <ol className={classes.requirements}>
          {
            REQUIREMENT.map(r => (
              <li key={r}>{r}</li>
            ))
          }
        </ol>
        <div className={classes.rules}>
          <header>????????????</header>
          <ol>
            <li>???????????????2020/9/26 12???00-2020/10/26 12???00???</li>
            <li>???????????????3,000????????????????????????????????????</li>
            <li>?????????9???16???????????????????????????</li>
            <li>?????????????????????????????????????????????</li>
            <li>????????????USDT??????????????????????????????????????????????????????????????????8????????????????????????</li>
            <li>????????????????????????????????????????????????????????????????????????????????????????????????????????? "????????????" ?????????</li>
            <li>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????1.7??????????????????????????????????????????????????????</li>
            <li>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????/?????????????????? ????????? IP ???????????????????????????????????????????????????</li>
            <li>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</li>
            <li>???????????????, ??????????????????????????????????????????????????????</li>
            <li>??????????????????3.0???????????????????????????????????????????????????  </li>
            <li>???????????????????????????????????????????????????</li>
          </ol>
        </div>
      </div>
      <CommonFooter />
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(ExperiencePage)
  )
)
