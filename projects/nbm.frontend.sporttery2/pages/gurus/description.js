import { makeStyles } from '@material-ui/core/styles'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'

const useStyles = makeStyles(
  {
    content: {
      backgroundColor: '#fff'
    },
    group: {
      padding: '0 5px',
      marginBottom: 13
    },
    header: {
      fontSize: 15,
      fontWeight: 500
    },
    list: {
      marginTop: 10,
      borderTop: '.5px solid #ddd',
      paddingTop: 10,
      fontSize: 13,
      lineHeight: '23px'
    }
  },
  { name: 'GuruDesc' }
)

const DescriptionGroup = ({
  title,
  items,
  classes
}) => {
  return (
    <section className={classes.group}>
      <header className={classes.header}>
        <M id={title} />:
      </header>
      <ul className={classes.list}>
        {
          items.map(item => (
            <li key={item}><M id={item} /></li>
          ))
        }
      </ul>
    </section>
  )
}

const descs = [
  {
    title: 'gurus.explanTitle',
    items: [1, 2, 3, 4, 5, 6, 7].map(v => `gurus.explans.${v}`)
  },
  {
    title: 'gurus.rewardsTitle',
    items: [1, 2, 3].map(v => `gurus.rewards.${v}`)
  }
]

export default function GuruDescriptionPage () {
  const classes = useStyles()

  return (
    <SubPage
      titleKey="gurus.descTitle"
      classes={{ content: classes.content }}
    >
      {
        descs.map((desc, i) => (
          <DescriptionGroup
            key={i}
            {...desc}
            classes={classes}
          />
        ))
      }
    </SubPage>
  )
}
