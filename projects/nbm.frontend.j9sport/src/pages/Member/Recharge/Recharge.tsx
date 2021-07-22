import { message } from 'antd';
import { fromPairs } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useApi } from '../../../apis';
import Payment, { PaymentGenre, PaymentGenres, PaymentProtocol } from '../../../apis/Payment';
import LoadingBar from '../../../components/common/LoadingBar';
import MemberLayout from '../../../components/member/MemberLayout';

import IconWechatpay from './images/icon-wechatpay.svg';
import IconAlipay from './images/icon-alipay.svg';
import IconUnionpay from './images/icon-unionpay.svg';

import IconMarkets from './Icons/IconMarkets';
// import IconUsdtGuide from './Icons/IconUsdtGuide';
import IconDcbox from './Icons/IconDcbox';
import IconOtherwallet from './Icons/IconOtherwallet';
import IconTransfer from './Icons/IconTransfer';
import IconQrscan from './Icons/IconQrscan';
import mergeClass from '../../../utils/mergeClass';

import MarketsPage from './Markets';
import RechargeUsdt from './RechargeUsdt';
import CnyRecharge from './CnyRecharge';
import UsdtGuide from './UsdtGuide';
import Dialog from '../../../components/member/Dialog';
import { toMainSite } from '../../../utils/MainSiteUtils';

import memberStore from '../../../stores/member';

function RechargeLink (
  {
    to,
    children,
    className
  }: {
    to: string,
    children: any,
    className?: string
  }
) {
  const location = useLocation();

  return (
    <Link
      to={to}
      replace
      className={
        mergeClass(
          className,
          location.pathname === to
          ? 'active'
          : undefined
        )
      }
    >
      {children}
    </Link>
  );
}

export function OtherPaymentDialog (
  {
    open,
    onClose
  }: {
    open: boolean,
    onClose: () => void
  }
) {
  const [visitedOtherPayment, setVisitedOtherPayment] = React.useState(false);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setVisitedOtherPayment(false);
      }}
      closeButton
    >
      <p>暂不支持该充值方式,您可以前往九游会主站完成充值.</p>
      {
        visitedOtherPayment ? (
          <button
            className="submit available single-submit"
            onClick={() => {
              onClose();
              setVisitedOtherPayment(false);
              memberStore.creditTransfering = true;
            }}
          >已完成,立即转入</button>
        ) : (
          <button
            className="submit available single-submit"
            onClick={() => {
              toMainSite('ucenter/pay/payIndex/#qrcodeDesk', true);
              setVisitedOtherPayment(true);
            }}
          >立即前往</button>
        )
      }
    </Dialog>
  );
}

function RechargeBlock (
  {
    title,
    children,
    className,
  }: {
    title: string,
    children: any,
    className: string,
  }
) {
  return (
    <fieldset className={className}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

function Recharge () {
  const intl = useIntl();

  // 充值接口对象
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  const [loading, setLoading] = React.useState(true);
  // 整理后的充值类型
  const [paymentGenres, setPaymentGenres] = React.useState<Record<string, PaymentGenre>>({});

  const [otherPaymentDialog, setOtherPaymentDialog] = React.useState(false);

  // 加载充值通道数据
  React.useEffect(
    () => {
      setLoading(true);
      // 查询充值渠道列表
      payment.channels().then(
        result => {
          // 将充值渠道转换为键值对的对象
          const genres = fromPairs(
            result.map(genre => [genre.code, genre])
          );
          setPaymentGenres(genres);
        }
      ).finally(
        () => setLoading(false)
      );
    },
    [setLoading]
  );

  // 还未加载完成则显示为loading
  if (loading) {
    return <LoadingBar />;
  }

  return (
    <MemberLayout
      title="充值"
      subTitle="DEPOSIT"
      className="seperated recharge-page"
    >
      <div className="left-bar">
        <RechargeBlock
          title="我没有USDT"
          className="no-usdt"
        >
          <header>
            <span>买入USDT</span>
            <img src={IconWechatpay} />
            <img src={IconAlipay} />
            <img src={IconUnionpay} />
          </header>
          <label>在此您可快速将人民币转化为USDT</label>
          <RechargeLink to="/member/recharge/markets">
            <IconMarkets />
            <div><span>交易所买币</span></div>
          </RechargeLink>
          {/* 其他钱包 */}
          {
            // paymentGenres[PaymentGenres.SCAN_PAYMENT] ? (
            //   <RechargeLink to="/member/recharge/usdt-guide">
            //     <IconUsdtGuide />
            //     <div>
            //       <span>充值引导</span>
            //       <label>跟随引导完成买币、充值</label>
            //     </div>
            //   </RechargeLink>
            // ) : null
          }
        </RechargeBlock>
        {/* 我有USDT */}
        {
          (
            paymentGenres[PaymentGenres.DC_BOX]
            ||
            paymentGenres[PaymentGenres.SCAN_PAYMENT]
          ) ? (
            <RechargeBlock
              title="我有USDT"
              className="have-usdt"
            >
              <header>USDT快速充值</header>
              <label>如持有USDT，选择以下方式充值到九游会</label>
              {/* 小金库 */}
              {
                paymentGenres[PaymentGenres.DC_BOX] ? (
                  <RechargeLink to="/member/recharge/dcbox">
                    <IconDcbox />
                    <div>
                      <span>小金库</span>
                      <label>官方合作 到账快</label>
                    </div>
                    <i>荐</i>
                  </RechargeLink>
                ) : null
              }
              {/* 其他钱包 */}
              {
                paymentGenres[PaymentGenres.SCAN_PAYMENT] ? (
                  // <RechargeLink to="/member/recharge/other-wallet">
                  //   <IconOtherwallet />
                  //   <div>
                  //     <span>其他钱包</span>
                  //     <label>请注意选择对应协议</label>
                  //   </div>
                  // </RechargeLink>
                  <a onClick={() => setOtherPaymentDialog(true)}>
                    <IconOtherwallet />
                    <div>
                      <span>其他钱包</span>
                      <label>请注意选择对应协议</label>
                    </div>
                  </a>
                ) : null
              }
            </RechargeBlock>
          ) : null
        }
        {/* 贵宾专享分类 */}
        {
          (
            // (
            //   paymentGenres[PaymentGenres.BANK_CARD]
            //   &&
            //   paymentGenres[PaymentGenres.BANK_CARD].payChannels?.length
            // )
            // ||
            // (
            //   paymentGenres[PaymentGenres.ALIPAY]
            //   &&
            //   paymentGenres[PaymentGenres.ALIPAY].payChannels?.length
            // )
            true
          ) ? (
            <RechargeBlock
              title="贵宾专享"
              className="cny-channel"
            >
              <header>人民币充值</header>
              <label>尊敬的贵宾，您可以直接使用人民币充值</label>
              {/* 转账充值(银行卡转账) */}
              {
                // (
                //   paymentGenres[PaymentGenres.BANK_CARD]
                //   &&
                //   paymentGenres[PaymentGenres.BANK_CARD].payChannels?.length
                // ) ? (
                  <RechargeLink to="/member/recharge/transfer">
                    <IconTransfer />
                    <div>
                      <span>转账充值</span>
                      <label>支付宝、微信、银行卡</label>
                    </div>
                  </RechargeLink>
                // ) : null
              }
              {/* 支付宝扫码 */}
              {
                // (
                //   paymentGenres[PaymentGenres.ALIPAY]
                //   &&
                //   paymentGenres[PaymentGenres.ALIPAY].payChannels?.length
                // ) ? (
                  <RechargeLink to="/member/recharge/qrcode">
                    <IconQrscan />
                    <div><span>支付宝扫码</span></div>
                  </RechargeLink>
                // ) : null
              }
            </RechargeBlock>
          ) : null
        }
      </div>
      <div className="right-bar">
        <Switch>
          {/* 默认显示路由内容 */}
          <Route exact path="/member/recharge/">
            <Redirect to="/member/recharge/markets" />
          </Route>
          {/* 交易所买币 */}
          <Route exact path="/member/recharge/markets">
            <MarketsPage />
          </Route>
          {/* 充值引导 */}
          <Route path="/member/recharge/usdt-guide">
            <UsdtGuide genre={paymentGenres[PaymentGenres.SCAN_PAYMENT]} />
          </Route>
          {/* 小金库 */}
          <Route path="/member/recharge/dcbox">
            <RechargeUsdt
              key="dcbox"
              genre={paymentGenres[PaymentGenres.DC_BOX]}
            />
          </Route>
          {/* 其他钱包 */}
          <Route path="/member/recharge/other-wallet">
            <RechargeUsdt
              key="usdt"
              genre={paymentGenres[PaymentGenres.SCAN_PAYMENT]}
            />
          </Route>
          {/* 银行卡充值 */}
          {
            Boolean(paymentGenres[PaymentGenres.BANK_CARD]) ? (
              <Route path="/member/recharge/transfer">
                <CnyRecharge
                  genre={paymentGenres[PaymentGenres.BANK_CARD]}
                />
              </Route>
            ) : null
          }
          {/* 支付宝充值 */}
          {
            Boolean(paymentGenres[PaymentGenres.ALIPAY]) ? (
              <Route path="/member/recharge/qrcode">
              <CnyRecharge
                genre={paymentGenres[PaymentGenres.ALIPAY]}
              />
              </Route>
            ) : null
          }
        </Switch>
      </div>
      <OtherPaymentDialog
        open={otherPaymentDialog}
        onClose={() => setOtherPaymentDialog(false)}
      />
    </MemberLayout>
  );
}

export default Recharge;
