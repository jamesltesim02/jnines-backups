import AppConfig from '@/config/business.config';
import { getToken } from '@/utils/UserinfoUtil';

// 心跳及重连时间配置
const {
  pushReconnectTime,
} = AppConfig;

const frontId = window.NBConfig.FRONT_ID;
// 推送服务地址
let url = window.NBConfig.PUSH_URL;
const proto = window.location.protocol;
url = `${/^(http|ws)s?:\/\//i.test(url) ? '' : `${proto}//`}${url}`;
url = url.replace(/^http/i, 'ws');

/**
 * 推送服务类
 */
class Pusher {
  constructor() {
    // 是否已经连接
    this.connected = false;
    // 主关注对象
    this.mainWatcher = null;
    // 副关注对象(弹窗中的关注对象)
    this.secondaryWatcher = null;
    // 重连定时对象
    this.reconnectionTimer = null;
    // 保持心跳的timer
    this.dkmInterval = null;
  }

  /**
   * 建立连接
   */
  connect() {
    try {
      const ws1 = new WebSocket(`${url}?token=${getToken()}&frontId=${frontId}`);
      this.ws = ws1;
      this.ws.onopen = () => {
        console.log('ws opend');
        this.connected = true;
        if (this.mainWatcher) {
          this.regpush(this.mainWatcher.data, this.mainWatcher.callback);
        }
      };
      this.ws.onclose = () => {
        console.log('ws closed');
        this.connected = false;
      };
      // 绑定
      this.ws.onmessage = this.receiveMsg.bind(this);
    } catch (e) {
      console.log('connection fail:', e);
    } finally {
      this.dontKillMe();
    }
  }

  /**
   * 断开并重连
   */
  reconnect() {
    console.log('reconnecting...');
    this.disconnect();
    this.connect();
  }

  /**
   * 发送心跳消息
   */
  dontKillMe() {
    clearInterval(this.dkmInterval);
    this.dkmInterval = setInterval(() => {
      if (this.connected === false) {
        this.reconnect();
        return;
      }
      this.reconnectionTimer = setTimeout(this.reconnect.bind(this), pushReconnectTime);
      const timestamp = parseInt(Date.now() / 1000, 10);
      this.reportMsg({
        Action: 0,
        Data: { Timestamp: timestamp },
        Timestamp: timestamp,
      });
      this.lastAliveTime = timestamp;
    }, pushReconnectTime + 1000);
  }

  disconnect() {
    try {
      clearTimeout(this.reconnectionTimer);
      this.ws.close();
      this.connected = false;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 接收到心跳消息反馈
   */
  aliveBack() {
    clearTimeout(this.reconnectionTimer);
    this.reconnectionTimer = null;
  }

  /**
   * 接收到push的消息并处理
   *
   * @param {object} msg
   *    消息对象
   */
  receiveMsg(msgEvent) {
    const msg = JSON.parse(msgEvent.data || '{}');
    console.log(` -----receive message nt(${msg.nt})`, msg);
    if (msg.nt === 0) {
      this.aliveBack();
      return;
    }
    // 主关注回调
    if (this.mainWatcher && this.mainWatcher.callback) {
      this.mainWatcher.callback(msg);
    }
    // 副关注回调
    if (this.secondaryWatcher && this.secondaryWatcher.callback) {
      this.secondaryWatcher.callback(msg);
    }
  }

  /**
   * 上报消息
   */
  reportMsg(msg) {
    if (!this.ws || !this.connected) {
      throw new Error('no connection');
    }
    console.log('will send msg:', msg);
    this.ws.send(JSON.stringify(msg));
  }

  /**
   * 注册关注点数据
   *
   * @param {object} data
   *    关注点数据
   * @param {function} callback
   *    推送回调消息
   * @param {object} secondary
   *    是否为副关注点
   */
  regpush(data, callback, secondary = false) {
    try {
      if (!this.ws || !this.connected) {
        console.warn(`reg fail, no connection,is secondary: ${secondary}, data:`, data);
        return;
      }
      // 注册副关注点(会与最后一次主关注点合并)
      if (secondary) {
        this.secondaryWatcher = { data, callback };
      } else {
        this.mainWatcher = { data, callback };
      }
      const { data: mainData } = this.mainWatcher || { data: {} };
      const { data: seData } = this.secondaryWatcher || { data: {} };
      // 合并主关注和副关注点数据
      const Matchs = [].concat(mainData && mainData.Matchs ? mainData.Matchs : []);
      const OptionIDs = [].concat(mainData && mainData.OptionIDs ? mainData.OptionIDs : []);
      const pointData = {
        Matchs: Matchs.concat(seData && seData.Matchs ? seData.Matchs : []),
        OptionIDs: OptionIDs.concat(seData && seData.OptionIDs ? seData.OptionIDs : []),
      };
      // 上报关注数据
      this.reportMsg({ Action: 2, data: pointData });
    } catch (e) {
      console.warn('reg push error:', e);
    }
  }
}

const pusher = new Pusher();

export const regpush = pusher.regpush.bind(pusher);
export const connect = pusher.connect.bind(pusher);
export const reconnect = pusher.reconnect.bind(pusher);
export const disconnect = pusher.reconnect.bind(pusher);
