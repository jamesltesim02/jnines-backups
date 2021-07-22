import { makeAutoObservable, action, computed } from 'mobx';

import MatchList from './MatchList';
import Match from './Match';
import { AVAILABLE_SPORTS, LIST_MARKETS, MarketStage, MatchState, PushNt, Sports } from '../../consts/match';
import { PushEvent } from '../../components/push/PushConnection';
import random from 'lodash/random';

/** 比赛store入口 */
class MatchStore {

  /** 列表map */
  private matchMap: Map<string, MatchList> = new Map<string, MatchList>();
  /** 详情 */
  private _detail: Match | undefined = undefined;
  /** 进球提示声队列 */
  private _goalQueue: Array<Match> = [];

  /** 联赛色块颜色映射 */
  private _tourColors: Map<string, string> = new Map<string, string>();

  /** 是否标记为删除状态 */
  detailDeleting: boolean = false;

  /** 体育类型对应的比赛数量 */
  private _countsOfSports: any = {};

  constructor () {
    // 设置当前对象为observeable
    makeAutoObservable(this);
  }

  /** 设置比赛 */
  @action
  setData (data: any) {
    if (!data) {
      return;
    }

    Object.entries(data).forEach(
      ([key, list]: Array<any>) => (
        this.matchMap.set(key, new MatchList(list))
      )
    );
  }

  /** 添加比赛到指定列表中 */
  @action
  addData (key: string, data: Array<any>) {
    if (!data || !data.length) {
      return;
    }

    let list = this.matchMap.get(key);
    if (list) {
      list.add(...data);
      return;
    }

    this.matchMap.set(key, new MatchList(data));
  }

  /** 清空列表 */
  @action
  clear (...keys: Array<string>) {
    if (!keys.length) {
      this.matchMap.clear();
      return;
    }

    keys.forEach(
      key => this.matchMap.delete(key)
    );
  }

  /** 设置详情 */
  @action
  setDetail (match: any | undefined) {
    this.detailDeleting = false;
    if (match) {
      this._detail = new Match(match);
    } else {
      this._detail = undefined;
    }
  }

  /** 推送事件 */
  @action
  onDataChange (event: PushEvent) {
    if (
      event.data
      &&
      !event.data?.mid
      &&
      event.data?.matchId
    ) {
      if (event.data) {
        event.data.mid = event.data.matchId;
      }
    }

    // 如果是详情,则触发详情的事件
    if (
      this._detail
      &&
      event.data?.mid === this._detail.matchId
    ) {
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
        this.detailDeleting = true;
        return;
      }

      this._detail.onDataChange(event);

      // 详情列表不触发 赔率和主盘变化事件
      if (
        PushNt.ODDS === event.nt
        ||
        PushNt.MAIN_MARKET === event.nt
      ) {
        return
      }
    }

    // 触发列表事件
    this.matchMap.forEach(matchList => {
      if (matchList.list.length > 0) {
        matchList.onDataChange(event);
      }
    });
  }

  /** 添加进球吹哨提示音 */
  @action
  addGoal (info: Match) {
    this._goalQueue = ([...this._goalQueue, info]);
  }

  /** 清空进球提示列表 */
  @computed
  clearGoal () {
    this._goalQueue = [];
  }

  @computed
  get goalQueue () {
    return this._goalQueue;
  }

  /** 获取详情 */
  @computed
  get detail () {
    return this._detail;
  }

  /** 将当前所有比赛按体育项分类, 并迭代调用回调函数 */
  private listBySport (
    callback: (sportId: Sports, list: Array<Match>) => void
  ) {
    const matchs: Array<Match> = [];
    this.matchMap.forEach(
      mlist => matchs.push(...mlist.list)
    )

    AVAILABLE_SPORTS.forEach(sportId => {
      const list = matchs.filter(m => m.sportId === sportId);
      if (!list.length) {
        return;
      }
      callback(sportId, list);
    })
  }

  /** 获取详情推送数据 */
  private getDetailPushData () {
    const matchs: any[] = [];
    this.listBySport((sportId, list) => {
      matchs.push({
        sportId,
        marketStage: -1,
        marketType: [-1],
        matchIds: [
          ...list.map(m => m.matchId),
          this._detail?.matchId
        ]
      });
    });
    return {
      matchs,
      mainMatchId: this._detail?.matchId
    };
  }

  /** 列表推送数据 */
  private getListPushData () {
    const matchs: any = [];
    this.listBySport((sportId, list) => {
      matchs.push({
        sportId,
        marketStage: MarketStage.H0,
        marketType: LIST_MARKETS.getMarkets(sportId),
        matchIds: list.map(m => m.matchId)
      });
    });
    return { matchs };
  }

  /** 推送相关数据整理 */
  @computed
  get pushData () {
    return (
      this._detail
      ? this.getDetailPushData()
      : this.getListPushData()
    );
  }

  /** 获取联赛色块颜色 */
  @computed
  tourColor(tourId: string) {
    let color = this._tourColors.get(tourId);

    if (!color) {
      color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
      this._tourColors.set(tourId, color);
    }

    return color;
  }

  /** 获取指定key的比赛列表 */
  @computed
  list (key: string): Array<Match> {
    const listObj = this.get(key);
    if (!listObj) {
      return [];
    }

    return listObj.list;
  }

  get (key: string) {
    return this.matchMap.get(key);
  }

  set countsOfSports (counts: any) {
    this._countsOfSports = counts;
  }

  get countsOfSports () {
    return this._countsOfSports;
  }

  getCount (sport: any) : number {
    return this._countsOfSports[sport] || 0
  }
}

export default new MatchStore();

