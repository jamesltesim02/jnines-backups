import React from 'react';
import Carousel from 'nuka-carousel';
import { getResourceUrl } from '../../common/Image';
import { ResourceDir } from '../../../consts/network';
import { useHistory } from 'react-router-dom';

function Banner (
  { banners }: {
    banners: Array<any>
  }
) {
  const history = useHistory();

  const handleClick = (item: any) => {
    if (item.matchId && item.matchId !== 'null') {
      history.push(`/detail/${item.matchId}`);
      return
    }
    if (/^https?:\/\//i.test(item.url)) {
      window.open(item.url);
      return
    }
    if (item.url.includes('/other/')) {
      document.getElementById(item.url)?.click()
      return;
    }
		if (item.url) {
			history.push(item.url);
			return;
		}

		history.push(`/promo-detail/${item.slideId}`);
  };

  return (
    <section className="banner">
      <Carousel
        autoplay
        wrapAround
      >
      {
        banners.map(banner => (
          <button
            key={banner.slideId}
            className="banner-item"
            style={{ backgroundImage: `url(${getResourceUrl(banner.imageWap, ResourceDir.SLIDE)})` }}
            onClick={() => handleClick(banner)}
          />
        ))
      }
      </Carousel>
    </section>
  );
}

export default Banner;
