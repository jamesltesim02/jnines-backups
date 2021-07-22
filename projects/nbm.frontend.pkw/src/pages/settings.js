import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'

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
      backgroundColor: '#666',
      height: 50,
      alignItems: 'center',
      '& > label': {
        flexGrow: 1,
        fontSize: 14
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
  labelKey,
  children,
  topBorder = false
}) => {
  const classes = fiedStyles()
  return (
    <div
      className={
        mergeClass(
          classes.root,
          topBorder ? classes.topBorder : null
        )
      }
    >
      <label><M id={labelKey} /></label>
      {children}
    </div>
  )
}

const useStyles = makeStyles(
  ({
      palette: {
        primary,
        secondary
      } 
  }) => ({
    groupLabel: {
      fontSize: 12,
      lineHeight: '40px',
      padding: '0 10px'
    },
    amount: {
      width: 'calc(100% - 110px)',
      fontSize: 18,
      color: secondary.main,
      background: 'transparent',
      border: 0,
      '&::placeholder': {
        fontSize: 14,
        color: '#bbb'
      }
    },
    select: {
      width: 'calc(100% - 110px)',
      color: secondary.main,
      '&::before': {
        borderBottom: 'none !important'
      },
      '&::after': {
        display: 'none'
      }
    },
    selectel: {
      '&:focus': {
        background: 'transparent',
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

  const [oddsAC, setOddsAC] = React.useState(app.oddsAC)
  const [defaultAmount, setDefaultAmount] = React.useState(app.defaultAmount)
  const [locale, setLocale] = React.useState(app.locale)

  return (
    <>
      <NavBar titleKey="setting.setting"  />
      <div className={classes.groupLabel}>
        <M id="setting.oddsChange" />
      </div>
      <Field labelKey="setting.acHigher">
        <IconToggle
          checked={oddsAC > 0}
          onClick={() => {
            if (oddsAC === 2) {
              return
            }
            setOddsAC((oddsAC + 1) % 2)
          }}
        />
      </Field>
      <Field
        labelKey="setting.acAll"
        topBorder
      >
        <IconToggle
          checked={oddsAC === 2}
          onClick={() => {
            setOddsAC(oddsAC === 2 ? 1 : 2)
          }}
        />
      </Field>
      <div className={classes.groupLabel}>
        <M id="setting.quickSet" />
      </div>
      <Field labelKey="setting.defaultAmount">
        <input
          className={classes.amount}
          placeholder={intl.formatMessage({ id: 'setting.amountPlaceholder' })}
          value={defaultAmount || ''}
          onChange={(e) => {
            const amount = String(e.target.value).replace(/\D+/gi, '')
            setDefaultAmount(amount ? Number(amount) : null)
          }}
        />
      </Field>
      <div className={classes.groupLabel}>
        <M id="setting.others" />
      </div>
      <Field labelKey="setting.language">
        <Select
          autoWidth
          displayEmpty
          native
          value={locale}
          className={classes.select}
          classes={{
            select: classes.selectel
          }}
          onChange={({ target: { value } }) => setLocale(value)}
        >
          <option value="zh">{intl.formatMessage({ id: 'language.zh' })}</option>
          <option value="en">{intl.formatMessage({ id: 'language.en' })}</option>
          {/* <option value="vi">{intl.formatMessage({ id: 'language.vi' })}</option> */}
        </Select>
      </Field>
      <div className={classes.submitBar}>
        <ButtonArea
          ripple="white"
          className={classes.submit}
          onClick={() => {
            app.setSettings({
              oddsAC,
              defaultAmount,
              locale
            })
            toast.success(intl.formatMessage({ id: 'message.saveSuccess' }))
          }}
        >
          <M id="common.save" />
        </ButtonArea>
      </div>
      <p className={classes.tips}>
        <M id="setting.settingTips" />
      </p>
    </>
  )
}

export default inject('store')(
  observer(SettingsPage)
)
