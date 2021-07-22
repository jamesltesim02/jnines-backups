import Signin from './Sign/In';
import Signup from './Sign/Up';
import SlideDescription from './SlideDescription';
import MemberCenter from './Member/MemberCenter';
import Payment from './Member/Payment';
import PayResult from './Member/Payment/PayResult';
import Rebate from './Member/Rebate';
import Withdraw from './Member/Withdraw';
import Report from './Member/Report';
import Bank from './Member/Bank';
import CheckMobile from './Member/Bank/CheckMobile';
import BindBankCard from './Member/Bank/BindBankCard';

export default {
  '/signin': Signin,
  '/signup': Signup,
  '/member': MemberCenter,
  '/member/payment': Payment,
  '/member/payresult': PayResult,
  '/member/rebate': Rebate,
  '/member/withdraw': Withdraw,
  '/member/report': Report,
  '/member/bank': Bank,
  '/member/bank/mobile': CheckMobile,
  '/member/bank/bind': BindBankCard,
  '/signin/slidedesc': SlideDescription,
  '/member/slidedesc': SlideDescription,
};
