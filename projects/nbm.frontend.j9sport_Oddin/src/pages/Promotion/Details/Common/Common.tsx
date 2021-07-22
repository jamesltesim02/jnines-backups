import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../../../apis';
import Promotion from '../../../../apis/Promotion';
import Image from '../../../../components/common/Image';
import LoadingBar from '../../../../components/common/LoadingBar';
import Navs from '../../../../components/common/Navs';
import { ResourceDir } from '../../../../consts/network';
import Duration from 'dayjs/plugin/duration';

import M from '../../../../components/common/m'
import appStore from '../../../../stores/app';
import { Sports } from '../../../../consts/match';
import { Table } from 'antd';
import { useIntl } from 'react-intl';

type PromoData = {
  activity?: any,
  matchs?: Array<any>,
}

dayjs.extend(Duration);

const states = [
  // 未开赛
  'period.0',
  // 进行中
  'period.999',
  // 已结束
  'match.finished'
];

function PromotionDuration (
  { time }: { time: number }
) {
  const duration = dayjs.duration(dayjs(time).diff(dayjs()));
  if (duration.asMonths() >= 1) {
    return (<M id="pages.promo_forever" />);
  }
  return (
    <M
      id="pages.promo_countdown"
      values={{
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      }}
    />
  );
}

function PromoMatchs (
  { matchs }: { matchs?: Array<any> }
) {
  const intl = useIntl();
  const [tabIndex, setTabIndex] = React.useState(0);

  if (!matchs?.length) {
    return null;
  }

  const matchGroups = (
    [Sports.SOCCER, Sports.BASKETBALL].map(sportId => ({
      sportId,
      list: matchs.filter(match => match.sportId === sportId)
    })).filter(
      group => group.list?.length
    )
  )

  return (
    <>
      <div className="item-label">
        <M id={`promotion.matchs`} />:
      </div>
      <div className="promo-matchs">
        {
          matchGroups.length > 1 ? (
            <div className="sports-tab">
              {matchGroups.map((mg, index) => (
                <button
                  key={index}
                  onClick={() => setTabIndex(index)}
                  className={index === tabIndex ? 'active' : undefined}
                >
                  <M id={`sports.${mg.sportId}`} />
                  <M id={`promotion.matchs`} />
                </button>
              ))}
            </div>
          ) : null
        }
        <Table
          dataSource={matchGroups[tabIndex].list}
          rowKey={match => match.matchId}
          rowClassName={
            item => item.matchState === 1 ? 'inplay' : ''
          }
          columns={[
            {
              title:  intl.formatMessage({ id: 'common.time'}),
              key: 'matchDate',
              dataIndex: 'matchDate',
              render: time => dayjs(+time).format('MM/DD HH:mm')
            },
            {
              title: intl.formatMessage({ id: 'match.list_title_tour'}),
              key: 'match',
              render: item => (
                <>
                  <div>{item.tournamentName}</div>
                  <div>{item.matchName}</div>
                </>
              )
            },
            {
              title: intl.formatMessage({ id: 'ticket.status'}),
              key: 'matchState',
              dataIndex: 'matchState',
              render: state => <M id={states[state] || 'match.finished'} />
            },
            {
              title: '',
              key: 'operator',
              render: item => (
                item.matchState <= 1 ? (
                  <Link to={`/detail/${item.matchId}`}>
                    <M id="common.details" />
                  </Link>
                ) : (null)
              )
            }
          ]}
          pagination={false}
        />
      </div>
    </>
  );
}

function Common () {
  const { pid }: any = useParams();
  const { promotion }: { promotion: Promotion } = useApi({ promotion: Promotion });

  const [loading, setLoading] = React.useState(true);
  const [
    {
      activity,
      matchs
    },
    setData
  ] = React.useState<PromoData>({});

  React.useEffect(
    () => {
      const notFound = () => {
        console.log('not found, need back'); 
      };
      if (!pid) {
        notFound();
        return;
      }

      promotion.getDetail({ slideId: pid }).then(result => {
        if (!result) {
          notFound();
          return;
        }
        setData(result);
      }).finally(
        () => setLoading(false)
      );
    },
    [promotion, pid, setLoading, setData]
  );

  return (
    <div className="promo-common">
      <Navs
				list={[
					{
						textKey: 'pages.promo_title',
						path: '/promotions'
					},
					{ textKey: 'promotion.promo_detail' }
				]}
			/>
      <section className="promo-container">
        {
          loading
          ? <LoadingBar />
          : (<>
            <header>{activity.title[appStore.locale]}</header>
            {
              activity.imageWeb ? (
                <Image
                  src={activity.imageWeb}
                  dir={ResourceDir.SLIDE}
                  className="banner"
                />
              ) : null
            }
            <div className="promo-duration">
              <PromotionDuration time={activity.closeTime} />
            </div>
            {
              activity.body ? (
                <>
                  <div className="item-label">
                    <M id="promotion.promo_content" />:
                  </div>
                  <div
                    className="promo-content"
                    dangerouslySetInnerHTML={{
                      __html: (
                        activity.body[appStore.locale]
                        .replace(/ /gm, '&nbsp;')
                        .replace(/\r?\n/gm, '<br />')
                      )
                    }}
                  />
                </>
              ) : null
            }
            <PromoMatchs matchs={matchs} />
          </>)
        }
      </section>
    </div>
  );
}

export default observer(Common);
