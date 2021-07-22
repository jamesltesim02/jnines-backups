import React from "react";
import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
import { getResourceUrl } from "../../../../../components/common/Image";
import { ResourceDir } from "../../../../../consts/network";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import M from '../../../../../components/common/m';
import app from "../../../../../stores/app";

dayjs.extend(Duration)

function PromotionCard(
  {
    cardData
  }: {
    cardData?: any
  }
) {
  const history = useHistory()

  const handleClick = (item: any) => {
    if (item.matchId && item.matchId !== 'null') {
      history.push(`/detail/${item.matchId}`);
      return;
    }
    if (/^https?:\/\//i.test(item.url)) {
      window.open(item.url);
      return;
    }
    if (item.url) {
      history.push(item.url);
      return;
    }

    history.push(`/promo-detail/${item.slideId}`);
  };

  const duration = dayjs.duration(dayjs(cardData.closeTime).diff(dayjs()))

  return (
    <div
      className="promotion-card"
      onClick={() => {
        handleClick(cardData)
      }}
    >
      <img
        src={getResourceUrl(cardData.imageAd, ResourceDir.SLIDE)}
        alt={cardData.slideId}
      />
      <div className="promotion-card-content">
        <div className="title">
					<span>
						{cardData.title[app.locale]}
					</span>
          <span className="activity-time">
						{
              duration.asMonths() >= 1
                ? <M id="promotion.promo_forever"/>
                : (
                  <M
                    id="promotion.promo_countdown"
                    values={{
                      days: duration.days(),
                      hours: duration.hours(),
                      minutes: duration.minutes(),
                      seconds: duration.seconds(),
                    }}
                  />
                )
            }
					</span>
        </div>
        <div className="text">
          {cardData.summary[app.locale]}
        </div>
      </div>
    </div>
  )

}

export default observer(PromotionCard);