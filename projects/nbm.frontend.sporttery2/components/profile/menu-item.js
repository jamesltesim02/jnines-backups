import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'

import ButtonArea from '../../components/common/button-area'
import LocaledLink from '../../components/common/localed-router'

import IconArrow from '../../components/icons/icon-arrow'

const itemStyles = makeStyles(
  {
    container: {
      padding: '0 15px',
      backgroundColor: '#fff',
    },
    margined: {
      marginTop: 10
    },
    root: {
      minHeight: 50,
      display: 'flex',
      alignItems: 'center'
    },
    borderd: {
      borderTop: '.5px solid #ddd'
    },
    mainValue: {
      display: 'block',
      fontSize: 14,
      fontWeight: 500,
      width: 56
    },
    secondaryValue: {
      flexGrow: 1,
      textAlign: 'right',
      paddingRight: 10,
      fontSize: 13,
      fontWeight: 500,
      color: '#666'
    }
  },
  { name: 'ProfileMenuItem' }
)

const MenuItem = React.forwardRef((
  {
    icon,
    mainValue,
    secondaryValue,
    classes = {},
    margined = false,
    borderd = false,
    ...props
  },
  ref
) => {
  const cs = itemStyles()

  return (
    <ButtonArea
      className={
        mergeClass(
          cs.container,
          margined ? cs.margined : null
        )
      }
      ref={ref}
      {...props}
    >
      <div
        className={
          mergeClass(
            cs.root,
            borderd ? cs.borderd : null,
            classes.root
          )
        }
      >
        {icon ? icon : null}
        {
          mainValue ? (
            <div
              className={
                mergeClass(
                  cs.mainValue,
                  classes.mainValue
                )
              }
            >
              {mainValue}
            </div>
          ) : null
        }
        <div
          className={
            mergeClass(
              cs.secondaryValue,
              classes.secondaryValue
            )
          }
        >{secondaryValue}</div>
        <IconArrow />
      </div>
    </ButtonArea>
  )
})

export default ({
  href,
  as = href,
  ...props
}) => {
  return (
    <>
    {
      href
      ? (
        <LocaledLink href={href} as={as}>
          <MenuItem {...props} />
        </LocaledLink>
      ) : <MenuItem {...props} />
    }
    </>
  )
}
