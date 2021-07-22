import React from 'react';

import IconStep from './icon-step.svg';

function RechargeStep (
  {
    steps,
    current
  }: {
    steps: Array<string>,
    current: Number
  }
) {

  return (
    <ul className={`recharge-step recharge-step-${current}`}>
      {
        steps.map(
          (item, i) => (
            <li key={i}>
              <img src={IconStep} />
              <label>{item}</label>
            </li>
          )
        )
      }
    </ul>
  );
}

export default RechargeStep;
