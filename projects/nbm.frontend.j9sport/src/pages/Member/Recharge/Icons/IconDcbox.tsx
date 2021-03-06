import React from 'react';
import { observer } from "mobx-react";
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconDcbox() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <filter id="u94chq1r3a-dcbox">
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.956863 0 0 0 0 0.835294 0 0 0 0 0.596078 0 0 0 1.000000 0" />
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g fill={app.skin === SkinType.BLACK ? "#fdecc1" : "#b90404"}>
          <g>
            <g>
              <g>
                <path d="M17.333 2.667c7.364 0 13.334 5.97 13.334 13.333 0 7.245-5.779 13.14-12.978 13.329l-.356.004H2.667V2.667h14.666zm0 1.86H4.54v22.946h12.794c6.337 0 11.473-5.137 11.473-11.473 0-6.225-4.958-11.292-11.14-11.468l-.333-.005zm0 2.473c3.73 0 7.025 2.29 8.37 5.684l.12.32h-1.886C22.957 10.23 20.325 9 17.333 9c-3.866 0-7 3.134-7 7s3.134 7 7 7c2.886 0 5.438-1.379 6.494-3.995h1.992C24.557 22.569 21.176 25 17.333 25c-4.97 0-9-4.03-9-9s4.03-9 9-9z" transform="translate(-378 -556) translate(268 547) translate(0 6) translate(110 3)"/>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>

  );
}

export default observer(IconDcbox);