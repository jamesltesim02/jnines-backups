import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '9fr 62fr',
      paddingBottom: 20
    },
    name: {
      '& > label': {
        position: 'relative',
        display: 'block',
        fontSize: 12,
        color: '#999',
        lineHeight: '20px',
        paddingLeft: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'inline-block',
          width: 3,
          height: 10,
          borderRadius: 100,
          background: '#ed5e5e',
        }
      }
    },
    content: {
      '& header': {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '-6px 0',
        '& button': {
          padding: 0,
          height: 32,
          width: 32,
          fontSize: 14,
          color: '#333'
        }
      },
      '& section': {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 32px)',
        justifyContent: 'space-between',
        marginTop: 20,
        gridRowGap: 23,
        '& button': {
          height: 32,
          width: 32,
          color: primary.main,
          textAlign: 'center',
          borderRadius: '50%',
          fontSize: 18,
          fontWeight: '500',
          lineHeight: '32px',
          transition: 'all .25s ease-out',
          '&::before': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(200% - 1px)',
            height: 'calc(200% - 1px)',
            borderRadius: '50%',
            border: '1px solid #ccc',
            transformOrigin: 'left top',
            transform: 'scale(.5)',
            transition: 'all .25s ease-in-out',
          },
          '&.active': {
            color: '#fff',
            background: primary.main,
            '&::before': {
              border: `1px solid ${primary.main}`,
            }
          }
        }
      }
    },
  }),
  { name: 'TypeOfDing' }
)

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const NumberGroup = ({
  title,
  value,
  onChange = () => {}
}) => {
  const classes = useStyles()

  if (!value) {
    value = []
  }

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        <label>{title}</label>
      </div>
      <div className={classes.content}>
        <header>
          <IconButton
            onClick={() => onChange([...numbers])}
          >全</IconButton>
          <IconButton
            onClick={() => onChange([5, 6, 7, 8, 9])}
          >大</IconButton>
          <IconButton
            onClick={() => onChange([0, 1, 2, 3, 4])}
          >小</IconButton>
          <IconButton
            onClick={() => onChange([1, 3, 5, 7, 9])}
          >单</IconButton>
          <IconButton
            onClick={() => onChange([0, 2, 4, 6, 8])}
          >双</IconButton>
          <IconButton onClick={() => onChange([])}>清</IconButton>
        </header>
        <section>
          {numbers.map(n => {
            const active = value.includes(n)
            return (
              <ButtonArea
                key={n}
                className={active ? 'active' : null}
                onClick={() => {
                  if (!active) {
                    onChange([...value, n])
                    return
                  }
                  value.splice(value.indexOf(n), 1)
                  onChange([...value])
                }}
              >{n}</ButtonArea>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default NumberGroup
