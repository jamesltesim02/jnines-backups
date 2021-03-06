import React from 'react';
import { observer } from "mobx-react";
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconBack() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <filter id="kvhzxr0sya">
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.882353 0 0 0 0 0.882353 0 0 0 0 0.882353 0 0 0 1.000000 0"/>
        </filter>
      </defs>
      <g fill="#b90404" fillRule="evenodd">
        <g>
          <g>
            <g transform="translate(-569 -225) translate(569 224) matrix(-1 0 0 1 24 1)">
              <g>
                <path fill={app.skin === SkinType.BLACK ? '#fff' : '#b90404'} fillRule="nonzero" d="M10 0C4.477 0 0 4.479 0 10c0 5.523 4.476 10 10 10 5.523 0 10-4.477 10-10S15.524 0 10 0zm0 18.33c-4.602 0-8.331-3.73-8.331-8.33S5.399 1.672 10 1.672c4.602 0 8.331 3.729 8.331 8.328 0 4.601-3.73 8.33-8.331 8.33zm4.896-8.93L11.79 5.46c-.33-.3-.837-.29-1.152.026-.316.315-.327.823-.026 1.152l2.003 2.54H5.357c-.456.005-.822.377-.818.833v.005c0 .46.366.834.818.834h7.236l-1.98 2.511c-.157.156-.245.368-.245.589 0 .22.088.433.245.588.156.157.368.244.589.244.22 0 .432-.087.589-.244l3.106-3.937c.17-.17.258-.404.242-.643-.007-.21-.093-.41-.243-.56V9.4z" transform="translate(2 2)"/>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>

  );
}

export default observer(IconBack);