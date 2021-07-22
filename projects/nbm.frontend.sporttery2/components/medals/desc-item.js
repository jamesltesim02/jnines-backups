import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'

import IconMedal from '../icons/icon-medal'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr',
      padding: '22px 5px'
    },
    icon: {
      textAlign: 'center'
    },
    content: {
      padding: '10px 0',
      fontSize: 12,
      color: '#666',
      '& h5': {
        fontSize: 15,
        fontWeight: 500,
        color: '#333',
        marginBottom: 10
      },
      '& > li': {
        marginBottom: 25
      },
      '& div': {
        marginBottom: 10,
        display: 'grid',
        gridTemplateColumns: '62px 1fr'
      }
    }
  },
  { name: 'MedalDescItem' }
)

function MedalDescItem ({
  type,
  value
}) {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <div className={classes.icon}>
        <IconMedal
          type={type}
          size={65}
          value={value}
          highest
        />
      </div>
      <ul className={classes.content}>
        <li>
          <h5>
            <M id={`medal.${type}`} />
            <M id="medal.sname" />
          </h5>
          <p><M id="medal.remark" /></p>
        </li>
        <li>
          <h5><M id="medal.condition" /></h5>
          <div>
            <label><M id="medal.rangeLabel" />：</label>
            <span><M id="medal.range" /></span>
          </div>
          <div>
            <label><M id={`medal.${type}`} />：</label>
            <span><M id={`medal.${type}Condition`} /></span>
          </div>
          <div>
            <label><M id="medal.timeLabel" /></label>
            <span><M id="medal.updateTime" /></span>
          </div>
        </li>
      </ul>
    </section>
  )
}

export default MedalDescItem
