import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from "../../../apis";
import User from "../../../apis/User";

import ImagePassword from "./img/password.svg";
import ImageGoogle from "./img/google.svg";
import ImagePhone from "./img/phone.svg";
import ImageCreditPasswordModify from './img/mpwd.png';

import Dialog from "../../../components/member/Dialog";
import Phone from "./Phone";
import Verification from '../../../components/member/Verification';
import { VerifyType } from '../../../components/member/Verification/Verification';
import CreditPasswordDialog from '../../../components/member/CreditPasswordDialog';
import { message, Switch } from 'antd';

const Settings = () => {

  const verifyRef = React.useRef<any>(null);

  const { user }: { user: User } = useApi({ user: User });
  const [bindPhone, setBindPhone] = useState({
    countryCode: '',
    phone: '',
    verifyStatus: false,
  });
  const [googleBindStatus, setGoogleBindStatus] = useState(false)
  const [modifyPhoneVisible, setModifyPhoneVisible] = useState(false)
  const [creditPasswordStatus, setCreditPasswordStatus] = useState<{
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
  )

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

    const hide = message.loading('???????????????...');
    try {
      await user.setCreditPasswordStatus(!creditPasswordStatus.available);
      await queryCreditPassword(); 
      message.success('????????????');
    } finally {
      hide();
    }
  };

  useEffect(() => {
    user.getBindPhone().then((res: any) => {
      setBindPhone({...res})
    });
    user.googleCheck().then((res: any) => {
      setGoogleBindStatus(res.googleBindStatus) 
    });
    queryCreditPassword();
  }, [])

  return (
    <div className="settings">
      <section>
        <h2>????????????</h2>
        <div className="settings-container">
          <div>
            <img src={ImagePassword} alt=""/>
            <div className="settings-info-box">
              ??????
            </div>
            <Link to="/member/settings/change">
              ????????????
            </Link>
          </div>
          <div>
            <img src={ImageCreditPasswordModify} alt="" />
            <div className="settings-info-box">
              ????????????
              <br/>
              <span>???????????????????????????</span>
            </div>
            <a onClick={handleSetCreditPassword}>
              {
                creditPasswordStatus.inited
                ? '????????????' : '???????????????'
              }
            </a>
          </div>
          <div>
            <img src={ImagePhone} alt=""/>
            <div className="settings-info-box">
              ?????????: {`${bindPhone.countryCode} ${bindPhone.phone}`}
            </div>
            <button onClick={() => setModifyPhoneVisible(true)}>
              ???????????????
            </button>
          </div>
          <div>
            <img src={ImageGoogle} alt=""/>
            <div className="settings-info-box">
              ???????????????
              <br/>
              <span>???????????????????????????</span>
            </div>
            <Link to={'/member/settings/google'}>
              {googleBindStatus ? "??????" : "??????"}???????????????
            </Link>
          </div>
        </div>
        <h2>????????????</h2>
        <div className="settings-container login-setttings">
          <div>
            <div className="settings-info-box">
              ????????????
              <br/>
              <span>?????????????????????????????????????????????????????????</span>
            </div>
            <Switch
              checked={creditPasswordStatus.available}
              onClick={handleToggle}
            />
          </div>
        </div>
      </section>
      <Dialog
        open={modifyPhoneVisible}
        closeButton
        imgbg
        className="modify-phone-dialog"
        onClose={() => setModifyPhoneVisible(false)}
        destroyOnClose={true}
      >
        <Phone
          bindPhone={bindPhone}
          close={() => setModifyPhoneVisible(false)}
        />
      </Dialog>
      <Verification ref={verifyRef} />
      <CreditPasswordDialog
        open={creditPasswordStatus.setting}
        init={!creditPasswordStatus.inited}
        onClose={() => setCreditPasswordStatus(v => ({ ...v, setting: false }))}
        onFinish={() => {
          queryCreditPassword();
          setCreditPasswordStatus(v => ({ ...v, setting: false }))
        }}
      />
    </div>
  );
};

export default Settings;