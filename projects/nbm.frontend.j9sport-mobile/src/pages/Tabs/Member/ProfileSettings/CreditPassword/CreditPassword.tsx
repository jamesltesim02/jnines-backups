import { Toast } from 'antd-mobile';
import React from 'react';
import { useApi } from '../../../../../apis';
import User from '../../../../../apis/User';
import NavBar from '../../../../../components/common/NavBar';
import CreditPasswordDialog from '../../../../../components/member/CreditPasswordDialog';
import Verification from '../../../../../components/member/Verification';
import { VerifyType } from '../../../../../components/member/Verification/Verification';

import ImageBg from './pass-bg.png';

function CreditPassword () {

  const { user }: { user: User } = useApi({ user: User });
  const verifyRef = React.useRef<any>(null);

  const [creditPasswordStatus, setCreditPasswordStatus] = React.useState<{
    available: boolean,
    inited: boolean,
    setting: boolean,
    handleFinish?: Function
  }>({
    available: false,
    inited: false,
    setting: false
  });
  
  const queryCreditPassword = React.useCallback(
    async () => {
      const res = await user.getCreditPasswordStatus();
      setCreditPasswordStatus({
        inited: res.fundsPwd === 1,
        available: res.fundsPasswordFlaf === 1,
        setting: false
      });
    },
    [user]
  );

  const handleSetCreditPassword = async () => {
    const verified = await verifyRef.current.checkVerify(
      VerifyType.CREDIT_PASSWORD,
      true
    );
    if (verified) {
      setCreditPasswordStatus(v => ({
        ...v,
        setting: true,
        handleFinish: queryCreditPassword
      }));
    }
  };

  const handleToggle = async () => {
    const verified = await verifyRef.current.checkVerify(
      VerifyType.CREDIT_PASSWORD,
      true
    );
    if (!verified) {
      return;
    }

    await new Promise<void>((resolve) => {
      if (creditPasswordStatus.inited) {
        return resolve();
      }
      setCreditPasswordStatus(v => ({
        ...v,
        setting: true,
        handleFinish: resolve
      }));
    });

    Toast.loading('状态更新中...');
    try {
      await user.setCreditPasswordStatus(!creditPasswordStatus.available);
      await queryCreditPassword();
      Toast.success('更新成功');
    } finally {
      Toast.hide();
    }
  };

  React.useEffect(() => {
    queryCreditPassword();
  }, [])

  return (
    <>
      <div className="credit-password">
        <NavBar title="资金密码" center/>
        <img src={ImageBg} />
        <div className="content-panel">
          <div className="toggle-swither">
            <span>资金密码</span>
            <input
              type="checkbox"
              checked={creditPasswordStatus.available}
              onChange={() => {}}
            />
            <button
              onClick={handleToggle}
            />
          </div>
          {
            creditPasswordStatus.inited ? (
              <div className="link">
                <button  onClick={handleSetCreditPassword}>重置资金密码</button>
              </div>
            ) : undefined
          }
          <div className="tips">
            <header>温馨提醒</header>
            <p>资金密码启用后，进入游戏场馆、积分兑换、提现要进行资金密码验证，可进一步保护您的资金安全。</p>
          </div>
        </div>
      </div>
      <Verification
        ref={verifyRef}
      />
      <CreditPasswordDialog
        open={creditPasswordStatus.setting}
        init={!creditPasswordStatus.inited}
        onClose={() => setCreditPasswordStatus(v => ({ ...v, setting: false }))}
        onFinish={() => {
          queryCreditPassword();
          setCreditPasswordStatus(v => ({ ...v, setting: false }))
        }}
      />
    </>
  );
}

export default CreditPassword;
