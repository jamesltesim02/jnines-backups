import React from 'react';
import copy from "copy-to-clipboard";
import { useIntl } from "react-intl";
import { message } from 'antd';

function QrResult (
  {
    result,
    onCancel = () => {},
    onFinish = () => {}
  }: {
    result: any,
    onCancel: () => void,
    onFinish: () => void
  }
) {
  const intl = useIntl();

  const handleCopy = (ticketId: string) => {
    if (copy(ticketId)) {
      message.success(intl.formatMessage({id: 'ticket.copy_success'}));
    } else {
      message.warn(intl.formatMessage({id: 'ticket.copy_failed'}));
    }
  }

  if (!result) {
    return null;
  }

  return (
    <section className="qr-result">
      <img
        src={`data:image/png;base64,${result.qrCodeBase64}`}
      />
      <div className="qr-content">
        <h3>
          <label>充值金额:</label>
          <span>{result.amount}USDT</span>
        </h3>
        {
          result.genre === 'scan' ? (
            <>
              <div className="remark">使用<b>数字钱包APP</b>扫码，或复制下方<b>钱包地址</b>转币</div>
              <div className="tips">*请勿充值非ERC20协议资产，否则资产不可找回</div>
              <div className="address">
                <span className="input">
                  <input
                    type="text"
                    readOnly
                    value={result.qrCode}
                  />
                </span>
                <button onClick={() => handleCopy(result.qrCode)}>复制</button>
              </div>
            </>
          ) : (
            <>
              <div className="scan-type">
                <label>方式一:</label>
                <span>使用小金库钱包APP<b>扫描左侧二维码</b>进行支付</span>
              </div>
              <div className="scan-type">
                <label>方式二:</label>
                <span>点击此处进行<a target="_blank" href={result.htmlUrl}>网页快速支付</a></span>
              </div>
            </>
          )
        }
        <div className="buttons">
          <button
            className="cancel"
            onClick={onCancel}
          >取消支付</button>
          <button
            className="submit available"
            onClick={onFinish}
          >已完成支付</button>
        </div>
      </div>
    </section>
  );
}

export default QrResult;
