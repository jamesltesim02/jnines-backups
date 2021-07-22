import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import IconFlag from '../icons/icon-flag'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      background: '#fff',
      '& > header': {
        lineHeight: '35px',
        padding: '0 10px',
        fontSize: 15
      },
      '& > section': {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        '& > button': {
          overflow: 'hidden'
        }
      }
    },
    item: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 75,
      fontSize: 12,
      '&::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        bottom: 0,
        transform: 'scale(.5)',
        transformOrigin: 'right bottom',
        display: 'inline-block',
        width: '200%',
        height: '200%',
        borderRight: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
      }
    },
    name: {
      marginTop: 8,
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100%',
      '& > label': {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& > var': {
        minWidth: 20,
        textAlign: 'center'
      },
    },
    footer: {
      lineHeight: '40px',
      fontSize: 12,
      textAlign: 'center',
    },
    pc: {
      background: 'transparent',
      marginTop: 30,
      '& > header': {
        paddingLeft: 0,
        lineHeight: '40px',
        fontSize: 12
      },
      '& > section': {
        gridGap: 20
      },
      '& button': {
        background: '#fff',
        borderRadius: 4
      },
      '& $item': {
        height: 120,
        '&::after': {
          display: 'none'
        }
      },
      '& $name': {
        marginTop: 10
      },
      '& $footer': {
        marginTop: 20
      }
    }
  },
  { name: 'Countries' }
)

const Countries = ({
  store: { app },
  sport,
  countries
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [expanded, setExpanded] = React.useState(false)

  if (!countries || !countries.length) {
    return null
  }

  const list = (
    countries.length < 10 || expanded
    ? countries
    : countries.slice(0, 10)
  )

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <header className="block-header">
        <M id="matchs.area" />
      </header>
      <section>
        {
          list.map((c, i) => (
            <ButtonArea
              key={i}
              onClick={() => {
                history.push(`/category/area/${sport}/${c.categoryId}-${c.categoryName}`)
              }}
            >
              <div className={classes.item}>
                <IconFlag
                  type={c.categoryId}
                  size={app.pcMode ? 54 : 35}
                />
                <div className={classes.name}>
                  <label>{c.categoryName}</label>
                  <var>({c.matchCount})</var>
                </div>
              </div>
            </ButtonArea>
          ))
        }
        {
          (
            (countries.length < 10 || expanded)
            &&
            countries.length % 5 > 0
          ) ? (
            new Array(5 - countries.length % 5).fill().map((v, i) => (
              <div key={i} className={classes.item} />
            ))
          ) : null
        }
      </section>
      {
        countries.length > 10 ? (
          <ButtonArea
            className={classes.footer}
            onClick={() => setExpanded(!expanded)}
          >
            <M id={`matchs.${expanded ? 'collapse' : 'showmore'}`} />
          </ButtonArea>
        ) : null
      }
      
    </div>
  )
}

export default inject('store')(
  observer(Countries)
)
