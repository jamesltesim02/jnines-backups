import React from 'react';
import { useHistory} from 'react-router-dom';
import DetailHeader from '../../components/MatchDetail/DetailHeader';

import appStore from '../../stores/app';
import matchStore from '../../stores/matchs';
import Pull from '../../apis/Pull';
import { useApi } from '../../apis';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import LoadingBar from '../../components/common/LoadingBar';
import InfoBox from '../../components/MatchDetail/InfoBox';
import DetailMarkets from '../../components/MatchDetail/DetailMarkets';
import RecommendMatchs from '../../components/MatchDetail/RecommendMatchs';
import Redenvelope from "../../components/promotions/redenvelope";
import member from "../../stores/member";
import mergeClass from '../../utils/mergeClass';

import M from '../../components/common/m';
import { observer } from 'mobx-react';

const STORE_RECOMMED_KEY = 'recommend';
const STORE_FAVORITE_KEY = 'favorite';
const STORE_LIVE_KEY = 'live';

/* eslint-disable react-hooks/exhaustive-deps */
function MatchDetail (
  { mid }: {
    mid: string
  }
) {
  const intl = useIntl();
  const history = useHistory();

  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const { detailDeleting } = matchStore;

  const streamHolderRef = React.useRef<HTMLDivElement>(null);
  const [delCount, setDelCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [recommendActive, setRecommendActive] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [streamHolding, setStreamHolding] = React.useState(false);

  const goback = React.useCallback(
    () => {
      if (appStore.firstRoute) {
        history.replace('/');
      } else {
        history.goBack()
      }
    },
    []
  );

  const handleToggleFullscreen = React.useCallback(
    (fullscreen: boolean) => {
      const docEl: any = document;
      const el: any = docEl.body;

      try {
        // 全屏函数
        const fullFn = (
          el.requestFullscreen
          ||
          el.webkitRequestFullscreen
        ).bind(el);
  
        // 退出全屏
        const exitFn = (
          docEl.exitFullscreen
          ||
          docEl.webkitExitFullscreen
        ).bind(docEl);
  
        if (fullscreen) {
          fullFn && fullFn();
        } else {
          exitFn && exitFn();
        }
      } catch (e) {
        console.log(e);
      }
      setFullscreen(fullscreen);
    },
    [setFullscreen]
  );

  const handleStreamHolding = () => {
    setStreamHolding(true);
    streamHolderRef.current?.appendChild(
      document.querySelector('.video-info iframe') as HTMLIFrameElement
    )
  };

  React.useEffect(
    () => {
      const handleFullscreenExit = () => {
        if (!document.fullscreenElement) {
          console.log(' set full screen false');
          setFullscreen(false);
        }
      };
      document.addEventListener('fullscreenchange', handleFullscreenExit);
      document.body.addEventListener('fullscreenchange', handleFullscreenExit);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenExit);
        document.body.removeEventListener('fullscreenchange', handleFullscreenExit);
      };
    },
    [setFullscreen]
  );

  // 查询比赛
  React.useEffect(
    () => {
      if (!mid) {
        goback();
        return;
      }

      let timer: any;
      pull.getMatchDetail(mid).then(
        (result) => {
          // 未查询到比赛则返回
          if (!result || !result.details) {
            Toast.fail(
              intl.formatMessage({ id: 'match.match_not_found' })
            );
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

      return () => {
        matchStore.setDetail(null);
        matchStore.clear(STORE_RECOMMED_KEY, STORE_FAVORITE_KEY);
        clearTimeout(timer);
      };
    },
    [mid]
  );

  const match = matchStore.detail;
  const recommend = matchStore.get(STORE_RECOMMED_KEY);

  React.useEffect(
    () => {
      if (
        !detailDeleting
        ||
        !recommend?.list?.length
        ||
        streamHolding
      ) {
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
    [detailDeleting, streamHolding]
  );

  // 弹窗倒计时结束
  React.useEffect(
    () => {
      if (!detailDeleting) {
        return;
      }
      if (delCount <= 0) {
        history.replace(`/detail/${recommend?.list[0].matchId}`);
      }
    },
    [delCount]
  );


  return (
    <div className={mergeClass({
      'match-detail-page': true,
      fullscreen,
      'stream-holding': streamHolding
    })}>
      <DetailHeader
        match={match}
        onRecommendOpen={() => setRecommendActive(true)}
      />
      {
        loading ? (
          <div className="scrollable-match-list fullscreen">
            <LoadingBar className="full" />
          </div>
        ) : (
          match ? (
            <>
              <InfoBox
                match={match}
                fullscreen={fullscreen}
                onFullscreenChange={handleToggleFullscreen}
              />
              <DetailMarkets
                match={match}
                fullscreen={fullscreen}
              />
            </>
          ) : null
        )
      }
      <RecommendMatchs
        open={recommendActive}
        onClose={() => setRecommendActive(false)}
        matchs={
          [
            {
              title: 'sports.-1',
              matchList: matchStore.get(STORE_FAVORITE_KEY)
            },
            {
              title: 'match.recommend',
              matchList: recommend
            },
            {
              title: 'sports.2',
              matchList: matchStore.get(STORE_LIVE_KEY)
            }
          ].filter(
            item => Boolean(item.matchList?.list.length)
          )
        }
      />
      {
        match && detailDeleting ? (
          <div
            className={mergeClass(
              'deleting-confrim',
              streamHolding ? 'stream-holding' : undefined
            )}
          >
            <dialog>
              <div
                ref={streamHolderRef}
                className="stream-hold-container"
              ></div>
              <section>
                <i>!</i>
                <div>
                  <div>
                    <b>{match.matchName}</b>
                    &nbsp;
                    <M id="match.finished" />
                    <br />
                    <M id="match.backtip" />
                    {recommend?.list?.length ? <M id="match.nexttip" /> : ''}
                  </div>
                  {
                    recommend?.list?.length ? (
                      <p>{recommend.list[0].matchName}</p>
                    ) : null
                  }
                </div>
              </section>
              <footer>
                <button
                  className="btn-cancel"
                  onClick={goback}
                ><M id="match.back" /></button>
                {
                  (
                    Boolean(match.liveUrl)
                    &&
                    !streamHolding
                  ) ? (
                    <button
                      className="btn-keep"
                      onClick={handleStreamHolding}
                    >
                      <M id="match.hold_stream" />
                    </button>
                  ) : null
                }
                <button
                  className="btn-next"
                  onClick={() => setDelCount(0)}
                >
                  {streamHolding ? undefined : `(${delCount})`}
                  <M id="match.next" />
                </button>
              </footer>
            </dialog>
          </div>
        ) : null
      }
      {
        member.isLoged
        &&
        Boolean(match?.actId) ? <Redenvelope/> : null
      }
    </div>
  );
}

export default observer(MatchDetail);
