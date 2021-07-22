import React from 'react';
import { useHistory } from 'react-router';
import { useApi } from '../../../../../apis';
import Cms, { UsdtMarket } from '../../../../../apis/Cms';
import Payment from '../../../../../apis/Payment';
import LoadingBar from '../../../../../components/common/LoadingBar';
import NavBar from '../../../../../components/common/NavBar';
import Dialog from '../../../../../components/member/Dialog';

function UsdtGuide () {
  const {
    cms,
    payment
  }: {
    cms: Cms,
    payment: Payment
  } = useApi({
    cms: Cms,
    payment: Payment
  });

  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<Array<UsdtMarket>>([]);
  const [currentMarket, setCurrentMarket] = React.useState<UsdtMarket>();
  const [buying, setBuying] = React.useState(false);
  const [timingTips, setTimingTips] = React.useState(false);

  const handleGoMarket = () => {
    if (!currentMarket?.marketUrl) {
      return;
    }
    setBuying(true);
    window.open(currentMarket.marketUrl);
  };

  React.useEffect(
    () => {
      Promise.all([
        cms.getUsdtMarkets(),
        payment.usdtExchange(0)
      ]).then(([markets, exchanges]) => {
        const list = markets.map(item => {
          item.parsedObj = JSON.parse(item.jsonObj);
          if (item.parsedObj) {
            item.parsedObj.key = item.parsedObj?.key.toUpperCase();
            item.marketUrl = (
              exchanges.find(
                e => e.otcMarketName.toUpperCase() === item.parsedObj?.key
              )?.otcMarketLink
            )
          }
          return item;
        })
        setList(list);
        setCurrentMarket(list[0]);
      }).finally(
        () => setLoading(false)
      )
    },
    [cms]
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
          <section className="usdt-guide">
            <p className="tips">
              部分交易所有充值后24小时提币限制，
              无法快速给九游会充值，
              请选择后仔细阅读相关说明
              <button
                className="help-button"
                onClick={() => setTimingTips(true)}
              >
                <i>?</i>
              </button>
            </p>
            <div className="market-list">
              {
                list.map(market => (
                  <button
                    key={market.id}
                    onClick={() => setCurrentMarket(market)}
                    className={market === currentMarket ? 'active' : undefined}
                  >
                    <img src={market.minImageHttpUrl} />
                    <label>{market.parsedObj?.usdtText}</label>
                  </button>
                ))
              }
            </div>
            <div className="remark">
              <div>
                <label>您已选择</label>
                <span>{currentMarket?.parsedObj?.key}交易所</span>
              </div>
              <div>{currentMarket?.parsedObj?.processText}</div>
            </div>
            <div className="guide">
              <img src={currentMarket?.maxImageHttpUrl} />
            </div>
            <div className="opr">
              <button onClick={handleGoMarket}>使用{currentMarket?.parsedObj?.key}充值</button>
            </div>
          </section>
        )
      }
      <Dialog
        open={buying}
        noticeIcon
        onClose={() => setBuying(false)}
        className="usdt-guide-dialog"
      >
        <div className="guide-content">
          <header>充值提示</header>
          {
            currentMarket?.parsedObj?.key === 'KYBERBIT' ? (
              <>
                <p>
                  如果您已使用{currentMarket?.parsedObj?.key}完成充值
                  <br />
                  请稍做等待，充值即将到账
                </p>
                <button onClick={() => setBuying(false)}>我知道了</button>
              </>
            ) : (
              <>
                <p>若您已购买USDT，需要使用“其他钱包”转币给九游会完成充值</p>
                <div className="oprs">
                  <button
                    className="btn-cancel"
                    onClick={() => setBuying(false)}
                  >等等再说</button>
                  <button onClick={() => history.replace('/member/recharge')}>立即充值</button>
                </div>
              </>
            )
          }
        </div>
      </Dialog>
      <Dialog
        open={timingTips}
        onClose={() => setTimingTips(false)}
        noticeIcon
        className="timing-tips-dialog"
      >
        <header>什么是交易所的时间限制？</header>
        <p>受政策影响，部分交易所充值购买USDT后，需等待24小时才能转币，这会影响您充值九游会的速度。</p>
        <p>请按照自己想充值的金额或期望充值，到时见，选择相遇的交易所进行充值</p>
        <div className="oprs">
          <button
            className="btn-submit"
            onClick={() => setTimingTips(false)}
          >我知道了</button>
        </div>
      </Dialog>
    </>
  );
}

export default UsdtGuide;
