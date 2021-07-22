import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconArrow from '../icons/icon-arrow'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#a7a7a7',
      color: '#444',
      fontSize: 12,
      lineHeight: '25px',
      padding: '0 10px',
      display: 'grid',
      gridTemplateColumns: '1fr 10px',
      alignItems: 'center'
    }
  },
  { name: 'TourItem' }
)

const TourTitle = ({
  children,
  expanded = false,
  expandable = true,
  onToggle = () => {}
}) => {
  const classes = useStyles()

  return (
    <ButtonArea ripple="white">
      <header
        className={classes.root}
        onClick={() => onToggle(!expanded)}
      >
        <span>{children}</span>
        {
          expandable ? (
            <IconArrow
              size={10}
              color="#444"
              direction={expanded ? 'top' : 'bottom'}
            />
          ) : null
        }
      </header>
    </ButtonArea>
  )
}

export default TourTitle
