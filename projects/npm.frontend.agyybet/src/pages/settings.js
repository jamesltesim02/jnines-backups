import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'

import mergeClass from '../utils/merge-class'

import IconToggle from '../components/icons/icon-toggle'

import M from '../components/common/m'
import NavBar from '../components/common/nav-bar'
import ButtonArea from '../components/common/button-area'

const fiedStyles = makeStyles(
  {
    root: {
      padding: '0 10px',
      display: 'flex',
      backgroundColor: '#fff',
      height: 50,
      alignItems: 'center',
      '& > label': {
        flexGrow: 1,
        fontSize: 14,
        whiteSpace: 'nowrap',
        paddingRight: 10
      }
    },
    topBorder: {
      position: 'relative',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '200%',
        height: 1,
        background: '#a7a7a7',
        left: 0,
        top: 0,
        transformOrigin: 'left top',
        transform: 'scale(.5)',
        zIndex: 1
      }
    }
  },
  { name: 'SettingField' }
)

const Field = ({
  label,
  labelKey,
  children,
  topBorder = false,
  ripplable = true,
  onClick = () => {}
}) => {
  const classes = fiedStyles()
  const fieldComp = (
    <div
      className={
        mergeClass(
          classes.root,
          topBorder ? classes.topBorder : null
        )
      }
      onClick={ripplable ? null : onClick}
    >
      <label>
        {
          labelKey
          ? <M id={labelKey} />
          : label
        }
      </label>
      {children}
    </div>
  )
  return (
    ripplable
    ? <ButtonArea onClick={onClick}>{fieldComp}</ButtonArea>
    : fieldComp
  )
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    groupLabel: {
      fontSize: 12,
      lineHeight: '40px',
      padding: '0 10px',
      color: '#999'
    },
    amount: {
      width: 'calc(100% - 110px)',
      fontSize: 18,
      color: primary.main,
      background: 'transparent',
      border: 0,
      '&::placeholder': {
        fontSize: 14,
        color: '#bbb'
      }
    },
    submitBar: {
      padding: '25px 15px 20px'
    },
    submit: {
      background: primary.main,
      color: '#fff',
      textAlign: 'center',
      lineHeight: '40px',
      borderRadius: 5
    },
    tips: {
      padding: '0 15px',
      fontSize: 13,
      color: '#bbb'
    }
  }),
  { name: 'SettingsPage' }
)

const SettingsPage = ({
  store: {
    app,
    toast
  }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const [oddsAC, setOddsAC] = React.useState(app.oddsAC)
  const [defaultAmount, setDefaultAmount] = React.useState(app.defaultAmount)
  const [listMarketView, setListMarketView] = React.useState(app.listMarketView)

  const handleSave = () => {
    app.setSettings({
      oddsAC,
      defaultAmount,
      listMarketView
    })
    toast.success(
      intl.formatMessage({ id: 'message.saveSuccess' })
    )
    if (app.firstRoute) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  return (
    <>
      <NavBar titleKey="settings.title"  />
      <div className={classes.groupLabel}>
        <M id="settings.oddsChange" />
      </div>
      <Field
        labelKey="settings.acceptBetter"
        onClick={() => {
          if (oddsAC === 2) {
            return
          }
          setOddsAC((oddsAC + 1) % 2)
        }}
      >
        <IconToggle checked={oddsAC > 0} />
      </Field>
      <Field
        labelKey="settings.acceptAll"
        topBorder
        onClick={() => {
          setOddsAC(oddsAC === 2 ? 1 : 2)
        }}
      >
        <IconToggle checked={oddsAC === 2} />
      </Field>
      <div className={classes.groupLabel}>
        <M id="settings.quickSet" />
      </div>
      <Field
        labelKey="settings.defaultAmount"
        ripplable={false}
      >
        <input
          className={classes.amount}
          placeholder={intl.formatMessage({ id: 'settings.amountHolder' })}
          value={defaultAmount || ''}
          onChange={(e) => {
            const amount = String(e.target.value).replace(/\D+/gi, '')
            setDefaultAmount(amount ? Number(amount) : null)
          }}
        />
      </Field>
      <div className={classes.groupLabel}>
        <M id="settings.marketModel" />
      </div>
      <Field
        labelKey="settings.singleModel"
        onClick={() => setListMarketView(1)}
      >
        <Radio
          color="primary"
          checked={listMarketView === 1}
        />
      </Field>
      <Field
        labelKey="settings.threeModel"
        onClick={() => setListMarketView(2)}
        topBorder
      >
        <Radio
          color="primary"
          checked={listMarketView === 2}
        />
      </Field>
      <div className={classes.submitBar}>
        <ButtonArea
          ripple="white"
          className={classes.submit}
          onClick={handleSave}
        >
          <M id="common.save" />
        </ButtonArea>
      </div>
      <p className={classes.tips}>
        <M id="settings.tips" />
      </p>
    </>
  )
}

export default inject('store')(
  observer(SettingsPage)
)
