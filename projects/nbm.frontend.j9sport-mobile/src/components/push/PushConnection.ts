import AppConfig from '../../configs';
import { OptionStatus, PushNt, Sports } from '../../consts/match';
import { PushConst } from '../../consts/network';

/** 推送类型 */
enum Action {
  /** 普通推送消息 */
  MESSAGE = 1,
  /** 心跳消息 */
  DONT_KILL_ME = 2,
}

/** 比分变化类型 */
export enum ScoreChange {
  /** 比分 */
  SCORE = 1,
  /** 角球 */
  CORNER = 2,
  /** 黄牌 */
  YELLOW = 3,
  /** 红牌 */
  RED = 4,
}

/** 推送消息-投注项 */
export type PushOption = {
  /** 投注项id - optionId */
  oid: string,
  /** 赔率 */
  odds: number,
  /** 串关赔率 */
  comboOdds: number,
  /** 投注项标志 - betOption */
  bop: string,
  /** 投注项状态 - betStatus */
  bst: OptionStatus,
  /** 排序字段 - orderNo */
  num: number
};

/** 推送消息 - 玩法 */
export type PushMarket = {
  /**  玩法id - marketId  */
  gid: string,
  /** 玩法类型 - marketType */
  mtype: number,
  /** 玩法分类 - marketGroup */
  mgroup: number,
  /** 玩法阶段 - marketStage */
  mstage: number,
  /** 盘口 - betBar */
  betbar: string,
  /** 玩法类别 - marketCategory */
  category: number,
  /** 是否为主盘 - main */
  ism: boolean,
  /** 串关标志 - combo */
  combo: number,
  /** 排序字段 - orderNo */
  num: number,
  /** 是否可见状态 */
  mstatus: OptionStatus,
  /** 投注项列表 - options */
  ops: Array<PushOption>,
  /** 电竞的玩法x值 */
  mParam: number,
};

/** 与比赛相关的推送数据 */
export type PushData = {
  /** 注单id */
  ticketId?: string;
  /** 用户连接标志 */
  userId?: string;
  /** 状态值, 200为成功, 其他为失败 */
  errorCode?: number;
  /** 失败原因 */
  errorMsg?: string;
  /** 比赛id - matchId */
  mid?: string,
  matchId?: string,
  /** 体育类型 - sportId */
  spid?: Sports,
  /** 玩法列表 */
  mks?: Array<PushMarket>,
  /** 旧比赛状态 */
  ost?: number,
  /** 新比赛状态 */
  nst?: number,
  /** 滚球阶段 */
  period?: number,
  /** 时间状态 true 持续跑动, false: 暂停 */
  run?: boolean,
  /** 比赛时间 */
  time?: string,
  /** 剩余时间 */
  rtime?: string,
  /** 单节剩余时间 */
  rptime?: string,
  /** 补时时间 */
  stime?: string,
  /** 已补时间 */
  satime?: string,
  /** 
   * 比分变化类型
   * * 1 比分
   * * 2 角球
   * * 3 黄牌
   * * 4 红牌
   */
  etype?: ScoreChange,
  /** 比分值 */
  score?: string,
  /** 玩法数量 */
  mkCount: number,
  /** 投注成功后最新的数据 */
  opts: Array<any>
}

/**
 * 推送事件对象
 */
export type PushEvent = {
  /** 推送事件分类 1: 普通消息, 2: 心跳消息 */
  action: Action,
  /** 推送数据类型 */
  nt?: PushNt,
  /** 时间戳 */
  timespan?: number,
  /** 时间戳 */
  ts?: string,
  /** 推送数据 */
  data?: PushData,
}

/** 推送处理 */
class PushConnection {
  userId?: string;
  /** 注册的用户连接标志 */
  private signature?: string;
  /** 当前的websocket对象 */
  private ws?: WebSocket;
  /** 是否正在连接中 */
  private _connecting: boolean = false;
  /** 是否已经成功连接 */
  private _connected: boolean = false;
  /** 当前已发起重试次数 */
  private retried: number = 0;

  /** 自动重新连接定时任务 */
  private retryTimer?: any;
  /** 心跳发送定时任务 */
  private dkmTimer?: any;

  /** 当前注册的页面关注数据 */
  private data?: any;
  /** 注册的回调函数 */
  private callback?: (event: any) => void;

  constructor () {
    // 推送功能 测试消息监听
    window.addEventListener('test-push', (event: any) => {
      if (!this.connected) {
        return;
      }

      this.handleMessage(event.detail);
    });

    // 页面获得焦点事件
    window.onfocus = () => {
      if (!this.signature) {
        return;
      }
      // 清除之前的重连
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
      }

      // 清除dkm消息的timer
      if (this.dkmTimer) {
        clearTimeout(this.dkmTimer);
      }
  
      // 重新发送心跳
      this.dontKillMe();
    };
  }

  /** 输出日志 */
  private log(...logs: Array<any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...logs)
    }
  }

  /** 创建websocket */
  private createWS () {
    try {
      this._connecting = true;
      this.ws = new WebSocket(`${AppConfig.PUSH_URL}${this.signature}`);
      this.log('*********connecting...', this.signature);

      // 连接成功事件
      this.ws.addEventListener('open', () => {
        this._connecting = false;
        this._connected = true;
        this.log('*********connected...', this.signature);

        // 重新发送之前注册过的数据0
        if (this.data && this.callback) {
          this.on(this.data, this.callback);
        }

        // 重置重试次数
        this.retried = 0;
        // 开始发送心跳信息
        this.dontKillMe();
      });

      // 接收到消息事件
      this.ws.addEventListener('message', this.handleMessage.bind(this));

      // 关闭事件
      this.ws.addEventListener('close', (e) => {
        this._connected = false;
        this._connecting = false;
        this.ws = undefined;

        clearTimeout(this.dkmTimer);
        this.dkmTimer = undefined;

        this.log('*********closed', this.signature, e);
      });

      // 连接出错事件
      this.ws.addEventListener('error', (e) => {
        this._connecting = false;
        this._connected = false;
        this.ws = undefined;

        console.error('*********error', this.signature, e);
      });
    } catch (e) {
      this._connected = false;
      this._connecting = false;

      console.error('*********connect fail:', this.signature, e);
      // 重新尝试建立链接
      this.retryConnect();
    }
  }

  /** 尝试重新建立连接 */
  private retryConnect () {
    if (this.retried >= PushConst.RETRY_TIMES) {
      return;
    }
    
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    this.retryTimer = setTimeout(
      () => {
        this.log(`**********pusher with ${this.signature} will retry connect, its ${this.retried + 1}st time retry`);
        this.retried = this.retried + 1;
        this.createWS();
      },
      PushConst.RETRY_DELAY
    );
  }

  /** 发送心跳信息 */
  private dontKillMe () {
    this.send({ action: Action.DONT_KILL_ME });
    this.retryTimer = setTimeout(
      this.reconnect.bind(this),
      PushConst.RETRY_DELAY
    );
  }

  /** 接收到心跳反馈消息, 表示连接仍然健康 */
  private keepAlive () {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    this.dkmTimer = setTimeout(
      this.dontKillMe.bind(this),
      PushConst.DKM_DELAY
    );
  }

  /** 通过websocket发送消息 */
  private send (msg: any) {
    if (
      !this._connected
      ||
      !this.ws
      ||
      this._connecting
    ) {
      if (!this._connecting && this.ws) {
        this.reconnect()
      }
      return;
    }

    try {
      this.ws.send(JSON.stringify({
        ...msg,
        timespan: Date.now()
      }));
    } catch (e) {
      console.warn(e);
    }
  }

  /** 接收消息并处理事件 */
  private handleMessage ({ data }: any) {
    if (!data) {
      return;
    }
    
    try {
      const msg = (
        typeof data === 'string'
        ? JSON.parse(data)
        : data
      );
      this.log(`-----received[${msg.action || ''}:${msg.nt || ''}](${msg.data && msg.data.mid ? msg.data.mid : ''}):`, msg, this.signature)
    
      // 如果是接收到心跳消息, 则让连接继续保持
      if (msg.action === Action.DONT_KILL_ME) {
        this.keepAlive()
        return;
      }

      // 触发页面监听回调
      if (this.callback) {
        this.callback(msg);
      }
    } catch (e) {
      console.warn('Can not parse push message:', e);
    }
  }

  /**
   * 建立ws连接  
   *
   * @param signature 用户连接标志
   * @param userId 用户id
   */
  connect (signature: string, userId?: string) {
    if (!signature) {
      throw new Error('Parameter "signature" is required.');
    }

    this.signature = signature;
    this.userId = userId;

    // 创建连接
    this.createWS();
  }

  /**
   * 重新建立连接
   *
   * @param signature 用户连接标志
   * @param userId 用户id
   */
  reconnect (signature?: string, userId?: string) {
    const currentsignature = signature || this.signature
    const currntUserId = userId || this.userId;

    if (!currentsignature) {
      throw new Error('Parameter "signature" is required.');
    }

    // 先断开当前的连接
    this.disconnect();
    // 再创建连接
    this.connect(currentsignature, currntUserId);
  }

  /** 断开连接 */
  disconnect () {
    try {
      this.log('**********disconnect:', this.signature)
      this.ws?.close();
    } catch (e) {
      console.warn('*********disconnect fail:', this.signature, e)
    } finally {
      this.ws = undefined;
      this._connected = false;
      this._connecting = false;
      clearTimeout(this.dkmTimer);
      this.dkmTimer = null;
    }
  }

  /**
   * 注册推送事件
   *
   * @param data 页面关注的数据(推送触发条件)
   * @param callback 收到推送后的回调函数
   */
  on (data: any, callback: (event: PushEvent) => void) {
    this.data = data;
    this.callback = callback;

    this.send({
      action: Action.MESSAGE,
      data
    });
  }

  /** 是否已建立连接 */
  public get connected () {
    return this._connected;
  }

  /** 是否正在连接中 */
  public get connecting () {
    return this._connecting;
  }
}

export default PushConnection;
