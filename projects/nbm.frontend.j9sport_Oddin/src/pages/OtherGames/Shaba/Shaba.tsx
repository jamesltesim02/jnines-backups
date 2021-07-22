import React, { useState } from 'react';
import { observer } from "mobx-react";
import { Urls } from "../../../configs";
import memberStore from "../../../stores/member";

const BASEURL = "http://sbtest.l0107.uatnine.com";

function Shaba() {
  const [entrance, setEntrance] = useState('CN')
  const src = `${BASEURL}?lang=cs&token=${memberStore.token}`
  return (
    <div className="shabaContainer">
      <div className="entrance">
        入口:
        <button className={entrance === "CN" ? "active" : ''} onClick={() => setEntrance("CN")}>CN</button>
        <button className={entrance === "US" ? "active" : ''} onClick={() => setEntrance("US")}>US</button>
      </div>
      <iframe src={src}/>
    </div>
  );
}

export default observer(Shaba);