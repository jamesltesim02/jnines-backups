import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import memberStore from "../../../stores/member";
import encodeSearchParams from "../../../utils/encodeSearchParams";
import appStore from "../../../stores/app";

const BASEURL = "http://wlrevamp.a1go.org/login.aspx";

function Ysb() {
  const [src, setSrc] = useState('')
  const [entrance, setEntrance] = useState('CN')

  useEffect(() => {
    setSrc(`${BASEURL}?${encodeSearchParams({
      username: `JS${entrance}_${memberStore.memberInfo.customerId}`,
      langcode: appStore.locale === "zh" ? "zh-cn" : "en",
      sign: memberStore.token,
      cr: entrance === 'CN' ? 'RMB' : 'USD',
      v: entrance === 'CN' ? '1533' : '1531'
    })}`)
  },[entrance])

  return (
    <div className="ysbContainer">
      <div className="entrance">
        入口:
        <button className={entrance === "CN" ? "active" : ''} onClick={() => setEntrance("CN")}>CN</button>
        <button className={entrance === "US" ? "active" : ''} onClick={() => setEntrance("US")}>US</button>
      </div>
      <iframe
        src={src}
        frameBorder={0}
      >
      </iframe>
    </div>
  );
}

export default observer(Ysb);