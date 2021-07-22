/**
 * websocket连接操作对象
 */
export class Connection {
  /**
   * 构造函数
   * @param {string} url
   *    连接的地址
   */
  constructor (url) {
    this.url = url
    this.failTimes = 0
  }
  
  /**
   * 建立连接
   */
  connect () {
    try {
      this.ws = new WebSocket(this.url)
    } catch (e) {
      this.failTimes ++
    }
  }

  /**
   * 重连
   */
  reconnect () {
    this.failTimes = 0;
    this.connect()
  }

  /**
   * 断开连接
   */
  disconnect () {

  }
}