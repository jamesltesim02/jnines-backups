import React from 'react';
import BackButton from "../../../../../components/common/BackButton";
import ImageWashCodePromo from '../img/wash-code-promo.png'

function WashCodePromo() {
  return (
    <div className="wash-code-promo">
      <header>
        <BackButton/>
        <div>
          洗码优惠规则
        </div>
      </header>
      <img src={ImageWashCodePromo} alt=""/>
    </div>
  );
}

export default WashCodePromo;