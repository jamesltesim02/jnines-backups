import React from 'react';
import { useIntl } from 'react-intl';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { Icon, Modal, Toast } from 'antd-mobile';
import fromPairs from 'lodash/fromPairs';

import mergeClass from '../../../../utils/mergeClass';

import { useApi } from '../../../../apis';
import Payment, { PaymentGenres, PaymentGenre, PaymentProtocol } from '../../../../apis/Payment'

import NavBar from '../../../../components/common/NavBar';
import LoadingBar from '../../../../components/common/LoadingBar';

import IconDcBox from './icons/IconDcBox';
import IconThumb from './icons/IconThumb';
import IconUSDT from './icons/IconUSDT';
import IconWechatpay from './icons/IconWechatpay';
import IconUnionpay from './icons/IconUnionpay';
import IconAlipay from './icons/IconAlipay';
import IconKyberbit from './icons/kyberbit@2x.png';

import ProtocolDescription from './icons/protocol_description.png';

import QrResult from './QrResult';
import CnyRecharge from './CnyRecharge';
import Dialog from '../../../../components/member/Dialog';
import J9Button from '../../../../components/common/J9Button';
import memberStore from '../../../../stores/member';
import { toMainSite } from '../../../../utils/MainSiteUtils';
import RealnameDialog from '../../../../components/member/RealnameDialog';

const genreTips: Record<string, string> = {
  dcBox: '官方合作 到账快',
  scan: '倾注于你选择对应协议'
};

const genreIcons: Record<string, any> = {
  dcBox: <IconDcBox />,
  scan: <IconUSDT />
};

// 充值金额列表
const AMOUNT_LIST = [
  '20',
  '100',
  '500',
  '2000',
  '5000',
  '10000'
];

/** 充值页面分块组建 */
export function RechargeBlock (
  {
    title,
    className,
    children
  }: {
    title?: string,
    className?: string,
    children?: any
  }
) {
  return (
      <fieldset className={mergeClass('recharge-block', className)}>
        <legend>{title}</legend>
        {children}
      </fieldset>
  );
}

/** 充值页面 */
function Recharge () {

  const history = useHistory();
  const realnameRef = React.useRef<any>();
  // 充值接口对象
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  const [loading, setLoading] = React.useState(true);
  // 整理后的充值类型
  const [paymentGenres, setPaymentGenres] = React.useState<Record<string, PaymentGenre>>({})

  const [submiting, setSubmiting] = React.useState(false);
  const [usdtGenres, setUsdtGenres] = React.useState<Array<PaymentGenre>>([]);
  const [currentGenre, setCurrentGenre] = React.useState<PaymentGenre>();
  const [currentProtocol, setCurrentProtocol] = React.useState<PaymentProtocol>();
  const [amount, setAmount] = React.useState<string>('');

  const [result, setResult] = React.useState<any>(null);
  const [protocolDialogOpen, setProtocolDialogOpen] = React.useState(false);

  const [otherPaymentDialog, setOtherPaymentDialog] = React.useState(false);
  const [visitedOtherPayment, setVisitedOtherPayment] = React.useState(false);

  // 提交存款
  const handleSubmit = async () => {
    if (!amount) {
      return;
    }

    // 如果是其他充值类型 则直接显示二维码
    if (currentGenre?.code === PaymentGenres.SCAN_PAYMENT) {
      setResult({
        genre: currentGenre?.code,
        qrCode: currentProtocol?.qrCode,
        qrCodeBase64: currentProtocol?.base64Qrcode,
        protocol: currentProtocol?.name,
        amount
      });
      return;
    }

    try {
      setSubmiting(true);
      const rechargeResult = await payment.dcBox({
        payId: currentProtocol?.payId as string,
        virtualAmount: Number(amount),
        rate: currentGenre?.rate as  number
      });
      setResult(rechargeResult);
    } finally {
      setSubmiting(false);
    }
  };

  // 加载充值通道数据
  React.useEffect(
    () => {
      (async () => {
        if (!realnameRef.current) {
          return;
        }
        const verified = await realnameRef.current?.checkVerify();
        if (!verified) {
          history.replace('/tab/member');
          return;
        }
      })();

      setLoading(true);
      payment.channels().then(
        result => {
          const genres = fromPairs(
            result.map(genre => [genre.code, genre])
          )
          const genreList = [
            genres.dcBox,
            genres.scan
          ].filter(Boolean);

          setPaymentGenres(genres);
          setUsdtGenres(genreList);
          setCurrentGenre(genreList[0]);
          setCurrentProtocol(genreList[0].payChannels[0].protocols[0]);
        }
      ).finally(
        () => setLoading(false)
      );
    },
    [setLoading]
  );

  return (
    <>
      <NavBar
        title="充值"
        center
      />
      {
        loading ? (
          <div className="scrollable-match-list fullscreen">
            <LoadingBar className="full" />
          </div>
        ) : (
          Boolean(result) ? (
            <QrResult
              result={result}
              onCancel={() => setResult(null)}
            />
          ) : (
            <>
              <Switch>
                {/* 人民币存款路由 */}
                <Route path="/member/recharge/cny">
                  <CnyRecharge
                    bankcard={paymentGenres[PaymentGenres.BANK_CARD]}
                    alipay={paymentGenres[PaymentGenres.ALIPAY]}
                  />
                </Route>
                {/* 存款首页(包含USDT直接充值) */}
                <Route exact>
                  <>
                    {/* 贵宾专享 */}
                    <RechargeBlock
                      title="贵宾专享"
                      className="vip-genre"
                    >
                      <Link
                        to="/member/recharge/cny"
                        className="to-pay-item"
                      >
                        <label>人民币充值</label>
                        <span>银行卡/支付宝/微信直接充值</span>
                        <Icon
                          type="right"
                          size="md"
                        />
                      </Link>
                    </RechargeBlock>
                    {/* 我没有USDT */}
                    <RechargeBlock
                      title="我没有USDT"
                      className="buy-usdt"
                    >
                      <Link
                        to="/member/usdt-guide"
                        className="to-pay-item"
                      >
                        <label>买入USDT</label>
                        <span>
                          <IconWechatpay />
                          <IconUnionpay />
                          <IconAlipay />
                        </span>
                        <Icon
                          type="right"
                          size="md"
                        />
                      </Link>
                      <Link
                        to="/member/usdt-guide"
                        className="kyberbit-item"
                      >
                        <img src={IconKyberbit} />
                        <span>可直接人民币充值到九游会</span>
                      </Link>
                    </RechargeBlock>
                    {/* 我有USDT */}
                    {
                      usdtGenres.length > 0 ? (
                        <>
                          <RechargeBlock
                            title="我有USDT&nbsp;&nbsp;"
                            className="have-usdt"
                          >
                            <header>
                              USDT快速充值
                              <span>（1USDT≈{currentGenre?.rate}RMB）</span>
                            </header>
                            <div className="genres">
                              {
                                usdtGenres.map(genre => (
                                  <button
                                    key={genre.code}
                                    className={genre === currentGenre ? 'active' : undefined}
                                    onClick={() => {
                                      if (genre.code === PaymentGenres.SCAN_PAYMENT) {
                                        setOtherPaymentDialog(true);
                                        return;
                                      }
                                      setCurrentGenre(genre);
                                      setCurrentProtocol(genre.payChannels[0]?.protocols[0]);
                                    }}
                                  >
                                    <div>
                                      {genreIcons[genre.code]}
                                      <span>{genre.name}</span>
                                      {
                                        genre.code === PaymentGenres.DC_BOX
                                        ? (<i><IconThumb />推荐</i>)
                                        : null
                                      }
                                    </div>
                                    <label>{genreTips[genre.code]}</label>
                                  </button>
                                ))
                              }
                            </div>
                            {
                              currentGenre?.code === PaymentGenres.SCAN_PAYMENT ? (
                                <div className="protocol">
                                  <label>
                                    选择协议
                                    <button
                                      className="help-button"
                                      onClick={() => setProtocolDialogOpen(true)}
                                    >
                                      <i>?</i>
                                    </button>
                                  </label>
                                  <div>
                                    {
                                      currentGenre?.payChannels[0].protocols?.map(protocol => (
                                        <button
                                          key={protocol.payId}
                                          className={
                                            protocol === currentProtocol ? 'active' : undefined
                                          }
                                          onClick={() => setCurrentProtocol(protocol)}
                                        >
                                          {protocol.name}
                                          <i />
                                        </button>
                                      ))
                                    }
                                  </div>
                                </div>
                              ) : null
                            }
                            <div className="amount">
                              <header>
                                <label>充值金额</label>
                                <span>≈人民币 ¥{(Number(currentGenre?.rate) * Number(amount || '0')).toFixed(2)}</span>
                              </header>
                              <div className="input-text">
                                <input
                                  type="text"
                                  value={amount}
                                  placeholder="请输入充值金额，或在下方选择"
                                  onChange={
                                    ({ target: { value } }) => {
                                      const newValue = value.replace(/\D+/g, '');
                                      setAmount(
                                        newValue === '0'
                                        ? ''
                                        : newValue
                                      );
                                    }
                                  }
                                />
                                <span>USDT</span>
                              </div>
                              <div className="quick-amount">
                                {
                                  AMOUNT_LIST.map(item => (
                                    <button
                                      key={item}
                                      onClick={() => setAmount(item)}
                                      className={item === amount ? 'active' : undefined}
                                    >{item}</button>
                                  ))
                                }
                              </div>
                            </div>
                          </RechargeBlock>
                          <div className="recharge-submit">
                            <J9Button
                              submit
                              loading={submiting}
                              available={Boolean(amount)}
                              onClick={
                                Boolean(amount)
                                ? handleSubmit
                                : undefined
                              }
                            >确认提交</J9Button>
                          </div>
                        </>
                      ) : null
                    }
                  </>
                </Route>
              </Switch>
              <Dialog
                open={protocolDialogOpen}
                onClose={() => setProtocolDialogOpen(false)}
                className="protocol-description-dialog"
                closeButton
              >
                <img src={ProtocolDescription} />
              </Dialog>
              <Dialog
                open={otherPaymentDialog}
                onClose={() => {
                  setOtherPaymentDialog(false);
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
                        setOtherPaymentDialog(false);
                        setVisitedOtherPayment(false);
                        memberStore.creditTransfering = true;
                      }}
                    >已完成,立即转入</button>
                  ) : (
                    <button
                      className="submit available single-submit"
                      onClick={() => {
                        toMainSite('ucenter/pay/u_deposit.html#qrcodeDesk', true);
                        setVisitedOtherPayment(true);
                      }}
                    >立即前往</button>
                  )
                }
              </Dialog>
            </>
          )
        )
      }
      <RealnameDialog ref={realnameRef} />
    </>
  );
}

export default Recharge;
