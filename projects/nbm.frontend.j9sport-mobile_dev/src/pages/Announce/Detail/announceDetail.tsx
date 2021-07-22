import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useApi } from "../../../apis";
import Pull from "../../../apis/Pull";
import dayjs from "dayjs";
import M from '../../../components/common/m';
import BackButton from "../../../components/common/BackButton";
import app from "../../../stores/app";
import { observer } from "mobx-react";

interface IDetail {
  body: string
  bodyEn: string
  closeTime: number
  noticeId: string
  startTime: number
  title: string
  titleEn: string
}

function AnnounceDetail() {
  const [pull] = useApi([Pull])
  const history = useHistory()
  const {id} = useParams<any>()

  const [detail, setDetail] = useState({} as IDetail)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    pull.getNoticeDetails(id).then((res: IDetail | undefined) => {
      res ? setDetail(res) : history.push('/announce')
    })
  }, [])

  return (
    <div className="anno-detail">
      <div className="header">
        <BackButton/>
        <M id="common.annou_detail"/>
      </div>
      <div className="anno-detail-container">
        <div className="title">
          {
            app.locale === 'zh' ?
              detail.title
              : detail.titleEn
          }
        </div>
        <div className="time">
          <M id="common.org"/>
          <span>
            {dayjs(detail.closeTime).format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="content">
          {
            app.locale === 'zh' ?
              detail.body
              : detail.bodyEn
          }
        </div>

      </div>
    </div>
  );
}

export default observer(AnnounceDetail);