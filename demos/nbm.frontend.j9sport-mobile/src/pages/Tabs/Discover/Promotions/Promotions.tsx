import React, { useState, useEffect } from 'react';
import DiscoverHeader from '../../../../components/Discover/DiscoverHeader';
import { useApi } from "../../../../apis";
import Pull from "../../../../apis/Pull";

import PromotionCard from "./PromotionCard";
import LoadingBar from '../../../../components/common/LoadingBar';
import EmptyList from '../../../../components/common/EmptyList';

function PromotionsPage() {

  const [pull] = useApi([Pull]);
  const [promotionList, setPromotionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pull.getActivity().then((res: any) => {
      setPromotionList(res)
    }).finally(() => setLoading(false));
  }, [pull])
  return (
    <>
      <DiscoverHeader />
      {
        promotionList.length ? (
          <div className="promotion">
            {
              promotionList.map((item:any) => (
                <PromotionCard
                  key={item.slideId}
                  cardData={item}
                />
              ))
            }
          </div>
        ) : (
          <div className="scrollable-match-list fullscreen">
            {
              loading
              ? <LoadingBar className="full"/>
              : <EmptyList />
            }
          </div>
        )
      }
    </>
  );
}

export default PromotionsPage;
