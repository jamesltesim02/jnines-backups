import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import memberStore from "../../../stores/member";
import { CURRENCY_MAP } from "../../../consts/app";

import LogoImage from '../../../assets/images/logo.png';
import MemberImage from './images/member.png';
import MemberPopup from './components/MemberPopup';
import SearchButton from '../SearchButton';
import LoadingBar from '../LoadingBar';
import EuropeEnter from "../../../pages/Activity/EuropeCup/Components/EuropeEnter";

function AppHeader() {
  const [isMemberShow, setIsMemberShow] = useState(false);

  return (
    <header className="app-header">
      <Link
        to="/"
        className="logo"
      >
        <img src={LogoImage} alt=""/>
      </Link>
      <EuropeEnter />
      <div className="oprs">
        <SearchButton/>
        <button
          onClick={() => setIsMemberShow(!isMemberShow)}
          className="btn-member"
        >
          {
            memberStore.isLoged
            ? (
              memberStore.j9Reloading
              ? <LoadingBar />
              : `${CURRENCY_MAP[memberStore.currency]} ${memberStore.balance.toFixed(2)}`
            )
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
