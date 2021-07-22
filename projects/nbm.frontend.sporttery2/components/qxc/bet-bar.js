import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../config/config.dev'
import { qxcBaseAmount } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import IconQxcTrash from '../icons/icon-qxc-trash'

import ButtonArea from '../common/button-area'
import Ag8Link from '../common/ag8-link'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      height: 50
    },
    root: {
      position: 'fixed',
      height: 50,
      width: '100%',
      left: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: '50px 1fr 75px',
      paddingRight: 10,
      alignItems: 'center',
      background: '#fff',
      '& > button': {
        textAlign: 'center',
      },
      '&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        width: '200%',
        height: 1,
        background: '#ddd',
        left: 0,
        top: 0,
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      }
    },
    trashButton: {
      height: 50,
      '&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        height: '200%',
        width: 1,
        background: '#ddd',
        right: 0,
        top: 0,
        transformOrigin: 'right top',
        transform: 'scale(.5)'
      }
    },
    submitButton: {
      height: 30,
      color: '#fff',
      borderRadius: 4,
      fontSize: 14,
      backgroundColor: primary.main,
      '&.disabled': {
        filter: 'grayscale(1)'
      }
    },
    values: {
      display: 'flex',
      padding: '0 15px 0 15px',
      fontWeight: 500,
      justifyContent: 'space-between',
      whiteSpace: 'nowrap',
      '& var': {
        marginLeft: 8,
        color: primary.main
      },
      '& label': {
        fontWeight: 400,
        fontSize: 12
      }
    }
  }),
  { name: 'BetBar' }
)

const BetBar = ({
  store: { member },
  count = 0,
  onBet = () => {},
  onClear = () => {}
}) => {
  const classes = useStyles()

  const handleClick = () => {
    if (count > 0) {
      onBet()
    }
  }

  return (
    <footer className={classes.container}>
      <div className={classes.root}>
        <ButtonArea
          className={classes.trashButton}
          onClick={onClear}
        >
          <IconQxcTrash />
        </ButtonArea>
        <div className={classes.values}>
          <span>
            共{count}注
            <var>{count * qxcBaseAmount}元</var>
          </span>
          <span>
            {
              member.isLoged ? (
                <>
                  <label>余额:</label>
                  {member.memberInfo.balance}
                </>
              ) : '未登录'
            }
          </span>
        </div>
        {
          member.isLoged ? (
            <ButtonArea
              className={
                mergeClass(
                  classes.submitButton,
                  count === 0 ? 'disabled' : null
                )
              }
              ripple="white"
              onClick={handleClick}
            >确定</ButtonArea>
          ) : (
            <Ag8Link href={ag8.signin}>
              <ButtonArea
                className={classes.submitButton}
                ripple="white"
              >登录</ButtonArea>
            </Ag8Link>
          )
        }
      </div>
    </footer>
  )
}

export default inject('store')(
  observer(BetBar)
)
