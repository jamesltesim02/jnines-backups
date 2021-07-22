import React from 'react';

import Image1 from './images/guide-step-1-1@2x.jpg';
import Image2 from './images/guide-step-1-2@2x.jpg';

function UsdtStep1 () {
  return (
    <div className="usdt-step-1">
      <div className="content-block">
        <h3>什么是USDT（泰达币）？</h3>
        <p>USDT是一种和美元挂钩的虚拟货币，每个USDT都由母公司抵押的1美元支持。可以有效防止加密货币出现价格大幅波动。基本 1USDT = 1美元。</p>
      </div>
      <div className="content-block">
        <h3>使用USDT很简单</h3>
        <p>USDT充值其实和人民币充值原理大同小异，通过下面两种模式的对比您会很快学会使用USDT充值。</p>
        <div className="images">
          <span><img src={Image1} /></span>
          <span><img src={Image2} /></span>
        </div>
      </div>
      <div className="tips">其实只是收付款方式从银行卡变成了数字钱包，数字钱包是什么，又要怎么获得数字钱包呢？</div>
    </div>
  );
}

export default UsdtStep1;
