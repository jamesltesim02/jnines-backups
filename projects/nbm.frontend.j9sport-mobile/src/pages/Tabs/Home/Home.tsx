import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import BlockTitle from '../../../components/common/BlockTitle';
import AnnouBar from '../../../components/home/AnnouBar';
import Banner from '../../../components/home/Banner';
import SportNav from '../../../components/home/SportNav';
import Tours from '../../../components/home/Tours';
import MatchList from '../../../components/match/MatchList';
import { ExtraMenu, Sports } from '../../../consts/match';
import AppHeader from '../../../components/common/AppHeader';
import matchStore from '../../../stores/matchs';
import IconNav from '../../../components/icons/IconNav';

import M from '../../../components/common/m';
import { useIntl } from "react-intl";
import LoadingBar from '../../../components/common/LoadingBar';
import GamesSlide from '../../../components/home/GamesSlide';
import EuropeQuickBet from "../../Activity/EuropeCup/Components/EuropeQuickBet";

const HOME_LIVE_MATCHS = 'home-live-match-list';
/** 首页需要显示的体育类型列表 */
const HOME_SPORTS = [Sports.SOCCER, Sports.BASEBALL];

function Home () {
  const history = useHistory();
  const intl = useIntl()
  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const [
    {
      notices,
      banners,
      tours,
      loading
    },
    setHomeData
  ] = React.useState<{
    notices: Array<any>,
    banners: Array<any>,
    tours: Array<any>,
    loading: boolean
  }>({
    notices: [],
    banners: [],
    tours: [],
    loading: false
  });

  const [matchLoading, setMatchLoading] = React.useState(false);

  useEffect(() => {
    const carouselEls = document.getElementsByClassName("am-carousel")
  },[])

  React.useEffect(
    () => {
      setMatchLoading(true);
      pull.getHomeMatchs(HOME_SPORTS).then(
        ({ focus, live }: any) => {
          // 焦点比赛分拣
          if (focus && focus.length) {
            HOME_SPORTS.forEach(
              sid => matchStore.setData({
                [`${sid}-focus`]: focus.filter((match: any) => match.sportId === sid)
              })
            );
          }
          // 滚球分拣
          if (live && live.length) {
            matchStore.setData({ [HOME_LIVE_MATCHS]: live })
          }
        }
      ).finally(
        () => setMatchLoading(false)
      );

      setHomeData(data => ({ ...data, loading: true }));
      pull.getNoticeAndBanners().then(
        ({ notices, banners, hotleagues }: any) => setHomeData({
          notices,
          banners,
          tours: hotleagues,
          loading: false
        })
      ).finally(
        () => setHomeData(data => ({ ...data, loading: false }))
      );

      // 清空store
      return () => matchStore.clear(
        ...HOME_SPORTS.map(sid => `${sid}-focus`),
        HOME_LIVE_MATCHS
      );
    },
    [pull]
  );

  const liveMatchs = matchStore.get(HOME_LIVE_MATCHS);

  const inplayCount = matchStore.getCount(ExtraMenu.INPLAY)

  return (
    <>
      <AppHeader/>
      <div className="home-tophalf">
        {/* banner */}
        {
          loading ? (
            <div className="home-banner-loading">
              <LoadingBar />
            </div>
          )
          : <Banner banners={banners.filter(item => Boolean(item.imageWap))} />
        }
        {/* 公告 */}
        <AnnouBar annous={notices} />
        {/* 其他游戏入口 */}
        <GamesSlide />
        {/* 快捷入口 */}
        <SportNav />
      </div>
      {/* 顶级联赛 */}
      <BlockTitle className="mgt5" title={intl.formatMessage({id: 'match.topTours'})} />
      <Tours tours={tours} />
      {
        matchLoading ? (
          <div className="home-matchs-loading">
            <LoadingBar />
          </div>
        ) : null
      }
      {/* 现场滚球 */}
      {
        liveMatchs?.tourGroups?.length ? (
          <>
            <BlockTitle
              title={<><b>LIVE</b><M id="match.inplays" /></>}
              subTitle={
                inplayCount > 0
                ? <M id="match.total_matchs"
                    values={{count: inplayCount}}
                  />
                : undefined
              }
              className="inplay-title"
              arrow
              onClick={() => history.replace('/tab/inplay')}
            />
            <MatchList matchs={liveMatchs} />
          </>
        ) : null
      }
      {
        HOME_SPORTS.map(sportId => {
          const matchs = matchStore.get(`${sportId}-focus`);
          if (!matchs?.tourGroups?.length) {
            return null;
          }
          return (
            <React.Fragment key={sportId}>
              <BlockTitle
                title={
                  <>
                    <IconNav sportId={sportId} />
                    <M id="filter.state_1301" />
                    <M id={`sports.${sportId}`} />
                  </>
                }
                className="featured-title"
                arrow
                onClick={() => history.replace(`/sport/${sportId}`)}
              />
              <MatchList
                matchs={matchs}
              />
            </React.Fragment>
          );
        })
      }
      {/*快速投注*/}
      <EuropeQuickBet />
    </>
  );
}

export default observer(Home);
