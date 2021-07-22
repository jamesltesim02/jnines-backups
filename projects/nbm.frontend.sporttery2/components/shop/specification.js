import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

// detailPhoto  详情图片列表
// wareSource  商品来源  1为京东   2为淘宝

const useStyles = makeStyles(
  {
    root: {
      fontSize: 12,
      '& table': {
        width: '100%',
        backgroundColor: '#dadada',
        borderSpacing: '1px'
      },
      '& th, & td': {
        textAlign: 'left',
        padding: '8px 10px',
        backgroundColor: '#fff'
      }
    },
    1: {
    },
    2: {}
  },
  { name: 'Specification' }
)

const Specification = ({
  type = 1,
  content
}) => {
  const classes = useStyles()

  return (
    <section
      className={
        mergeClass(
          classes.root,
          classes[type]
        )
      }
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default Specification