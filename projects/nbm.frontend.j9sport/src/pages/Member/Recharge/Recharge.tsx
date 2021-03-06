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
      <p>???????????????????????????,??????????????????????????????????????????.</p>
      {
        visitedOtherPayment ? (
          <button
            className="submit available single-submit"
            onClick={() => {
              onClose();
              setVisitedOtherPayment(false);
              memberStore.creditTransfering = true;
            }}
          >?????????,????????????</button>
        ) : (
          <button
            className="submit available single-submit"
            onClick={() => {
              toMainSite('ucenter/pay/payIndex/#qrcodeDesk', true);
              setVisitedOtherPayment(true);
            }}
          >????????????</button>
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

  // ??????????????????
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  const [loading, setLoading] = React.useState(true);
  // ????????????????????????
  const [paymentGenres, setPaymentGenres] = React.useState<Record<string, PaymentGenre>>({});

  const [otherPaymentDialog, setOtherPaymentDialog] = React.useState(false);

  // ????????????????????????
  React.useEffect(
    () => {
      setLoading(true);
      // ????????????????????????
      payment.channels().then(
        result => {
          // ??????????????????????????????????????????
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

  // ??????????????????????????????loading
  if (loading) {
    return <LoadingBar />;
  }

  return (
    <MemberLayout
      title="??????"
      subTitle="DEPOSIT"
      className="seperated recharge-page"
    >
      <div className="left-bar">
        <RechargeBlock
          title="?????????USDT"
          className="no-usdt"
        >
          <header>
            <span>??????USDT</span>
            <img src={IconWechatpay} />
            <img src={IconAlipay} />
            <img src={IconUnionpay} />
          </header>
          <label>???????????????????????????????????????USDT</label>
          <RechargeLink to="/member/recharge/markets">
            <IconMarkets />
            <div><span>???????????????</span></div>
          </RechargeLink>
          {/* ???????????? */}
          {
            // paymentGenres[PaymentGenres.SCAN_PAYMENT] ? (
            //   <RechargeLink to="/member/recharge/usdt-guide">
            //     <IconUsdtGuide />
            //     <div>
            //       <span>????????????</span>
            //       <label>?????????????????????????????????</label>
            //     </div>
            //   </RechargeLink>
            // ) : null
          }
        </RechargeBlock>
        {/* ??????USDT */}
        {
          (
            paymentGenres[PaymentGenres.DC_BOX]
            ||
            paymentGenres[PaymentGenres.SCAN_PAYMENT]
          ) ? (
            <RechargeBlock
              title="??????USDT"
              className="have-usdt"
            >
              <header>USDT????????????</header>
              <label>?????????USDT???????????????????????????????????????</label>
              {/* ????????? */}
              {
                paymentGenres[PaymentGenres.DC_BOX] ? (
                  <RechargeLink to="/member/recharge/dcbox">
                    <IconDcbox />
                    <div>
                      <span>?????????</span>
                      <label>???????????? ?????????</label>
                    </div>
                    <i>???</i>
                  </RechargeLink>
                ) : null
              }
              {/* ???????????? */}
              {
                paymentGenres[PaymentGenres.SCAN_PAYMENT] ? (
                  // <RechargeLink to="/member/recharge/other-wallet">
                  //   <IconOtherwallet />
                  //   <div>
                  //     <span>????????????</span>
                  //     <label>???????????????????????????</label>
                  //   </div>
                  // </RechargeLink>
                  <a onClick={() => setOtherPaymentDialog(true)}>
                    <IconOtherwallet />
                    <div>
                      <span>????????????</span>
                      <label>???????????????????????????</label>
                    </div>
                  </a>
                ) : null
              }
            </RechargeBlock>
          ) : null
        }
        {/* ?????????????????? */}
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
              title="????????????"
              className="cny-channel"
            >
              <header>???????????????</header>
              <label>??????????????????????????????????????????????????????</label>
              {/* ????????????(???????????????) */}
              {
                // (
                //   paymentGenres[PaymentGenres.BANK_CARD]
                //   &&
                //   paymentGenres[PaymentGenres.BANK_CARD].payChannels?.length
                // ) ? (
                  <RechargeLink to="/member/recharge/transfer">
                    <IconTransfer />
                    <div>
                      <span>????????????</span>
                      <label>??????????????????????????????</label>
                    </div>
                  </RechargeLink>
                // ) : null
              }
              {/* ??????????????? */}
              {
                // (
                //   paymentGenres[PaymentGenres.ALIPAY]
                //   &&
                //   paymentGenres[PaymentGenres.ALIPAY].payChannels?.length
                // ) ? (
                  <RechargeLink to="/member/recharge/qrcode">
                    <IconQrscan />
                    <div><span>???????????????</span></div>
                  </RechargeLink>
                // ) : null
              }
            </RechargeBlock>
          ) : null
        }
      </div>
      <div className="right-bar">
        <Switch>
          {/* ???????????????????????? */}
          <Route exact path="/member/recharge/">
            <Redirect to="/member/recharge/markets" />
          </Route>
          {/* ??????????????? */}
          <Route exact path="/member/recharge/markets">
            <MarketsPage />
          </Route>
          {/* ???????????? */}
          <Route path="/member/recharge/usdt-guide">
            <UsdtGuide genre={paymentGenres[PaymentGenres.SCAN_PAYMENT]} />
          </Route>
          {/* ????????? */}
          <Route path="/member/recharge/dcbox">
            <RechargeUsdt
              key="dcbox"
              genre={paymentGenres[PaymentGenres.DC_BOX]}
            />
          </Route>
          {/* ???????????? */}
          <Route path="/member/recharge/other-wallet">
            <RechargeUsdt
              key="usdt"
              genre={paymentGenres[PaymentGenres.SCAN_PAYMENT]}
            />
          </Route>
          {/* ??????????????? */}
          {
            Boolean(paymentGenres[PaymentGenres.BANK_CARD]) ? (
              <Route path="/member/recharge/transfer">
                <CnyRecharge
                  genre={paymentGenres[PaymentGenres.BANK_CARD]}
                />
              </Route>
            ) : null
          }
          {/* ??????????????? */}
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
