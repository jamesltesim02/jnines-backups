import React from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../../apis';
import Promotion from '../../../apis/Promotion';
import Image from '../../../components/common/Image';
import LoadingBar from '../../../components/common/LoadingBar';
import NavBar from '../../../components/common/NavBar';
import { ResourceDir } from '../../../consts/network';
import M from '../../../components/common/m';

import appStore from '../../../stores/app';
import { Sports } from '../../../consts/match';

type PromoData = {
  activity?: any,
  matchs?: Array<any>,
}

function PromoDuration (
  { time }: { time: number }
) {
  const duration = dayjs.duration(dayjs(time).diff(dayjs()));
  if (duration.asMonths() >= 1) {
    return (<M id="promotion.promo_forever" />);
  }
  return (
    <M
      id="promotion.promo_countdown"
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
        <table>
          <thead>
            <tr>
              <th><M id="common.time" /></th>
              <th><M id="common.match" /></th>
              <th><M id="common.state" /></th>
            </tr>
          </thead>
          <tbody>
          {
            matchGroups[tabIndex].list.map(item => (
              <tr
                key={item.matchId}
                className={
                  item.matchState === 1 ? 'inplay' : undefined
                }
              >
                <td
                  dangerouslySetInnerHTML={{
                    __html: dayjs(+item.matchDate).format('MM/DD<br />HH:mm')
                  }}
                />
                <td>
                  <div>{item.tournamentName}</div>
                  <div>{item.matchName}</div>
                </td>
                <td>
                  {
                    [intl.formatMessage({id: 'period.0'}), intl.formatMessage({id: 'period.999'})]
                    [item.matchState]
                    ||
                    intl.formatMessage({id: 'bet.error_msg.415'})}
                  {
                    [0, 1].includes(item.matchState)
                    ? (
                      <>
                        <br />
                        <Link to={`/detail/${item.matchId}`}><M id="common.details" /></Link>
                      </>
                    ) : null
                  }
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </>
  );
}

function CommonDetail () {
  const { pid }: any = useParams();
  const { promotion }: { promotion: Promotion } = useApi({ promotion: Promotion });
  const [loading, setLoading] = React.useState(true);
  const intl = useIntl()

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
    <>
      <NavBar
        title={
          activity?.title
          ? activity.title[appStore.locale]
          : intl.formatMessage({id: 'common.activity_details'})
        }
      />
      {
        loading ? (
          <div className="scrollable-match-list fullscreen">
            <LoadingBar className="full"/>
          </div>
        ) : (
          <div className="common-promo-detail">
            {/* <header>{activity.title[appStore.locale]}</header> */}
            <Image
              src={activity.imageWap || activity.imageWeb}
              dir={ResourceDir.SLIDE}
              className="promo-banner"
            />
            <div className="promo-duration">
              <PromoDuration time={activity.closeTime} />
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
          </div>
        )
      }
    </>
  );
}

export default CommonDetail;
