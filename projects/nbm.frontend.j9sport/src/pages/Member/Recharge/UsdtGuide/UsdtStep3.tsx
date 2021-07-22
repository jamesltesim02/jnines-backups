import React from 'react';

function UsdtStep1 () {
  return (
    <div className="usdt-step-3">
      <div className="content-block">
        <h3>现在只差往钱包里放一些USDT就可以充值了</h3>
        <p>跟随视频，只用2分钟就可以快速获得自己的第一笔USDT。</p>
      </div>
      <div className="videos">
        <video
          src="/assets/videos/usdt2.mp4"
          poster="/assets/videos/usdt2.jpeg"
          controls
        />
      </div>
      <div className="tips">只差最后一步就可以完成充值了。</div>
    </div>
  );
}

export default UsdtStep1;
