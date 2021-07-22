import { PUSH_URL } from '../config/config.ops'

import devConfig from '../config/config.dev'

const {
  push: {
    maxRetryTimes,
    retryTime,
    dkmTime
  }
} = devConfig

/**
 * 获取本次重试需要等待的时长
 *
 * @param {number} times 当前第几次获取
 */
const getRetryTime = (times = 0) => {
  if (!retryTime) {
    return 0
  }

  if (typeof retryTime === 'number') {
    return retryTime
  }

  if (Array.isArray(retryTime)) {
    return retryTime[times] || retryTime[retryTime.length - 1]
  }
  
  if (typeof retryTime === 'function') {
    return getRetryTime(times + 1)
  }

  return +retryTime || 0
}

/**
 * 推送封装对象
 */
class Pusher {
  /** ws链接对象 */
  ws = null
  /** 是否已经建立链接 */
  connected = false
  /** 是否正在建立连接 */
  connecting = false
  /** 重新尝试链接timer */
  reconnectionTimer = null
  /** 心跳定时任务 */
  dkmTimer = null
  /** 已重试次数 */
  retriedCount = 0

  /** 当前用户id */
  userId = null
  /** 当前注册的关注数据 */
  concern = null
  /** 推送回调 */
  callback = null

  _log (...logs) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...logs)
    }
  }

  /** 发送心跳消息 */
  _dontKillMe () {
    this.sendMsg({ action: 2 })
    this.reconnectionTimer = setTimeout(this.reconnect.bind(this), getRetryTime(0))
  }

  /** 接收到心跳反馈 */
  _lifeSaved () {
    clearTimeout(this.reconnectionTimer)
    this.dkmTimer = setTimeout(this._dontKillMe.bind(this), dkmTime)
  }

  /**
   * 接收并处理消息
   *
   * @param {object} msg 接收到的推送消息
   */
  _receiveMessage ({ data }) {
    const msg = JSON.parse(data || '{}')
    this._log(`-----received[${msg.action || ''}:${msg.nt || ''}]:`, msg, this.userId)
    if (!msg) {
      return
    }

    // 心跳反馈消息处理
    if (msg.action === 2) {
      this._lifeSaved()
      return
    }

    // 正常推送内容处理
    if (this.callback) {
      this.callback(msg)
    }
  }

  /** 重新尝试链接 */
  _retryConnect () {
    if (this.retriedCount >= maxRetryTimes) {
      return
    }

    clearTimeout(this.reconnectionTimer)
    // 创建重试定时任务
    this.reconnectionTimer = setTimeout(() => {
      this._log(`**********pusher with ${this.userId} will retry connect, its ${this.retriedCount + 1}st time retry`)
      this.retriedCount = this.retriedCount + 1
      this._createWebSocket()
    }, getRetryTime(this.retriedCount))
  }

  /** 创建WebSocket连接 */
  _createWebSocket () {
    try {
      this.connecting = true
      const ws = this.ws = new WebSocket(`${PUSH_URL}${this.userId}`)
      this._log('*********connecting...', this.userId)
      
      // ws连接成功事件
      ws.onopen = () => {
        this.connecting = false
        this.connected = true
        this._log('*********connected:', this.userId)
        // 如果当前已存在关注数据,则上报注册到服务器端
        if (this.concern) {
          this.registConcern(this.concern, this.callback)
        }
        this.retryTimes = 0
        // 开始发送心跳消息
        this._dontKillMe()
      }

      // ws接收到消息事件
      ws.onmessage = this._receiveMessage.bind(this)

      // ws关闭事件
      ws.onclose = () => {
        this.connecting = false
        this.connected = false
        // 清除心跳定时任务
        clearTimeout(this.dkmTimer)
        this.dkmTimer = null
        this._log('*********closed', this.userId)
      }

      // ws错误事件
      ws.onerror = (e) => {
        this.connecting = false
        console.error('*********error', this.userId, e)
      }
    } catch (e) {
      this.connected = false
      this.connecting = false
      console.error('*********connect fail:', this.userId, e)
      // 重新尝试建立链接
      this._retryConnect()
    }
  }

  setUserId(userId) {
    this.userId = userId
  }

  /**
   * 建立ws链接
   * @param {string} userId 当前用户id
   */
  connect () {
    this._createWebSocket()
  }

  /** 断开链接 */
  disconnect () {
    try {
      this._log('**********disconnect:', this.userId)
      this.ws.close()
    } catch (e) {
      console.warn('*********disconnect fail:', this.userId, e)
    } finally {
      this.connected = false
      // 清除心跳定时任务
      clearTimeout(this.dkmTimer)
      this.dkmTimer = null
    }
  }

  /** 重连 */
  reconnect () {
    this._log('*********reconnect:', this.userId)
    this.disconnect()
    this.connect()
  }

  /**
   * 发送消息到服务器端
   * 
   * @param {object} msg 将要发送的消息
   */
  sendMsg (msg) {
    if (!this.connected) {
      if (!this.connecting) {
        this.reconnect()
      }
      return
    }

    msg.timespan = Date.now()
    this._log('-----send:', msg, this.userId)
    this.ws.send(JSON.stringify(msg))
  }

  /**
   * 注册关注数据
   *
   * @param {object} concern 关注点数据
   * @param {function}} callback 回调函数
   */
  registConcern (concern, callback) {
    this.callback = callback
    this.concern = concern
    this.sendMsg({
      action: 1,
      data: concern
    })
  }
}

export default Pusher
