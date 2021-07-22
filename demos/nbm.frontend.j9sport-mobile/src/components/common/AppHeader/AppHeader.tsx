import React, { useState } from 'react';
import { Icon } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import memberStore from "../../../stores/member";
import { useApi } from "../../../apis";

import { Urls } from '../../../configs';
import LogoImage from '../../../assets/images/logo.png';

import MemberImage from './images/member.png';
import Tov1Image from './images/tov1.png';

import { loadFromStorage, saveToStorage } from '../../../utils/StorageUtils';

import appStore from '../../../stores/app';
import M from '../../common/m';
import MemberPopup from './components/MemberPopup';
import SearchButton from '../SearchButton';
import Bet from "../../../apis/Bet";

import { CURRENCY_MAP } from "../../../consts/app";

const VERSION_TIP_CACHE = 'to-version-1'

function AppHeader() {

  const [isMemberShow, setIsMemberShow] = useState(false);
  const [versionTip, setVersionTip] = useState(loadFromStorage(VERSION_TIP_CACHE, true));

  const {reloadVersion} = memberStore;

  const [bet] = useApi([Bet])

  React.useEffect(
    () => {
      if (
        !memberStore.isLoged
        ||
        reloadVersion === 1
      ) {
        return;
      }
      bet.getBalance(memberStore.token).then(
        (result: any) => {
          if (!result || !result.customerId) {
            memberStore.memberInfo = null;
            return;
          }
          memberStore.memberInfo = {
            userId: result.nbUserId,
            token: memberStore.token,
            customerId: result.customerId,
            balance: result.balance,
            currency: result.currency
          };
        }
      )
    },
    [bet, reloadVersion]
  );

  return (
    <header className="app-header dark">
      <Link
        to="/"
        className="logo"
      >
        <img src={LogoImage} alt=""/>
      </Link>
      <div className="to-version1">
        {
          /\/\/sptm?\./gi.test(window.location.href)
          ? undefined
          : (
            <>
              <a href={`${Urls.V1_SITE_URL}${appStore.queryString}`}>
                <img src={Tov1Image} alt="" />
              </a>
              {
                versionTip ? (
                  <div className="tips">
                    <M id="pages.toversion1"/>
                    <button onClick={() => {
                      saveToStorage(VERSION_TIP_CACHE, false)
                      setVersionTip(false)
                    }}>
                      <Icon
                        type="cross-circle"
                        size="xs"
                      />
                    </button>
                  </div>
                ) : null
              }
            </>
          )
        }
      </div>
      <div className="oprs">
        <SearchButton/>
        <button
          onClick={() => setIsMemberShow(!isMemberShow)}
          className="btn-member"
        >
          {
            memberStore.isLoged
            ? `${CURRENCY_MAP[memberStore.currency]} ${memberStore.balance.toFixed(2)}`
            : undefined
          }
          <img src={MemberImage} alt=""/>
        </button>
      </div>
      <MemberPopup
        isOpen={isMemberShow}
        closePopup={() => setIsMemberShow(false)}
      />
    </header>
  );
}

export default observer(AppHeader);
