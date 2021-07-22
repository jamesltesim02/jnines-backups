import React from 'react';
import SimpleBar from "simplebar-react";
import HomeMain from '../../../components/matchs/HomeMain';
import HomeMatchs from '../../../components/matchs/HomeMatchs';

/** 首页默认页面(大首页) */
function DefaultPage () {

  return (
      <SimpleBar className="home-page-default">
        <HomeMain />
        <HomeMatchs />
      </SimpleBar>
  )
}

export default DefaultPage;
