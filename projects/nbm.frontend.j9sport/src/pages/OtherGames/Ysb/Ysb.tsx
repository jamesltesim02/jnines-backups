import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import appStore from "../../../stores/app";
import memberStore from "../../../stores/member";
import encodeSearchParams from "../../../utils/encodeSearchParams";
import LoadingBar from '../../../components/common/LoadingBar';

import AppConfig from '../../../configs';

function Ysb() {

  const prefix = memberStore.currency === 1 ? 'TCBS_' : 'US8_'

  useEffect(() => {
    const targetSrc = `${AppConfig.YSB_URL}?${encodeSearchParams({
      username: `${prefix}${memberStore.memberInfo.customerId}`,
      langcode: appStore.locale === "zh" ? "zh-cn" : "en",
      sign: memberStore.nbToken,
      cr: memberStore.currency === 1 ? 'RMB' : 'USD',
      v: memberStore.currency === 1 ? AppConfig.YSB_TCBS_V : AppConfig.YSB_US8_V
    })}`;
    window.location.href = targetSrc;
  }, [memberStore.isLoged])

  return (
    <div className="ysbContainer">
      <LoadingBar />
    </div>
  )
}

export default observer(Ysb);