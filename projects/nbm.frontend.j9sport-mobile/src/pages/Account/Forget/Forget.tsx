import React, { useState } from 'react';

import Steps, { Step } from "../../../components/Steps";
import NavBar from "../../../components/common/NavBar";
import ForgetStep1 from "./ForgetStep1";
import ForgetStep2 from "./ForgetStep2";
import ForgetStep3 from "./ForgetStep3";

import step1_gold from "./img/forget-step1-gold.png";
import step2_gold from "./img/forget-step2-gold.png";
import step2_gray from "./img/forget-step2-gray.png";
import step3_gold from "./img/forget-step3-gold.png";
import step3_gray from "./img/forget-step3-gray.png";

function Forget() {

  const [step, setStep] = useState(0)
  const [step2Params, setStep2Params] = useState<any>({})

  const nextStep = (phone?: string,countryCode?: string) => {
    if (phone && countryCode) {
      setStep2Params(
        {
          phone,
          countryCode
        }
      )
    }
    setStep(step + 1)
  }

  return (
    <div>
      <NavBar title="忘记密码" center/>
      <Steps
        current={step}
      >
        <Step
          icon={step1_gold}
          activeIcon={step1_gold}
          title={"身份验证"}
        >
          <ForgetStep1 nextStep={nextStep}/>
        </Step>
        <Step
          icon={step2_gray}
          activeIcon={step2_gold}
          title={"设置新密码"}
        >
          <ForgetStep2 nextStep={nextStep} params={step2Params}/>
        </Step>
        <Step
          icon={step3_gray}
          activeIcon={step3_gold}
          title={"完成修改"}
        >
          <ForgetStep3 />
        </Step>
      </Steps>
    </div>
  );
}

export default Forget;