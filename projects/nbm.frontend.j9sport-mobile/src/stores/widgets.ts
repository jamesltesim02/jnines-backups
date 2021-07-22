import { computed, makeAutoObservable } from "mobx";
import WidgetSettings from "../widgets/WidgetSettings";

/** 系统状态 */
class SystemState {
  /** 客户ip */
  clientIP?: string = undefined;
  /** 是否地域限制 403 */
  forbbiden?: boolean = false;
  /** 是否大维护 503 */
  maintenance?: boolean = false;
  /** 是否小维护 503 */
  tempmaintenance?: boolean = false;
  /** 维护时间 */
  maintenancetime?: any = null;

  constructor (state?: any) {
    if (state) {
      this.forbbiden = state.forbbiden;
      this.clientIP = state.clientIP;
      this.maintenance = state.maintenance;
      this.tempmaintenance = state.tempmaintenance;
      this.maintenancetime = state.maintenancetime;
    }
  }

  get mainting () {
    return this.maintenance || this.tempmaintenance;
  }
}


export class Toast {
  key: string | number;
  type: string;
  msg?: string;
  destoryTimer?: any;

  constructor (
    {
      key,
      msg,
      type,
      destoryTimer
    }: any
  ) {
    this.key = key;
    this.msg = msg;
    this.type = type
    this.destoryTimer = destoryTimer
  }
}

class WidgetStore {

  systemState?: SystemState;
  settings?: WidgetSettings;

  _toastQueue: Toast[] = [];
  
  constructor () {
    makeAutoObservable(this);
  }

  private _deleteToast (key : string | number) {
    const existindex = this._toastQueue.findIndex(
      m => m.key === key
    );

    // 删除原有
    if (existindex > -1) {
      const existMessage = this._toastQueue[existindex];
      clearTimeout(existMessage.destoryTimer);
      this._toastQueue.splice(existindex, 1);
    }
  }

  toast (
    msg: {
      msg: string,
      key?: string | number,
      type?: 'success' | 'error' | 'warn' | 'info',
      duration?: number
    }
  ) {
    if (msg.key) {
      this._deleteToast(msg.key);
    } else {
      msg.key = Date.now();
    }

    if (!msg.duration) {
      msg.duration = 3000;
    }

    const timer = setTimeout(
      () => {
        this._deleteToast(msg.key as any);
      },
      msg.duration
    )

    this._toastQueue.push(
      {
        ...msg,
        destoryTimer: timer
      } as any
    );
  }

  @computed
  get toasts () {
    return this._toastQueue;
  }
}

export default new WidgetStore();
