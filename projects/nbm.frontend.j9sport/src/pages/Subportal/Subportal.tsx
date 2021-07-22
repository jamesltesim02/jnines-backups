import React, {useEffect, useRef, useState} from 'react';
import Pull from "../../apis/Pull";
import {withApi} from "../../apis";
import {Button, Carousel} from 'antd';
import {getResourceUrl} from "../../components/common/Image";
import {ResourceDir} from "../../consts/network";
import mergeClass from "../../utils/mergeClass";
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";

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

/* eslint-disable react-hooks/exhaustive-deps */
function Subportal(
  {
    api: {pull}
  }: {
    api: { pull: Pull }
  }
) {

  const subRef = useRef<any>()

  const fullRef = useRef<any>()

  const [imgList, setImgList] = useState([])

  const [current, setCurrent] = useState(0)

  const handleClick = (item: any) => {

    const location = window.location

    if (item.matchId && item.matchId !== 'null') {
      window.open(`${location.protocol}//${location.host}/detail/${item.matchId}${location.search}`)
      return
    }
    if (/^https?:\/\//i.test(item.url)) {
      window.open(item.url)
      return
    }
    if (item.url) {
      window.open(`${location.protocol}//${location.host}${item.url}${location.search}`)
			return;
    }

    window.open(`${location.protocol}//${location.host}/promo-detail/${item.slideId}${location.search}`)
  };

  useEffect(() => {
    pull.getActivity({ isOperate: true }).then(res => {
      setImgList(res)
    })
  }, [])

  useEffect(()=> {
    const subEl =  document.getElementById('carousel-sub-container')
    if (subEl) {

      if (imgList.length < 4) {
        subEl.style.width = `${imgList.length * 30}%`
      }
      if (imgList.length < 3) {
        subEl.style.transform = `translateX(-40%)`
      }
    }
  },[imgList])

  return (
    <div className="subportal">
      {
        imgList.length > 1 ?
          <div id="carousel-sub-container">
            <Carousel
              ref={subRef}
              asNavFor={fullRef.current}
              className="carousel-sub"
              draggable
              arrows
              pauseOnHover
              autoplay
              autoplaySpeed={5000}
              centerMode
              dots={false}
              slidesToShow={imgList.length > 3 ? 4 : imgList.length }
              focusOnSelect={true}
              prevArrow={<BannerArrow type="prev" />}
              nextArrow={<BannerArrow type="next" />}
              beforeChange={((currentSlide, nextSlide) => {
                setCurrent(nextSlide)
              })}
            >
              {
                imgList.map((item: any,index: number) => (
                  <span
                    className={
                      mergeClass(
                        "carousel-sub-item",
                        current === index && 'active'
                      )
                    }
                    key={item.imageFull}
                  >
              <img
                src={getResourceUrl(item.imageFull, ResourceDir.SLIDE)}
                alt={item.imageFull}
              />
            </span>
                ))
              }
            </Carousel>
          </div>
          :null
      }
      <Carousel
        ref={fullRef}
        draggable
        asNavFor={subRef.current}
        className="carousel-full"
        dots={false}
      >
        {
          imgList.map((item: any) => (
            <span
              className="carousel-full-item"
              key={item.imageFull}
              onClick={() => {
                handleClick(item)
              }}
            >
              <img
                src={getResourceUrl(item.imageFull, ResourceDir.SLIDE)}
                alt={item.imageFull}
              />
            </span>
          ))
        }
      </Carousel>

    </div>
  );
}

export default withApi({pull: Pull})(Subportal);
