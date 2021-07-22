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

class WidgetStore {

  systemState?: SystemState;
  settings?: WidgetSettings;

}

export default new WidgetStore();
