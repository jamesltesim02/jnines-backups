import React from 'react';

import Image from './images/guide-step-2@2x.jpg';

function UsdtStep1 () {
  return (
    <div className="usdt-step-2">
      <div className="content-block">
        <h3>数字钱包是什么？</h3>
        <p>现实生活中钱包是用来放钱的，您可以简单的理解为数字钱包就是存放您USDT的一种工具。您需要有一个数字钱包才能完成转账充值。</p>
      </div>
      <div className="images">
        <img src={Image} />
      </div>
      <div className="tips">您现在已经拥有了一个数字钱包，只差获得一些USDT就可以给九游充值啦。</div>
    </div>
  );
}

export default UsdtStep1;
