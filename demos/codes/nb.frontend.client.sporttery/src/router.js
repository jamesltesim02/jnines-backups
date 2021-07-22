import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import XSports from '@/views/XSports';
import FinishedDetail from '@/views/XSports/FinishedDetail';
import MatchInfo from '@/views/XSports/MatchInfo';
import SportsFilter from '@/views/XSports/SportsFilter';
import Matchs from '@/views/Matchs';
import MatchDetail from '@/views/MatchDetail';
import Welcome from '@/views/Welcome';
import Login from '@/views/Sign/Login';
import Member from '@/views/Member';
import Bet from '@/views/Bet';
import Master from '@/views/Master';
import Result from '@/views/Result';
import History from '@/views/History';
import NewsList from '@/views/NewsList';
import NewsDetail from '@/views/NewsDetail';
import Error from '@/views/Error';
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
import RebateDetail from '@/views/RebateDetail';
import CustomerService from '@/views/CustomerService';
import Portal from '@/views/Portal';
import Xmember from '@/views/XSports/Xmember';
import MemberInfo from '@/views/XSports/Xmember/MemberInfo';
import HeadIcon from '@/views/XSports/Xmember/HeadIcon';
import EditField from '@/views/XSports/Xmember/EditField';
import Specialist from '@/views/XSports/Xmember/Specialist';
import RakeHistory from '@/views/XSports/Xmember/RakeHistory';
import Following from '@/views/XSports/Xmember/Following';
import Messages from '@/views/XSports/Xmember/Messages';
import MessageDetail from '@/views/XSports/Xmember/MessageDetail';
import Guide from '@/views/XSports/Xmember/Guide';
import PublishDetail from '@/views/Publish/PublishDetail';
import PublishNew from '@/views/Publish/PublishNew';
import Publish from '@/views/Publish/Publish';
import Ranking from '@/views/Ranking';
import Lottery from '@/views/Lottery';
import MyCard from '@/views/MyCard';
import Reward from '@/views/Reward';
import FocusFans from '@/views/FocusFans';
import ShineNew from '@/views/Shine/ShineNew';
import Shine from '@/views/Shine/Shine';

Vue.use(Router);

/*
 * router中meta.index编号规则：
 * 1XX: 欢迎页，登录，注册，忘记密码，错误页等页面; 100: 欢迎，101-109: 登录，注册，忘记密码等，110-129：错误页面
 * 2XX: 首页，新闻列表及详情等与首页相关页面
 * 3XX: 赛程，比赛详情页等比赛相关页面
 * 4XX: 投注单，投注记录类页面
 * 5XX: 赛果，比赛结果相关页面
 * 5XX: 投注单，投注记录类页面
 * 8XX: 我的，个人中心相关页面
 * 800：member
 * 801-809：设置页面, seamless 设置中心
 * 810-829：存款
 * 830-839：取款
 * 840-849：洗码
 * 850-859：优惠
 * 860-869: 修改头像，用户名等
 * 870-879：修改其他资料
 * 880-889：银行卡
 * 890-899：报表
 * 900-989: 其他
 * 990-998：商户广告页
 * 999：客服中心
 * 从编号小的页面往大的页面，执行前进动画，大的往小的，执行后退动画
 */
export default new Router({
  // mode: 'history',
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
      // redirect: '/home',
      redirect: '/xsports/1',
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
      path: '/xsports/:state',
      name: 'xsports',
      component: XSports,
      meta: { index: 301 },
      props: route => ({
        state: +route.params.state,
      }),
    },
    {
      path: '/publish/:state',
      name: 'publish',
      component: Publish,
      meta: { index: 311 },
      props: route => ({
        state: +route.params.state,
      }),
    },
    {
      path: '/shine/:state',
      name: 'shine',
      component: Shine,
      meta: { index: 312 },
      props: route => ({
        state: +route.params.state,
      }),
    },
    {
      path: '/detail/:sno/:mid',
      name: 'detail',
      component: MatchDetail,
      meta: { index: 320 },
      props: true,
    },
    {
      path: '/matchinfo/:sno/:mid',
      name: 'matchinfo',
      component: MatchInfo,
      meta: { index: 321 },
      props: true,
    },
    {
      path: '/sportsfilter',
      name: 'sportsfilter',
      component: SportsFilter,
      meta: { index: 341 },
    },
    {
      path: '/finished/:mid',
      name: 'finished',
      component: FinishedDetail,
      meta: { index: 751 },
      props: true,
    },
    {
      path: '/ranking/:id',
      name: 'ranking',
      component: Ranking,
      meta: { index: 347 },
      props: route => ({
        id: +route.params.id,
      }),
    },
    // {
    //   path: '/adexample',
    //   name: 'adexample',
    //   component: AdExample,
    //   meta: { index: 330 },
    // },
    {
      path: '/xmember',
      name: 'xmember',
      component: Xmember,
      meta: { index: 701 },
    },
    {
      path: '/member/info',
      name: 'memberinfo',
      component: MemberInfo,
      meta: { index: 711 },
    },
    {
      path: '/member/info/headicon',
      name: 'headicon',
      component: HeadIcon,
      meta: { index: 712 },
    },
    {
      path: '/member/editinfo/:fieldname',
      name: 'editfield',
      component: EditField,
      meta: { index: 713 },
      props: true,
    },
    {
      path: '/member/rakehistory',
      name: 'rakehistory',
      component: RakeHistory,
      meta: { index: 715 },
    },
    {
      path: '/member/following',
      name: 'following',
      component: Following,
      meta: { index: 716 },
    },
    {
      path: '/member/messages',
      name: 'messages',
      component: Messages,
      meta: { index: 717 },
    },
    {
      path: '/member/messages/:id',
      name: 'messagedetail',
      component: MessageDetail,
      meta: { index: 718 },
      props: true,
    },
    {
      path: '/member/guide',
      name: 'guide',
      component: Guide,
      meta: { index: 719 },
    },
    {
      path: '/mycard/:state',
      name: 'mycard',
      component: MyCard,
      meta: { index: 721 },
      props: route => ({
        state: +(route.params.state || 0),
      }),
    },
    {
      path: '/reward',
      name: 'reward',
      component: Reward,
      meta: { index: 795 },
    },
    {
      path: '/lottery/:recordId/:type',
      name: 'lottery',
      component: Lottery,
      meta: { index: 796 },
      props: route => ({
        recordId: route.params.recordId,
        type: +(route.params.type),
      }),
    },
    {
      path: '/bet',
      name: 'bet',
      component: Bet,
      meta: { index: 340 },
    },
    {
      path: '/master',
      name: 'master',
      component: Master,
      meta: { index: 341 },
    },
    {
      path: '/history/:type',
      name: 'history',
      component: History,
      meta: { index: 750 },
      props: route => ({
        type: +(route.params.type || 0),
      }),
    },
    {
      path: '/publishnew/:mstid/:odds/:type',
      name: 'publishnew',
      component: PublishNew,
      meta: { index: 760 },
      props: route => ({
        type: +route.params.type,
        mstid: route.params.mstid,
        odds: route.params.odds,
      }),
    },
    {
      path: '/focusfans/:type',
      name: 'focusfans',
      component: FocusFans,
      meta: { index: 768 },
      props: route => ({
        type: +route.params.type,
      }),
    },
    {
      path: '/member/specialist/:userId/:type',
      name: 'specialist',
      component: Specialist,
      meta: { index: 770 },
      props: route => ({
        userId: route.params.userId,
        type: +(route.params.type || 0),
      }),
    },
    {
      path: '/publishdetail/:ticketId',
      name: 'publishdetail',
      component: PublishDetail,
      meta: { index: 770 },
      props: route => ({
        ticketId: route.params.ticketId,
      }),
    },
    {
      path: '/shinenew/:ticketId',
      name: 'shinenew',
      component: ShineNew,
      meta: { index: 775 },
      props: route => ({
        ticketId: route.params.ticketId,
      }),
    },
    {
      path: '/result',
      name: 'result',
      component: Result,
      meta: { index: 500 },
    },
    {
      path: '/member',
      name: 'member',
      component: Member,
      meta: { index: 800 },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { index: 801 },
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: { index: 810 },
      children: [
        {
          path: 'app',
          component: AppPayment,
          meta: { index: 811 },
        },
        {
          path: 'alipay',
          component: AliPayment,
          meta: { index: 812 },
        },
        {
          path: 'scan',
          component: ScanPayment,
          meta: { index: 813 },
        },
        {
          path: 'online',
          component: OnlinePayment,
          meta: { index: 814 },
        },
        {
          path: 'transfer',
          component: TransferPayment,
          meta: { index: 815 },
        },
        {
          path: 'virtual',
          component: VirtualPayment,
          meta: { index: 816 },
        },
      ],
    },
    {
      path: '/retrypayment',
      name: 'retrypayment',
      component: RetryPayment,
      meta: { index: 821 },
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: Withdraw,
      meta: { index: 830 },
    },
    {
      path: '/rebate',
      name: 'rebate',
      component: Rebate,
      meta: { index: 840 },
    },
    {
      path: '/rebatedetail',
      name: 'rebatedetail',
      component: RebateDetail,
      meta: { index: 841 },
    },
    {
      path: '/bank',
      name: 'bank',
      component: Bank,
      meta: { index: 880 },
    },
    {
      path: '/query',
      name: 'query',
      component: Query,
      meta: { index: 890 },
    },
    {
      path: '/report/:type',
      name: 'report',
      component: Report,
      props: true,
      meta: { index: 891 },
    },
    {
      path: '/portal',
      name: 'portal',
      component: Portal,
      props: true,
      meta: { index: 990 },
    },
    {
      path: '/customer-service',
      name: 'customer-service',
      component: CustomerService,
      meta: { index: 999 },
    },
  ],
});
