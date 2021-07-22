import React from 'react';
import copy from 'copy-to-clipboard'
import { PaymentGenre } from '../../../../apis/Payment';
import AmountList from '../../../../components/member/Recharge/AmountList';
import ProtocolList from '../../../../components/member/Recharge/ProtocolList';
import mergeClass from '../../../../utils/mergeClass';

import Image1 from './images/guide-step-4-1@2x.jpg';
import Image2 from './images/guide-step-4-2@2x.jpg';
import Image3 from './images/guide-step-4-3@2x.jpg';

import LinearUsdtImage from '../images/icon-linear-usdt.svg';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

function UsdtStep4 (
  { genre }: { genre: PaymentGenre }
) {
  const intl = useIntl();
  const history = useHistory();

  const [amount, setAmount] = React.useState('');
  const [protocol, setProtocol] = React.useState(genre.payChannels[0].protocols[0])
  const [finished, setFinished] = React.useState(false);

  return (
    <div className="usdt-step-4">
      <div className="content-block">
        <h3>一切就绪！让我们开始第一笔充值吧。</h3>
        <p>第一步：输入充值金额，获得收款方钱包地址：点击 “ 确认提交 ” 即可获得 收款方钱包地址</p>
        {
          finished ? (
            <div className="reseult">
              <div className="content">
                <img src={`data:image/png;base64,${protocol.base64Qrcode}`} />
                <div>
                  <div className="result-amount">
                    <label>充值金额:</label>
                    <span>{amount}USDT</span>
                  </div>
                  <div className="tip1">使用<b>数字钱包APP扫码</b>，或复制下方<b>钱包地址</b>转币</div>
                  <div className="tip2">*请勿充值非ERC20协议资产，否则资产不可找回</div>
                  <div className="address">
                    <label>{protocol.qrCode}</label>
                    <button
                      onClick={() => {
                        if (copy(protocol.qrCode)) {
                          message.success(
                            intl.formatMessage({ id: 'common.copy_success' })
                          );
                        } else {
                          message.warning(
                            intl.formatMessage({ id: 'common.copy_fail' })
                          );
                        }
                      }}
                    >复制</button>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button
                  className="submit full-single-submit available"
                  onClick={() => setFinished(false)}
                >
                  重新填写金额
                </button>
              </div>
            </div>
          ) : (
            <div className="recharge-form">
              <label>
                选择协议
                <button>?</button>
              </label>
              <ProtocolList
                protocols={genre.payChannels[0].protocols}
                current={protocol}
                onChange={setProtocol}
              />
              {/* TODO 汇率获取 */}
              <label>
                充值金额
                <span>（参考汇率 1USDT≈{genre.rate}RMB）</span>
              </label>
              <AmountList
                value={amount}
                onChange={setAmount}
              />
              <div className="amount-input">
                <img src={LinearUsdtImage} />
                <span className="input">
                  <input
                    type="text"
                    value={amount}
                    onChange={({ target: { value } }) => setAmount(value)}
                  />
                </span>
                <span>USDT</span>
              </div>
              <div className="exchanged-amount">
                ≈人民币¥{(Number(amount || '0') * genre.rate).toFixed(2)}
              </div>
              <div className="buttons">
                <button
                  className={mergeClass({
                    submit: true,
                    'full-single-submit': true,
                    available: Number(amount || '0') > 0
                  })}
                  onClick={() => setFinished(true)}
                >确认提交</button>
              </div>
            </div>
          )
        }
        <p>第二步：用交易所钱包给收款方钱包转账</p>
        <div className="images">
          <ul>
            <li>
              <img src={Image1} />
              <label>1. 选择现货账户</label>
            </li>
            <li>
              <img src={Image2} />
              <label>2. 选择USDT提现</label>
            </li>
            <li>
              <img src={Image3} />
              <label>3. 填入信息，提交等待充值完成</label>
            </li>
          </ul>
        </div>
      </div>
      <div className="tips">恭喜您已经完成了第一笔USDT充值，稍作等待，当充值成功后2USDT会以红包的形式发送给您</div>
      <div className="next-button">
        <button
          onClick={() => history.push('/member/amount-records')}
        >查看订单状态</button>
      </div>
    </div>
  );
}

export default UsdtStep4;
