import React from 'react';
import BackButton from "../../../../components/common/BackButton";
import ImageWashCodePromo from '../img/wash-code-promo.png'

function WashCodePromo() {
  return (
    <div className="wash-code-promo">
      <header>
        <BackButton>
          返回
        </BackButton>
      </header>
      <img src={ImageWashCodePromo} alt=""/>
    </div>
  );
}

export default WashCodePromo;