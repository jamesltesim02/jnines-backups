import React from 'react';

import { withApi } from '../../../apis';
import Pull from '../../../apis/Pull';

import AnnouBar from './AnnouBar';
import Banner from './Banner';
import HotTours from './HotTours';

function HomeMain (
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {
  const [annous, setAnnous] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
  const [tours, setTours] = React.useState([]);

  React.useEffect(
    () => {
      pull.getNoticeAndBanners().then(
        ({ notices, banners, hotleagues }: any) => {
          setAnnous(notices);
          setBanners(banners);
          setTours(hotleagues);
        }
      );
    },
    [pull]
  );

  return (
    <>
      <AnnouBar annous={annous} />
      <section className="home-main">
        <Banner list={banners} />
        <HotTours tours={tours} />
      </section>
    </>
  );
}

export default withApi({ pull: Pull })(HomeMain);
