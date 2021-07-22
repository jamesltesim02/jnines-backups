import React, { useState } from 'react';

import NavBar from "../../../../../components/common/NavBar";
import Steps, { Step } from "../../../../../components/Steps";
import ChangePhoneStep1 from "./ChangePhoneStep1";
import ChangePhoneStep2 from "./ChangePhoneStep2";
import ChangePhoneStep3 from "./ChangePhoneStep3";

import phone1Img from "./img/phone-1.png";
import phone2Img from "./img/phone-2-gray.png";
import phone2ImgGold from "./img/phone-2-gold.png";
import phone3Img from "./img/phone-3-gray.png";
import phone3ImgGold from "./img/phone-3-gold.png";

function ChangePhone() {
  const [step, setStep] = useState(0)
  const nextStep = () => {
    setStep(step + 1)
  }
  return (
    <div>
      <NavBar title="修改手机号码" center/>
      <Steps
        current={step}
      >
        <Step
          title="身份验证"
          icon={phone1Img}
          activeIcon={phone1Img}
        >
          <ChangePhoneStep1 nextStep={nextStep} />
        </Step>
        <Step
          title="设置新手机"
          icon={phone2Img}
          activeIcon={phone2ImgGold}
        >
          <ChangePhoneStep2 nextStep={nextStep}/>
        </Step>
        <Step
          title="完成修改"
          icon={phone3Img}
          activeIcon={phone3ImgGold}
        >
          <ChangePhoneStep3 />
        </Step>
      </Steps>
    </div>
  );
}

export default ChangePhone;