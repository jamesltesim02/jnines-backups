import React, { useState, useEffect } from 'react';
import { Icon } from "antd-mobile";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller'
import { useApi } from "../../apis";
import Pull from "../../apis/Pull";
import BackButton from "../../components/common/BackButton";
import M from '../../components/common/m'
import app from "../../stores/app";
import { observer } from "mobx-react";


function Announce() {

  const [pull] = useApi([Pull])

  const [annoList, setAnnoList] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(0)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getNoticeList = () => {
      pull.getNoticeList(pageIndex).then(({count, notices}: any) => {
        setAnnoList(annoList.concat(notices));
        setTotal(count);
      })
    };
    getNoticeList();
  }, [pull, pageIndex]);


  return (
    <div className="announce">
      <div className="announce-header dark">
        <BackButton/>
        <M id="common.annouce"/>
      </div>
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => setPageIndex(pageIndex + 1)}
        hasMore={annoList.length <= total}
      >
        <div className="announce-list">
          {
            annoList.map((item: any) => (
              <div className="announce-list-card">
                <div className="tit">
                  <span>
                    {
                      app.locale === 'zh' ?
                        item.title
                        : item.titleEn
                    }
                  </span>
                  <span>{dayjs(item.startTime).format("YYYY-MM-DD")}</span>
                </div>
                <div className="content">
                  {
                    app.locale === 'zh' ?
                      item.body
                      : item.bodyEn
                  }
                </div>
                <Link to={`announce-detail/${item.noticeId}`}>
                  <span>
                    <M id="common.details"/>
                  </span>
                  <Icon type="right" color="#777777"/>
                </Link>
              </div>
            ))
          }
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default observer(Announce);