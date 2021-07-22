import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import mergeClass from '../../../utils/merge-class'
import dateFormat from '../../../utils/simple-date-format'
import toSignin from '../../../utils/to-signin'

import withApi from '../../../api'
import SubPage from '../../../components/common/sub-page'

import LoadingBlock from '../../../components/common/loading-block'

import BgImage from './bg.jpg'

const blockStyle = makeStyles(
  {
    root: {
      position: 'relative',
      width: '95%',
      margin: '0 auto 2.666666666666667vw',
      padding: '15px 14px 12px',
      borderRadius: 9,
      background: '#f4a722',
      boxShadow: '0px 3px 0 0 #ef8127',
      fontFamily: 'MicrosoftYaHei',
      fontSize: 12,
      '& > *': {
        position: 'relative',
        zIndex: 1,
      },
      '& > header': {
        fontSize: 14,
        color: '#e22d42',
        marginBottom: 10,
        '& > button': {
          marginRight: 15,
          fontSize: 14,
          transition: 'all .3s ease-out',
          '&.active': {
            color: '#e22d42',
          }
        }
      },
      '&::before': {
        position: 'absolute',
        top: 5,
        left: 5,
        zIndex: 0,
        content: '""',
        width: 'calc(100% - 10px)',
        height: 'calc(100% - 10px)',
        borderRadius: 9,
        backgroundColor: '#fffbdd',
      }
    },
    loading: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%'
    }
  },
  { name: 'GradientBlock' }
);

function GradientBlock ({
  children,
  title,
  className,
  loading = false
}) {
  const classes = blockStyle()
  return (
    <div
      className={mergeClass(
        classes.root,
        className
      )}
    >
      {
        title
        ? <header>{title}</header>
        : null
      }
      {children}
      <LoadingBlock
        loading={loading}
        className={classes.loading}
      />
    </div>
  );
}

const useStyle = makeStyles(
  {
    root: {},
    container: {
      minHeight: 'calc(100vh - 90px)',
      width: '100%',
      backgroundColor: '#f9c10d',
      backgroundImage: `url(${BgImage})`,
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
      paddingBottom: 1
    },
    slogan: {
      textAlign: 'center',
      color: '#fff',
      fontSize: '8vw',
      lineHeight: '8vw',
      height: '86vw',
      letterSpacing: 3.6,
      paddingTop: '13vw',
      textShadow: '0px 5px 0 #9f0800',
      '& div:first-child': {
        fontSize: '8.8vw',
        lineHeight: '8.8vw',
        marginBottom: '3.5vw',
      }
    },
    counts: {
      textAlign: 'center',
      marginBottom: '8vw',
      '& > ul': {
        position: 'relative',
        display: 'inline-grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: '6vw',
        alignItems: 'center',
        fontSize: '3.6vw',
        lineHeight: '3.6vw',
        height: '12vw',
        width: '60vw',
        color: '#fff',
        backgroundColor: '#cb241b',
        '& label, span': {
          display: 'block'
        },
        '& label': {
          marginTop: '.6vw',
          fontSize: '3.2vw',
          lineHeight: '3.2vw',
          color: '#ff8d8d'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          display: 'block',
          width: 1,
          height: 18,
          background: '#fff',
          transform: 'translate(-50%, -50%)',
        }
      }
    },
    table: {
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
      }
    },
    matchs: {
      '& tr td:nth-child(1), & tr td:nth-child(3)': {
        whiteSpace: 'nowrap',
      }
    },
    records: {
      '& .MuiTableBody-root .MuiTableCell-root:nth-child(2), & .MuiTableHead-root .MuiTableCell-root:nth-child(2)': {
        whiteSpace: 'nowrap',
        padding: '5px 10px',
        textAlign: 'center',
      },
      '& tr td:nth-child(3)': {
        whiteSpace: 'nowrap',
      }
    },
    description: {
      fontSize: 13,
      fontWeight: 500,
      '& label': {
        color: '#e22d42',
        marginRight: 8
      },
      '& > section': {
        padding: '5px 0 10px',
        '& > div': {
          marginTop: 10
        }
      },
      '& li': {
        listStylePosition: 'inside',
        listStyleType: 'decimal',
        marginBottom: 5
      }
    },
    empty: {
      height: 150,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    needLogin: {
      height: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& label': {
        fontSize: 14,
        color: '#333',
        fontWeight: 500
      },
      '& button': {
        marginTop: 20,
        background: 'linear-gradient(0deg,#b81c16,#d5281e)',
        padding: '0 25px',
        height: 30,
        borderRadius: 15,
        color: '#fff'
      }
    },
    inplay: {
      '& .MuiTableCell-body, & .MuiTableCell-body a': {
        color: '#e83326'
      }
    }
  },
  { name: 'RedEnvelope'}
)

const tabs = [
  {
    name: '足球赛程',
    value: 10
  },
  {
    name: '篮球赛程',
    value: 11
  }
];

function RedEnvelopeDetail ({
  api: { promo },
  store: { member }
}) {
  const classes = useStyle()
  const title = '九游体育红包雨, 见者有份'

  const [currTab, setCurrTab] = React.useState(10);
  const [matchLoading, setMatchLoading] = React.useState(false);
  const [matchs, setMatchs] = React.useState([]);
  const [statistics, setStatistics] = React.useState({
    totalCount: 0,
    totalAmount: 0
  });

  const [recordsLoading, setRecordsLoading] = React.useState(false);
  const [records, setRecords] = React.useState({
    count: 0,
    list: [],
  });
  const [recordsIndex, setRecordsIndex] = React.useState(1);

  React.useEffect(
    () => {
      setMatchLoading(true);
      promo.getRedEnvelopeMatchs().then(
        (result = {}) => {
          setMatchs(result.list || []);
          setStatistics(
            result.statistics || {
              totalCount: 0,
              totalAmount: 0
            }
          )
        }
      ).finally(
        () => setMatchLoading(false)
      );
    },
    [promo, setMatchs, setStatistics, setMatchLoading]
  );

  React.useEffect(
    () => {
      if (!member.isLoged) {
        return
      }
      setRecordsLoading(true);
      promo.getMyRedEnvelopes({
        pageIndex: recordsIndex
      }).then(
        (result) => {
          setRecords(records => ({
            list: result.list,
            count: result.count || records.count
          }));
        }
      ).finally(
        () => setRecordsLoading(false)
      );
    },
    [promo, setRecords, setRecordsLoading, recordsIndex]
  );

  const filteredMatchs = matchs.filter(m => m.sportId === currTab);

  return (
    <SubPage
      navProps={{
        title,
        links: [
          { to: '/', textKey: 'common.home' },
          { text: title }
        ]
      }}
      classes={{
        root: classes.root,
        nav: classes.nav,
        breadcrumbs: classes.nav
      }}
    >
      <div className={classes.container}>
        <section className={classes.slogan}>
          <div>九游体育红包雨</div>
          <div>见者有份</div>
        </section>
        <div className={classes.counts}>
          <ul>
            <li>
              <span>{statistics.totalCount}</span>
              <label>已送出红包数</label>
            </li>
            <li>
              <span>{statistics.totalAmount}</span>
              <label>已送出红包金额</label>
            </li>
          </ul>
        </div>
        <GradientBlock
          title={
            <>
              {
                tabs.map(tab => (
                  <button
                    key={tab.value}
                    className={tab.value === currTab ? 'active' : undefined}
                    onClick={() => setCurrTab(tab.value)}
                  >{tab.name}</button>
                ))
              }
            </>
          }
          loading={matchLoading}
        >
          {
            filteredMatchs.length ? (
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
                  filteredMatchs.map(item => (
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
                        {item.matchState === 1 ? '进行中' : '未开始'}
                        <br />
                        <Link to={`/match/${item.matchId}`}>
                          {item.matchState === 1 ? '立即参与' : '查看详情' }
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            ) : (
              <div className={classes.empty}>
                {
                  matchLoading
                  ? null 
                  : <>暂无数据</>
                }
              </div>
            )
          }
        </GradientBlock>
        <GradientBlock
          title="我的红包记录"
          loading={recordsLoading}
        >
          {
            member.isLoged ? (
              records.list.length ? (
                <Table className={`${classes.table} ${classes.records}`}>
                  <TableHead>
                    <TableRow>
                      <TableCell>赛事</TableCell>
                      <TableCell>奖金</TableCell>
                      <TableCell>时间</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {
                    records.list.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>{item.tournamentName}</div>
                          <div>{item.matchName}</div>
                        </TableCell>
                        <TableCell>
                          {item.amount}
                        </TableCell>
                        <TableCell
                          dangerouslySetInnerHTML={{
                            __html: dateFormat(+item.createTime, 'yyyy-MM-dd<br />HH:mm:ss')
                          }}
                        />
                      </TableRow>
                    ))
                  }
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={3}
                        count={records.count}
                        rowsPerPage={20}
                        page={recordsIndex - 1}
                        rowsPerPageOptions={[]}
                        onChangePage={(e, pageIndex) => setRecordsIndex(pageIndex + 1)}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <div className={classes.empty}>
                  {
                    recordsLoading
                    ? null 
                    : <>暂无数据</>
                  }
                </div>
              )
            ) : (
              <section className={classes.needLogin}>
                <label>当前未登录，无法查看记录</label>
                <button onClick={toSignin}>马上登录</button>
              </section>
            )
          }
        </GradientBlock>
        <GradientBlock className={classes.description}>
          <section>
            <label>活动时间:</label>
            <span>2020年12月1日 - 2021年8月1日</span>
          </section>
        <section>
          <label>活动内容:</label>
          <div>足球红包雨：在指定赛事中，一旦出现进球，九游体育比赛详情页面便会飘落价值1000USDT的红包雨。</div>
          <div>NBA湖人红包雨： 湖人本赛季常规赛和季后赛， 第四节第10分钟之前(倒计时剩余3分钟以前)，一旦湖人得分达到99且领先立刻飘落1000USDT红包雨。</div>
          <div>两者有概率出现额外加奖666USDT大红包。</div>
        </section>
        <section>
          <label>活动规则:</label>
          <ol>
            <li>此活动需在比赛内页进行，红包飘屏时间内不在本场内页视为放弃，红包最低派发金额为1USDT，小于1USDT者需要继续参与活动累计1USDT以上才会派发。</li>
            <li>获得的红包奖金需在九游体育1倍有效投注流水方能提款。</li>
            <li>在九游体育有过真钱投注记录（即使用非优惠彩金投注记录）才可提取完成流水的彩金以及彩金投注所产生的盈利。</li>
            <li>若会员身份、电子邮箱地址、电话号码、支付方式（借记卡、银行账户号码）、或IP地址有相似的资料将视为不符合条件。</li>
            <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此次活动将视为违规。违规者将会被取消资格并不需事先做任何通知。</li>
            <li>抢到的红包奖金将在比赛结束后4小时内到账。</li>
            <li>请勿滥用此优惠，对于违规者，九游体育有权取消其相关红利及其盈利。</li>
            <li>此活动条款最终解释权归九游体育所有。</li>
          </ol>
        </section>
        </GradientBlock>
      </div>
    </SubPage>
  );
}

export default withApi('promo')(
  inject('store')(
    observer(RedEnvelopeDetail)
  )
)
