import React from 'react';

import HomeMain from '../../../components/matchs/HomeMain';
import HomeMatchs from '../../../components/matchs/HomeMatchs';

/** 首页默认页面(大首页) */
function DefaultPage () {

  return (
      <section className="home-page-default">
        <HomeMain />
        <HomeMatchs />
      </section>
  )
}

export default DefaultPage;
