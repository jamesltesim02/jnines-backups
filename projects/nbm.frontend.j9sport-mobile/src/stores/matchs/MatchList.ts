import { makeAutoObservable, action, computed } from 'mobx';
import { PushEvent } from '../../components/push/PushConnection';
import { GroupOfMarket, LIST_MARKETS, MatchState, PushNt, Sports } from '../../consts/match';

import Match from './Match';

export type TourGroup = {
  sportId: Sports,
  tournamentId: string,
  tournamentName: string,
  matchs: Array<Match>,
  key: string
}

/** 比赛列表 */
export default class MatchList {
  /** 列表集合 */
  readonly list: Array<Match> = [];

  constructor (matchs: Array<any>) {
    this.add(...matchs);
    // 设置当前对象为observeable
    makeAutoObservable(this);
  }

  /** 添加比赛到列表中 */
  @action
  add (...matchs: Array<any>) {
    if (!matchs.length) {
      return;
    }
    matchs.forEach(m => {
      if(!m || !m.matchId) {
        return;
      }
      this.list.push(new Match(m));
    });
  }

  /** 推送事件 */
  @action
  onDataChange (event: PushEvent) {
    const index = this.list.findIndex(
      match => match.matchId === event.data?.mid
    );
    if (index === -1) {
      return;
    }

    // 比赛完结或拉盘后从列表删除
    if (
      event.nt === PushNt.MATCH_DELETE
      ||
      (
        event.nt === PushNt.MATCH_STATE
        &&
        event.data?.nst === MatchState.END
      )
    ) {
      this.list.splice(index, 1);
      return;
    }

    // 如果是赔率或主盘变化, 则过滤出列表上关心的玩法
    const isOptionChange = (
      PushNt.ODDS === event.nt
      ||
      PushNt.MAIN_MARKET === event.nt
    )
    if ( isOptionChange && event.data?.spid) {
      const markets = LIST_MARKETS[event.data?.spid];
      event.data.mks = event.data?.mks?.filter(market => (
        markets.findIndex(
          (m: any) => (
            market.mgroup === GroupOfMarket.SCORE
            &&
            m.marketStage === market.mstage
            &&
            m.marketType === market.mtype
          )
        ) > -1
      ));
    }

    const match = this.list[index];
    if (match) {
      match.onDataChange(event)
    }
  }

  /** 按联赛分组比赛 */
  @computed
  get tourGroups () : Array<TourGroup> {
    return this.getGroupsByFilter();
  }

  getGroupsByFilter (filter?: { sportId: Sports, tourIds?: string[] }) {
    const tours: Array<TourGroup> = [];

    let lastTour: TourGroup | undefined = undefined;
    (
      filter
      ? this.list.filter(item => {
        if (filter.tourIds?.length) {
          return filter.tourIds.includes(item.tournamentId);
        }

        return filter.sportId === item.sportId;
      })
      : this.list
    ).forEach((match, index) => {
      if (!lastTour || lastTour.tournamentId !== match.tournamentId) {
        lastTour = {
          sportId: match.sportId,
          tournamentId: match.tournamentId,
          tournamentName: match.tournamentName,
          matchs: [],
          key: `${match.tournamentId}.${index}`
        };
        tours.push(lastTour);
      }

      lastTour.matchs.push(match)
    });

    return tours;
  }
};
