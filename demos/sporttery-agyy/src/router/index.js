import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Matchs from '@/views/Matchs';
import MatchDetail from '@/views/MatchDetail';
import Welcome from '@/views/Welcome';
import Login from '@/views/Sign/Login';
import Member from '@/views/Member';
import Bet from '@/views/Bet';
import Master from '@/views/Master';
import History from '@/views/History';
import NewsList from '@/views/NewsList';
import NewsDetail from '@/views/NewsDetail';
import Error from '@/views/Error';
import AdExample from '@/views/AdExample';
import Query from '@/views/Query';
import Report from '@/views/Report';
import Settings from '@/views/Settings';
import Register from '@/views/Sign/Register';
import Withdraw from '@/views/Withdraw';
import Bank from '@/views/Bank';
import Payment from '@/views/Payment';
import AppPayment from '@/views/Payment/types/App';
import AliPayment from '@/views/Payment/types/Alipay';
import ScanPayment from '@/views/Payment/types/Scan';
import OnlinePayment from '@/views/Payment/types/Online';
import TransferPayment from '@/views/Payment/types/Transfer';
import VirtualPayment from '@/views/Payment/types/Virtual';
import RetryPayment from '@/views/Payment/RetryPayment';
import Rebate from '@/views/Rebate';
import CustomerService from '@/views/CustomerService';
import Portal from '@/views/Portal';

Vue.use(Router);

/*
 * router中meta.index编号规则：
 * 1XX: 欢迎页，登录，注册，忘记密码，错误页等页面; 100: 欢迎，101-109: 登录，注册，忘记密码等，110-129：错误页面
 * 2XX: 首页，新闻列表及详情等与首页相关页面
 * 3XX: 赛程，比赛详情页等比赛相关页面
 * 4XX: 投注单，投注记录类页面
 * 5XX: 我的，个人中心相关页面
 * 500：member
 * 501-509：设置页面, seamless 设置中心
 * 510-529：存款
 * 530-539：取款
 * 540-549：洗码
 * 550-559：优惠
 * 560-569: 修改头像，用户名等
 * 570-579：修改其他资料
 * 580-589：银行卡
 * 590-599：报表
 * 600-689: 其他
 * 690-698：商户广告页
 * 699：客服中心
 * 从编号小的页面往大的页面，执行前进动画，大的往小的，执行后退动画
 */
const router = new Router({
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome,
      meta: { index: 100 },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { index: 101 },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { index: 102 },
    },
    {
      path: '/error/:code',
      name: 'error',
      component: Error,
      meta: { index: 110 },
      props: true,
    },
    {
      path: '*',
      redirect: '/error/404',
      meta: { index: 111 },
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { index: 200 },
    },
    {
      path: '/newslist',
      name: 'newslist',
      component: NewsList,
      meta: { index: 210 },
    },
    {
      path: '/newsdetail/:id',
      name: 'newsdetail',
      component: NewsDetail,
      meta: { index: 211 },
      props: true,
    },
    {
      path: '/matchs/:multitype/:sno',
      name: 'matchs',
      component: Matchs,
      meta: { index: 300 },
      props: route => ({
        sno: +route.params.sno || 10,
        multitype: +route.params.multitype || 0,
      }),
    },
    {
      path: '/detail/:sno/:mid',
      name: 'detail',
      component: MatchDetail,
      meta: { index: 310 },
      props: true,
    },
    {
      path: '/adexample',
      name: 'adexample',
      component: AdExample,
      meta: { index: 320 },
    },
    {
      path: '/bet',
      name: 'bet',
      component: Bet,
      meta: { index: 330 },
    },
    {
      path: '/master',
      name: 'master',
      component: Master,
      meta: { index: 340 },
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { index: 400 },
    },
    {
      path: '/member',
      name: 'member',
      component: Member,
      meta: { index: 500 },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { index: 501 },
    },
    {
      path: '/payment',
      // redirect: () => `/payment/${store.state.payment.lastType || 'alipay'}`,
      name: 'payment',
      component: Payment,
      meta: { index: 510 },
      children: [
        {
          path: 'app',
          component: AppPayment,
          meta: { index: 511 },
        },
        {
          path: 'alipay',
          component: AliPayment,
          meta: { index: 512 },
        },
        {
          path: 'scan',
          component: ScanPayment,
          meta: { index: 513 },
        },
        {
          path: 'online',
          component: OnlinePayment,
          meta: { index: 514 },
        },
        {
          path: 'transfer',
          component: TransferPayment,
          meta: { index: 515 },
        },
        {
          path: 'virtual',
          component: VirtualPayment,
          meta: { index: 516 },
        },
      ],
    },
    {
      path: '/retrypayment',
      name: 'retrypayment',
      component: RetryPayment,
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: Withdraw,
      meta: { index: 530 },
    },
    {
      path: '/rebate',
      name: 'rebate',
      component: Rebate,
      meta: { index: 540 },
    },
    {
      path: '/bank',
      name: 'bank',
      component: Bank,
      meta: { index: 580 },
    },
    {
      path: '/query',
      name: 'query',
      component: Query,
      meta: { index: 590 },
    },
    {
      path: '/report/:type',
      name: 'report',
      component: Report,
      props: true,
      meta: { index: 591 },
    },
    {
      path: '/portal/:id',
      name: 'portal',
      component: Portal,
      props: true,
      meta: { index: 690 },
    },
    {
      path: '/customer-service',
      name: 'customer-service',
      component: CustomerService,
      meta: { index: 699 },
    },
  ],
});

export default router;
