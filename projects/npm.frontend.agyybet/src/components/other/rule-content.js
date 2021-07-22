import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import RulesLocale from '../../assets/locales/rules'

const childrenStyles = makeStyles(
  {
    children: {
      '& div': {
        display: 'inline-block',
      },
      '& table': {
        width: '100%',
        textAlign: 'center',
        borderCollapse: 'collapse',
        lineHeight: '20px',
        '& > tr:first-child td': {
          fontWeight: 600
        },
        '& td': {
          border: '1px solid #fff'
        }
      }
    },
    1: {
      '& > li': {
        marginTop: 26,
        listStyle: 'circle inside',
        fontSize: 20,
        fontWeight: 600,
      }
    },
    2: {
      '& > li': {
        marginTop: 20,
        listStyle: 'square inside',
        fontSize: 17,
        fontWeight: 600,
      },
    },
    3: {
      paddingLeft: 10,
      '& > li': {
        marginTop: 14,
        listStyle: 'decimal inside',
        fontSize: 16,
        fontWeight: 400,
      },
    },
    4: {
      paddingLeft: 10,
      '& > li': {
        marginTop: 10,
        listStyle: 'lower-alpha inside',
        fontSize: 15,
        fontWeight: 400,
      },
    },
    5: {
      paddingLeft: 10,
      '& > li': {
        marginTop: 6,
        listStyle: 'none',
        fontSize: 13,
        fontWeight: 400,
      },
    },
    6: {
      '& > li': {
        marginTop: 4,
        fontSize: 12
      }
    }
  },
  { name: 'RuleChildren' }
)

const Child = ({
  item,
  level
}) => {
  if (typeof item === 'string') {
    return item
  }

  if (Array.isArray(item)) {
    return (
      <table>
        <tbody>
          {item.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      {item.content}
      <Children
        children={item.children}
        level={level + 1}
      />
    </>
  )
}

const Children = ({
  children = [],
  level = 1
}) => {
  const classes = childrenStyles()

  if (!children || !children.length) {
    return null
  }

  return (
    <ol className={`${classes.children} ${classes[level] || ''}`}>
      {
        children.map((child, i) => (
          <li key={i}>
            <Child
              item={child}
              level={level}
            />
          </li>
        ))
      }
    </ol>
  )
}

const useStyles = makeStyles(
  {
    content: {
      padding: 10,
      fontSize: 12,
      '& > p': {
        fontSize: 13,
        fontWeight: 500
      }
    }
  },
  { name: 'RulesPage' }
)

const RuleContent = ({
  store: { app }
}) => {
  const classes = useStyles()
  
  const rules = RulesLocale[app.locale]

  return (
    <section className={classes.content}>
      <p>{rules.content}</p>
      <Children
        children={rules.children}
        level={1}
      />
    </section>
  )
}

export default inject('store')(
  observer(RuleContent)
)
