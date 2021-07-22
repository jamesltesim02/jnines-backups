import React from 'react';
import { Carousel, Button } from 'antd';

import { RightCircleOutlined, LeftCircleOutlined } from '@ant-design/icons';

import { getResourceUrl } from '../../common/Image';
import { ResourceDir } from '../../../consts/network';
import { useHistory } from 'react-router-dom';

function BannerArrow (
  {
    type = 'prev',
    currentSlide,
    slideCount,
    ...props
  }: {
    type: 'prev' | 'next',
    currentSlide?: any,
    slideCount?: any,
  }
) {
  return (
    <Button
      shape="circle"
      {...props}
    >
      {
        type === 'next'
        ? <RightCircleOutlined />
        : <LeftCircleOutlined />
      }
    </Button>
  )
}

function Banner (
  { list }: {
    list: Array<any>
  }
) {
  const history = useHistory()

  const handleClick = (item: any) => {
    if (item.matchId && item.matchId !== 'null') {
      history.push(`/detail/${item.matchId}`);
      return
    }
    if (/^https?:\/\//i.test(item.url)) {
      window.open(item.url);
      return
    }
		if (item.url) {
			history.push(item.url);
			return;
		}

		history.push(`/promo-detail/${item.slideId}`);
  };

  return (
    <div className="banner">
      <Carousel
        autoplay
        draggable
        arrows
        pauseOnHover
        autoplaySpeed={5000}
        prevArrow={<BannerArrow type="prev" />}
        nextArrow={<BannerArrow type="next" />}
      >
      {
        list.map(item => (
          <div
            key={item.slideId}
            onClick={() => handleClick(item)}
          >
            <i
              className="banner-item"
              style={{ backgroundImage: `url(${getResourceUrl(item.imageWeb, ResourceDir.SLIDE)})` }}
            />
          </div>
        ))
      }
      </Carousel>
    </div>
  );
}

export default Banner;
