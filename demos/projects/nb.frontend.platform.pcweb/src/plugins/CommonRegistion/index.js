import registComponents from './registComponents';
import registFilters from './registFilters';
import registDirectives from './registDirectives';

export default {
  install() {
    // 全局过滤器
    registFilters();
    // 全局组件
    registComponents();
    // 全局指令
    registDirectives();
  },
};
