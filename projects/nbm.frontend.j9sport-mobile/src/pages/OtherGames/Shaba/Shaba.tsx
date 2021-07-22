import React from 'react';
import { observer } from "mobx-react";

import AppConfig from '../../../configs';
import memberStore from "../../../stores/member";
import { useApi } from "../../../apis";
import Third from "../../../apis/Third";
import LoadingBar from '../../../components/common/LoadingBar';

const BASEURL: any = {
  CN: AppConfig.SABA_CN_URL,
  US: AppConfig.SABA_US_URL
}

function Shaba() {
  const [third] = useApi([Third])
  // const [src, setSrc] = useState('')
  const entrance = memberStore.currency === 1 ? 'CN' : 'US'

  const getShabaToken = async () => {
    const res: any = await third._shaba_doLoginRegister({
      userName: memberStore.username,
      currency: memberStore.currency
    })
    return res.token
  }

  React.useEffect(() => {
    (async function () {
      const targetSrc = `${BASEURL[entrance]}?lang=cs&token=${await getShabaToken()}`;
      // setSrc(targetSrc);
      window.location.href = targetSrc;
    })()
  }, [entrance, memberStore.isLoged])

  return (
    <div className="shabaContainer">
      {/* <iframe
        src={src}
        frameBorder={0}
      /> */}
      <LoadingBar />
    </div>
  );
}

export default observer(Shaba);