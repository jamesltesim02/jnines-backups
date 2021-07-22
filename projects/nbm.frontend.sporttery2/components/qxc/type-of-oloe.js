import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import ButtonArea from '../common/button-area'

import {
  items31,
  oloeItems,
  typeColumnMapping
} from '../../utils/qxc-utils'

const groupStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: '9fr 62fr',
      paddingBottom: 20
    },
    name: {
      color: '#999',
      fontSize: 12,
      '& > label': {
        position: 'relative',
        display: 'block',
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
      },
      '& > span': {
        display: 'block',
        marginTop: 30,
        paddingLeft: 8,
      }
    }
  },
  { name: 'Group' }
)
const Group = ({
  name,
  subName,
  children,
}) => {
  const classes = groupStyles()

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        <label>{name}</label>
        {subName ? <span>{subName}</span> : null}
      </div>
      {children}
    </div>
  )
}

const type31Styles = makeStyles(
  ({ palette: { primary } }) => ({
    items: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 93px)',
      justifyContent: 'space-between',
      textAlign: 'center',
      gridRowGap: 18,
      color: '#666',
      fontSize: 13,
      '& button': {
        lineHeight: '35px',
        textAlign: 'center',
        color: primary.main,
        borderRadius: 100,
        fontSize: 15,
        marginBottom: 16,
        transition: 'all .25s ease-in-out',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          borderRadius: 100,
          border: '1px solid #ddd',
          top: 0,
          left: 0,
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
  }),
  { name: 'Type31' }
)

const Type31 = inject('store')(
  observer(
    ({
      store: {
        qxc: { odds }
      },
      value,
      onChange = () => {}
    }) => {
      const classes = type31Styles()
      if (!value) {
        value = []
      }

      const odds31 = (odds || {})[31] || {}
    
      return (
        <Group
          name="总和"
          subName="赔率"
        >
          <ul className={classes.items}>
          {
            items31.map(item => {
              const active = value.includes(item.value)
              return (
                <li key={item.value}>
                  <ButtonArea
                    className={active ? 'active' : null}
                    onClick={() => {
                      if (!active) {
                        onChange([...value, item.value])
                        return
                      }
                      value.splice(value.indexOf(item.value), 1)
                      onChange([...value])
                    }}
                  >{item.name}</ButtonArea>
                  <label>
                    {(odds31[item.value] || {}).odds}
                  </label>
                </li>
              )
            })
          }
          </ul>
        </Group>
      )
    }
  )
)

const oloeStyles = makeStyles(
  ({ palette: { primary } }) => ({
    items: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 32px)',
      justifyContent: 'space-around',
      margin: '-6px 0 6px',
      '& > button': {
        textAlign: 'center',
        borderRadius: '50%',
        color: primary.main,
        fontSize: 15,
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
  }),
  { name: 'TypeOloe' }
)
const oloeTypes = [
  {
    value: 4,
    name: '千位'
  },
  {
    value: 3,
    name: '百位'
  },
  {
    value: 2,
    name: '十位'
  },
  {
    value: 1,
    name: '个位'
  },
]

const TypeOloe = ({
  type,
  value,
  onChange = () => {}
}) => {
  const classes = oloeStyles()

  if (!value) {
    value = [
      [],
      [],
      [],
      [],
    ]
  }

  return (
    <>
    {
      oloeTypes.map((t, i) => {
        if (!typeColumnMapping[type].includes(i)) {
          return null
        }
        return (
          <Group
            key={t.value}
            name={t.name}
          >
            <div className={classes.items}>
              {
                oloeItems.map(item => {
                  const active = value[i].includes(item.value)
                  return (
                    <ButtonArea
                      key={item.value}
                      className={active ? 'active' : null}
                      onClick={() => {
                        if (!active) {
                          value[i] = [...value[i], item.value]
                          onChange([...value])
                          return
                        }
                        value[i].splice(value[i].indexOf(item.value), 1)
                        onChange([...value])
                      }}
                    >
                      {item.name}
                    </ButtonArea>
                  )
                })
              }
            </div>
          </Group>
        )
      })
    }
    </>
  )
}

const TypeOfOloe = ({
  type,
  value,
  onChange = () => {}
}) => {

  return (
    type === 31 ? (
      <Type31
        type={type}
        value={value}
        onChange={onChange}
      />
    ) : (
      <TypeOloe
        type={type}
        value={value}
        onChange={onChange}
      />
    )
  )
}

export default TypeOfOloe
