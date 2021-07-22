import React from 'react';
import { PaymentGenre } from '../../../../apis/Payment';

import UsdtStep1 from './UsdtStep1';
import UsdtStep2 from './UsdtStep2';
import UsdtStep3 from './UsdtStep3';
import UsdtStep4 from './UsdtStep4';

const STEP_NAMES = [
  '为什么选择USDT',
  '你需要一个钱包',
  '为钱包添加一笔USDT',
  '开始充值',
].reverse();

const STEP_CONTENTS = [
  UsdtStep1,
  UsdtStep2,
  UsdtStep3,
  UsdtStep4,
].reverse();

function UsdtGuide (
  {
    genre
  } : {
    genre: PaymentGenre,
  }
) {
  const [currentStep, setCurrentStep] = React.useState(STEP_NAMES.length - 1);
  const ContentComponent = STEP_CONTENTS[currentStep];

  return (
    <div className="usdt-guide">
      <div className="step-names">
        {
          STEP_NAMES.map((name, i) => (
            <button
              key={i}
              className={i === currentStep ? 'active' : undefined}
              onClick={() => setCurrentStep(i)}
            >
              {name}
            </button>
          ))
        }
      </div>
      <ContentComponent genre={genre} />
      {
        currentStep !== 0 ? (
          <div className="next-button">
            <button onClick={() => setCurrentStep(currentStep - 1)}>下一步</button>
          </div>
        ) : null
      }
    </div>
  );
}

export default UsdtGuide;
