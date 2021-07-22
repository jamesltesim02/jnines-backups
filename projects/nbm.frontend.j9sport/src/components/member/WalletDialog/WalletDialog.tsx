import React from 'react';
import Dialog from '../Dialog';

import Dcbox from './Dcbox';
import Usdt from './Usdt';
import Bankcard from './Bankcard';
import Wallet, { Currency } from '../../../apis/Wallet';
import { useApi } from '../../../apis';
import LoadingBar from '../../common/LoadingBar';

const WalletComponents: any = {
  [Currency.DCBOX]: Dcbox,
  [Currency.USDT]: Usdt,
};

function WalletDialog (
  {
    open,
    currency,
    accountName,
    onClose = () => {},
    onFinish = () => {}
  } : {
    open: boolean,
    walletType: string,
    currency: Currency,
    accountName?: string,
    onClose: () => void,
    onFinish: () => void
  }
) {
  // 钱包api
  const { wallet } : { wallet: Wallet } = useApi({ wallet: Wallet });

  const [loading, setLoading] = React.useState(true);
  const [virtualWalletInfo, setVirtualWalletInfo] = React.useState<any>();

  const Component = WalletComponents[currency]

  React.useEffect(
    () => {
      if (
        currency
        &&
        currency !== Currency.CNY
      ) {
        wallet.queryUsdtWallet(currency)
          .then(setVirtualWalletInfo)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    },
    [wallet, currency]
  );

  return (
    <Dialog
      open={open}
      closeButton
      onClose={onClose}
      className="add-wallet-dialog"
    >
      {
        loading
        ? <LoadingBar />
        : (
          Boolean(currency) ? (
            (
              currency === Currency.CNY ? (
                <Bankcard
                  accountName={accountName}
                  onFinish={onFinish}
                />
              ) : (
                virtualWalletInfo?.length ? (
                  <Component
                    virtualWalletInfo={virtualWalletInfo}
                    currency={currency}
                    accountName={accountName}
                    onFinish={onFinish}
                  />
                ) : null
              )
            )
          ) : null
        )
      }
    </Dialog>
  );
}

export default WalletDialog;
