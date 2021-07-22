import React from 'react';
import { useApi } from '../../../../apis';
import Payment from '../../../../apis/Payment';
import Cms, { UsdtMarket } from '../../../../apis/Cms';
import { useHistory } from 'react-router';
import LoadingBar from '../../../../components/common/LoadingBar';
import Dialog from '../../../../components/member/Dialog';

function Markets () {
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

  // 还未加载完成则显示为loading
  if (loading) {
    return <LoadingBar />;
  }

  return (
    <>
      <section className="markets-page">
        <header>请选择交易所</header>
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
          <span>{currentMarket?.parsedObj?.key}交易所</span>
          <label>{currentMarket?.parsedObj?.processText}</label>
        </div>
        <div className="guide">
          <img src={currentMarket?.maxImageHttpUrl} />
        </div>
        <div className="opr">
          <button
            onClick={handleGoMarket}
            className="submit available"
          >
            使用{currentMarket?.parsedObj?.key}充值
          </button>
        </div>
      </section>

      <Dialog
          open={buying}
          noticeIcon
          onClose={() => {
            console.log('will close')
            setBuying(false)
          }}
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
                  <div className="buttons">
                    <button
                      onClick={() => setBuying(false)}
                      className="submit"
                    >我知道了</button>
                  </div>
                </>
              ) : (
                <>
                  <p>若您已购买USDT，需要使用“其他钱包”转币给九游会完成充值</p>
                  <div className="buttons">
                    <button
                      className="cancel"
                      onClick={() => setBuying(false)}
                    >等等再说</button>
                    <button
                      onClick={() => history.replace('/member/recharge/dcbox')}
                      className="submit"
                    >立即充值</button>
                  </div>
                </>
              )
            }
          </div>
        </Dialog>
    </>
  );
}

export default Markets;
