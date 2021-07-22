import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import { message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { withApi } from '../../apis';
import Pull from '../../apis/Pull';

import appStore from '../../stores/app';
import memberStore from '../../stores/member';
import matchStore from '../../stores/matchs';
import cartStore, { TAB_INDEX } from '../../stores/cart/Cart';

import M from '../../components/common/m';
import LoadingBar from '../../components/common/LoadingBar';
import MatchPanel from '../../components/matchs/MatchPanel';
import DetailRecommend from '../../components/matchs/DetailRecommend';
import DetailContent from '../../components/matchs/DetailContent';
import Navs from '../../components/common/Navs';
import RedEnvelope from '../../components/promotions/RedEnvelope';

const STORE_RECOMMED_KEY = 'recommend';
const STORE_FAVORITE_KEY = 'favorite';
const STORE_LIVE_KEY = 'live';

/* eslint-disable react-hooks/exhaustive-deps */
function MatchDetail (
  {
    api: { pull },
    combo = false,
    inplay = false
  }: {
    api: {
      pull: Pull
    },
    combo?: boolean,
    inplay?: boolean
  }
) {
  const intl = useIntl();
  const history = useHistory();
  const { mid }: any = useParams();
  
  const { isLoged } = memberStore;
  const { detailDeleting } = matchStore;

  const [delCount, setDelCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [tickets, setTickets] = React.useState<Array<any>>([]);

  const goback = useCallback(() => {
    if (appStore.firstRoute) {
      history.replace('/');
    } else {
      history.goBack()
    }
  }, []);

  const recommend = matchStore.list(STORE_RECOMMED_KEY);
  const match = matchStore.detail;

  React.useEffect(
    () => {
      if (!mid) {
        return;
      }
      let timer: any;
      setLoading(true);
      pull.getMatchDetail(mid).then(
        (result) => {
          if (!result || !result.details) {
            message.error(intl.formatMessage({ id: 'match.match_not_found' }));
            // 判断是否为初始页面, 如果是则返回首页
            timer = setTimeout(goback, 3000);
            return;
          }

          const {
            details,
            recommand: recommend,
            favorite,
            live
          } = result;
          matchStore.setDetail(details);
          matchStore.setData({
            [STORE_RECOMMED_KEY]: recommend || [],
            [STORE_FAVORITE_KEY]: favorite || [],
            [STORE_LIVE_KEY]: live || []
          });
        }
      ).finally(
        () => setLoading(false)
      )

      cartStore.cartToggleTo(
        combo
        ? TAB_INDEX.COMBO
        : TAB_INDEX.SINGLE
      );

      return () => {
        cartStore.cartToggleTo(TAB_INDEX.SINGLE);
        matchStore.setDetail(null);
        matchStore.clear(STORE_RECOMMED_KEY, STORE_FAVORITE_KEY);
        clearTimeout(timer);
      };
    },
    [pull, history, mid, combo, setLoading]
  );

  React.useEffect(
    () => {
      if (!isLoged) {
        return;
      }
      pull.getTicketByMatch(mid).then(
        tickets => setTickets(tickets)
      )
    },
    [pull, isLoged, mid, cartStore.ticketCount]
  );

  React.useEffect(
    () => {
      if (!detailDeleting || recommend.length === 0) {
        return;
      }
      let count = 10;
      setDelCount(count);
      const timer = setInterval(
        () => {
          if (count <= 0) {
            clearInterval(timer);
            return;
          }
          count = count - 1;
          setDelCount(count);
        },
        1000
      );

      return () => clearInterval(timer);
    },
    [detailDeleting]
  );

  React.useEffect(
    () => {
      if (!detailDeleting) {
        return;
      }
      if (delCount <= 0) {
        // history.replace(`/detail/${recommend[0].matchId}`);
      }
    },
    [delCount]
  );

  if (loading) {
    return (<LoadingBar />);
  }

  if (!match) {
    return null;
  }

  const navs = [
    (
      combo ? (
        {
          textKey: 'sports.1',
          path: '/home/1'
        }
      ) : undefined
    ),
    (
      inplay ? (
        {
          textKey: 'sports.2',
          path: '/home/2'
        }
      ) : undefined
    ),
    {
      textKey: `sports.${match.sportId}` ,
      path: `/home/${match.sportId}`
    },
    {
      text: match.tournamentName,
      path: `/tours/${match.sportId}/${JSON.stringify({ name: match.tournamentName, tourIds: [match.tournamentId] })}`
    },
    {
      text: match.matchName
    }
  ];

  return (
    <>
      <div className="match-detail">
        <Navs list={navs} />
        <MatchPanel showLive={false}>
          <DetailRecommend
            recommend={matchStore.list(STORE_RECOMMED_KEY)}
            favorites={matchStore.list(STORE_FAVORITE_KEY)}
            live={matchStore.list(STORE_LIVE_KEY)}
          />
          {
            matchStore.detail ? (
              <DetailContent
                match={matchStore.detail}
                tickets={tickets}
                combo={combo}
              />
            ) : null
          }
        </MatchPanel>
      </div>
      {
        detailDeleting ? (
          <div className="deleting-confrim">
            <dialog>
              <section>
                <ExclamationCircleOutlined />
                <div>
                  <div>
                    <b>{match.matchName}</b>
                    &nbsp;&nbsp;
                    <M id="match.finished" />
                    <br />
                    <M id="match.backtip" />
                    {recommend.length > 0 ? <M id="match.nexttip" /> : ''}
                  </div>
                  {
                    recommend.length > 0 ? (
                      <p>{recommend[0].matchName}</p>
                    ) : null
                  }
                </div>
              </section>
              <footer>
                <button
                  className="btn-cancel"
                  onClick={goback}
                ><M id="match.back" /></button>
                {/* {
                  Boolean(match.liveUrl) ? (
                    <button
                      className="btn-keep"
                    >我要继续看直播</button>
                  ) : null
                } */}
                <button
                  className="btn-next"
                  onClick={() => setDelCount(0)}
                >({delCount})<M id="match.next" /></button>
              </footer>
            </dialog>
          </div>
        ) : null
      }
      {
        (
          memberStore.isLoged
          &&
          Boolean(match.actId)
        ) ? (
          <RedEnvelope
            matchId={match.matchId}
            actId={match.actId}
          />
        ) : null
      }
    </>
  );
}

export default withApi({ pull: Pull })(
  observer(MatchDetail)
);
