import React from 'react';
import copy from "copy-to-clipboard";
import { useIntl } from "react-intl";
import { Toast } from "antd-mobile";
import RechargeFinished from './RechargeFinished';
import OnlineCustomerService from '../../../../components/common/OnlineCustomerService';

function QrResult (
  {
    result,
    onCancel = () => {}
  }: {
    result: any,
    onCancel: () => void
  }
) {
  const intl = useIntl();
  const [finished, setFinished] = React.useState(false);

  const handleCopy = (ticketId: string) => {
    if (copy(ticketId)) {
      Toast.success(intl.formatMessage({id: 'ticket.copy_success'}))
    } else {
      Toast.fail(intl.formatMessage({id: 'ticket.copy_failed'}))
    }
  }

  if (finished) {
    return <RechargeFinished />;
  }

  return (
    <div className="qr-result">
      <header>
        <label>充值金额:</label>
        <span>{result.amount}USDT</span>
      </header>
      <div className="tips">
        若完成支付,同场2小时内到账
      </div>
      <section className="result-content">
        <img
          src={`data:image/png;base64,${result.qrCodeBase64}`}
        />
        {
          result.genre === 'scan' ? (
            <>
              <div className="scan-address">
                <span>{result.qrCode}</span>
                <button onClick={() => handleCopy(result.qrCode)}>复制</button>
              </div>
              <p className="qrcode-tip ">
                使用<b>数字钱包APP</b>扫码，或复制上方钱包地址转币
              </p>
              <p className="second-tip">请勿充值非ERC20协议资产，否则资产不可找回</p>
            </>
          ) : (
            <>
              <p className="method-title">方式一</p>
              <p className="qrcode-tip">
                使用小金库钱包APP<b>扫描二维码</b>支付
              </p>
              <p className="method-title">方式二</p>
              <p className="qrcode-tip">
                点击此处进行
                <a
                  target="_blank"
                  href={result.htmlUrl}
                >
                  <i className="iconfont iconlink"></i>网页快速支付
                </a>
              </p>
            </>
          )
        }
      </section>
      <div className="btn-group">
        <button
          className="btn-cancel"
          onClick={onCancel}
        >重新填写</button>  
        <button
          className="btn-success"
          onClick={() => setFinished(true)}
        >已完成支付</button>  
      </div>
      <OnlineCustomerService className="helper" />
    </div>
  );
}

export default QrResult;
