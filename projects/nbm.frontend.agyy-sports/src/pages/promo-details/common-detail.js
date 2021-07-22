import React from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import withApi from '../../api';
import M from '../../components/common/m';
import SubPage from '../../components/common/sub-page';
import { getSlideUrl } from '../../utils/resource-url';
import dateFormat from '../../utils/simple-date-format'
import LoadingBlock from '../../components/common/loading-block';

const useStyles = makeStyles(
  {
    root: {
      color: '#999',
      padding: '0 10px 30px',
      fontSize: 12
    },
    banner: {
      width: '100%'
    },
    duration: {
      width: 200,
      border: '1px solid #e2b473',
      color: '#e2b473',
      textAlign: 'center',
      lineHeight: '28px',
      borderRadius: '15px',
      margin: '10px auto'
    },
    itemLabel: {
      fontWeight: 600,
      fontSize: 14,
      margin: '10px 0',
    },
    promoContent: {
      lineHeight: '20px'
    },
    tab: {
      margin: '10px 0',
      '& button': {
        fontWeight: 500,
        transition: 'all .3s ease-out',
        color: '#999',
        '&:first-child': {
          marginRight: 20
        },
        '&.active': {
          color: '#e5c6a3'
        }
      }
    },
    table: {
      color: '#999',
      backfaceVisibility: 'unset',
      '& .MuiTableHead-root .MuiTableCell-root': {
        fontSize: 12,
        padding: 0
      },
      '& .MuiTableBody-root .MuiTableCell-root': {
        padding: '5px 0',
        fontSize: 12,
        borderBottom: '1px solid #e3e1d1'
      },
      '& .MuiTableFooter-root .MuiTableCell-root': {
        borderBottom: 0,
        fontSize: '12px !important',
        '& .MuiTypography-body2': {
          fontSize: '12px !important'
        }
      },
      '& .MuiTableCell-body, & .MuiTableCell-head': {
        color: '#999'
      }
    },
    matchs: {
      '& tr td:nth-child(1), & tr td:nth-child(3)': {
        whiteSpace: 'nowrap',
      }
    },
    inplay: {
      '& .MuiTableCell-body, & .MuiTableCell-body a': {
        color: '#e83326'
      }
    },
    loading: {
      height: 'calc(100vh - 90px)'
    }
  },
  { name: 'CommonPromo' }
)

const timeText = [
  '天',
  '时',
  '分',
  '秒'
];

const getTimeText = time => {
  const mcs = time - Date.now()
  if (mcs <= 0) {
    return -1;
  }

  const fields = [
    // days,
    parseInt(mcs / 86400000),
    // hours,
    parseInt((mcs % 86400000) / 3600000),
    // minutes,
    parseInt((mcs % 3600000) / 60000),
    // seconds
    parseInt((mcs % 60000) / 1000)
  ]

  while(true) {
    if(fields[0]) {
      break
    }
    fields.shift()
    timeText.shift()
  }

  return fields.map((f, i) => `${f}${timeText[i]}`)
}

function PromotionDuration ({ time }) {
  const [text, setText] = React.useState(getTimeText(time))

  React.useEffect(
    () => {
      if (text === -1) {
        return;
      }
      const interval = setInterval(
        () => {
          const tt = getTimeText(time)
          setText(tt)
          if (tt === -1) {
            clearInterval(interval)
          }
        },
        1000
      )

      return () => clearInterval(interval)
    },
    []
  )

  return (
    <>
    {
      text === -1
      ? '活动已结束'
      : text
    }
    </>
  );
}

function PromoMatchs ({ matchs }) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);

  if (!matchs || !matchs.length) {
    return null;
  }

  const matchGroups = (
    [10, 11].map(sportId => ({
      sportId,
      list: matchs.filter(match => match.sportId === sportId)
    })).filter(
      group => group.list.length
    )
  )

  return (
    <>
      <div className={classes.itemLabel}>赛程:</div>
      <div>
        {
          matchGroups.length > 1 ? (
            <div className={classes.tab}>
              {matchGroups.map((mg, index) => (
                <button
                  key={index}
                  onClick={() => setTabIndex(index)}
                  className={index === tabIndex ? 'active' : undefined}
                >
                  <M id={`sports.${mg.sportId}`} />赛程
                </button>
              ))}
            </div>
          ) : null
        }
        <Table className={`${classes.table} ${classes.matchs}`}>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>赛事</TableCell>
              <TableCell>状态</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            matchGroups[tabIndex].list.map(item => (
              <TableRow
                key={item.matchId}
                className={
                  item.matchState === 1 ? classes.inplay : null
                }
              >
                <TableCell
                  dangerouslySetInnerHTML={{
                    __html: dateFormat(+item.matchDate, 'MM-dd<br/>HH:mm')
                  }}
                />
                <TableCell>
                  <div>{item.tournamentName}</div>
                  <div>{item.matchName}</div>
                </TableCell>
                <TableCell>
                  {['未开赛', '进行中', '已结束'][item.matchState]}
                  <br />
                  <Link to={`/match/${item.matchId}`}>查看详情</Link>
                </TableCell>
              </TableRow>
            ))
          }
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const CommonDetail = ({
  api: { promo },
  store: { app }
}) => {
  const classes = useStyles();
  const { pid } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [
    { activity, matchs },
    setData
  ] = React.useState({
    activity: {},
    matchs: []
  });

  React.useEffect(
    () => {
      const notFound = () => {
        console.log('not found, need back');
      };
      if (!pid) {
        notFound();
        return;
      }

      promo.getDetail({ slideId: pid }).then(result => {
        if (!result) {
          notFound();
          return;
        }
        setData(result);
      }).finally(
        () => setLoading(false)
      );
    },
    [promo, pid, setLoading, setData]
  );

  return (
    <SubPage
      navProps={{
        title: (
          activity && activity.title
          ? activity.title[app.locale]
          : '优惠详情'
        ),
        links: [
          { to: '/', textKey: 'common.home' },
          { text: '优惠详情' }
        ]
      }}
      className={classes.root}
    >
      {
        loading ? (
          <LoadingBlock
            loading={loading}
            className={classes.loading}
          />
        ) : (
          <>
            {
              activity.imageWap ? (
                <img
                  alt=""
                  src={getSlideUrl(activity.imageWap)}
                  className={classes.banner}
                />
              ) : null
            }
            <div className={classes.duration}>
              结束时间: <PromotionDuration time={activity.closeTime} />
            </div>
          </>
        )
      }
      {
        activity.body ? (
          <>
            <div className={classes.itemLabel}>
              活动内容
            </div>
            <div
              className={classes.promoContent}
              dangerouslySetInnerHTML={{
                __html: (
                  activity.body[app.locale]
                    .replace(/ /gm, '&nbsp;')
                    .replace(/\r?\n/gm, '<br />')
                )
              }}
            />
          </>
        ) : null
      }
      <PromoMatchs matchs={matchs} />
    </SubPage>
  );
}

export default withApi('promo')(
  inject('store')(
    observer(CommonDetail)
  )
)
