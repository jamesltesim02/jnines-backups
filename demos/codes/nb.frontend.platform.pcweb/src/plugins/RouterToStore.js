import router from '@/router';
import store from '@/store';

const INTERCEPTORS = [
  // 赛事和状态页面拦截
  {
    parttern: /^\/matchs\/\d{2}\/\d{1}$/,
    async intercept(to, from, next) {
      let sno = null;
      let newState = null;
      store.commit('match/setTourid', null);
      const snoAndState = to.path.replace(/\/matchs\//, '').split(/\D/);
      sno = +snoAndState[0];
      newState = +snoAndState[1];
      next();
      // 查询体育对应的状态比赛场数
      store.commit('match/setSnoAndState', { sno, newState });
    },
  },
  // 联赛比赛列表页面拦截
  {
    parttern: /^\/tour\/\d{2}\/\d+?$/,
    async intercept(to, from, next) {
      store.commit('match/resetDefault');
      const snoAndTourid = to.path.replace(/\/tour\//, '').split(/\D/);
      const sno = +snoAndTourid[0];
      store.commit(
        'match/setSnoAndTourid',
        {
          sno,
          tourid: snoAndTourid[1],
        },
      );
      next();
    },
  },
  // 比赛详情页面拦截
  {
    parttern: /^\/detail\/\d{2}\/\d+?$/,
    async intercept(to, from, next) {
      store.commit('match/resetDefault');
      const snoAndMid = to.path.replace(/\/detail\//, '').split(/\D/);
      const sno = +snoAndMid[0];
      store.commit('match/setSno', sno);
      next();
    },
  },
  {
    parttern: /\/.*/,
    async intercept(to, from, next) {
      store.commit('match/resetDefault');
      next();
    },
  },
];

export default {
  install() {
    router.beforeEach(async (to, from, next) => {
      const interceptor = INTERCEPTORS.find(({ parttern }) => parttern.test(to.path));
      store.commit('app/updateLastLocation', from);
      if (!interceptor) {
        next();
      } else {
        interceptor.intercept(to, from, next);
      }
    });
  },
};
