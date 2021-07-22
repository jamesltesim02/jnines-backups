import { makeStyles } from '@material-ui/core/styles'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'

const itemStyles = makeStyles(
  {
    root: {
      fontSize: 13
    },
    title: {
      fontWeight: 500,
      fontSize: 15,
      lineHeight: '35px',
      borderBottom: '.5px solid #ddd'
    },
    content: {
      padding: '10px 0',
      lineHeight: '22px',
      letterSpacing: '-.3px',
      '& > li > ul': {
        padding: '5px 0 5px 25px'
      }
    }
  },
  { name: 'DescItem' }
)
const DescItem = ({
  item,
  classes = itemStyles()
}) => {
  return (
    <section className={classes.root}>
      <header className={classes.title}>
        <M id={item.title} />:
      </header>
      <ul className={classes.content}>
      {
        item.contents.map((content, i) => {
          if (typeof content === 'string') {
            return (<li key={i}><M id={content} /></li>)
          }

          return (
            <li key={i}>
              <M id={content.key} />
              <ul>
              {
                content.children.map((sub, j) => (
                  <li key={j}><M id={sub} /></li>
                ))
              }
              </ul>
            </li>
          )
        })
      }
      </ul>
    </section>
  )
}


const descs = [
  {
    title: 'ranking.profit',
    contents: [
      'ranking.profitDesc.1',
      'ranking.profitDesc.2',
      'ranking.profitDesc.3',
      'ranking.profitDesc.4',
      'ranking.profitDesc.5'
    ]
  },
  {
    title: 'ranking.hit',
    contents: [
      'ranking.hitDesc.1',
      {
        key: 'ranking.hitDesc.2',
        children: [
          `ranking.hitDesc.2.1`,
          `ranking.hitDesc.2.2`,
          `ranking.hitDesc.2.3`,
          `ranking.hitDesc.2.4`,
          `ranking.hitDesc.2.5`,
          `ranking.hitDesc.2.6`,
          `ranking.hitDesc.2.7`,
          `ranking.hitDesc.2.8`,
          `ranking.hitDesc.2.9`,
        ]
      },
      'ranking.hitDesc.3',
      'ranking.hitDesc.4',
      'ranking.hitDesc.5',
      'ranking.hitDesc.6'
    ]
  },
  {
    title: 'ranking.consecutive',
    contents: [
      'ranking.consecutiveDesc.1',
      'ranking.consecutiveDesc.2',
      'ranking.consecutiveDesc.3',
      'ranking.consecutiveDesc.4',
      'ranking.consecutiveDesc.5'
    ]
  },
  {
    title: 'ranking.led',
    contents: [
      'ranking.ledDesc.1',
      'ranking.ledDesc.2'
    ]
  },
  {
    title: 'ranking.remark',
    contents: [
      'ranking.remarkDesc.1',
      'ranking.remarkDesc.2',
      'ranking.remarkDesc.3'
    ]
  }
]

const useStyles = makeStyles(
  {
    content: {
      padding: '0 10px',
      background: '#fff'
    }
  },
  { name: 'RankDescription' }
)

export default function RankingDescriptionPage ({
  classes = useStyles()
}) {
  return (
    <SubPage
      titleKey="ranking.descTitle"
      classes={classes}
    >
    {
      descs.map((item, i) => <DescItem key={i} item={item} />)
    }
    </SubPage>
  )
}
