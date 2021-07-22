import React from 'react';
import { observer } from "mobx-react";
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconUsdtGuide() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <filter id="u94chq1r3a">
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.956863 0 0 0 0 0.835294 0 0 0 0 0.596078 0 0 0 1.000000 0" />
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g transform="translate(-378 -366) translate(248 357) translate(0 6) translate(130 3)">
                <g>
                  <path fill={app.skin === SkinType.BLACK ? "#fdecc1" : "#b90404"} fillRule="nonzero" d="M21.444 10H3.89c-.293 0-.585-.15-.78-.4l-2.926-4c-.244-.35-.244-.85 0-1.2l2.926-4c.195-.25.487-.4.78-.4h17.555c.537 0 .976.45.976 1v8c0 .55-.44 1-.976 1zM3.875 8.6h17.272V1.267H3.875L1.52 4.933 3.875 8.6zM21.445 23H3.888c-.536 0-.975-.45-.975-1v-8c0-.55.439-1 .975-1h17.555c.293 0 .586.15.78.4l2.926 4c.244.35.244.85 0 1.2l-2.925 4c-.195.25-.488.4-.78.4zM4.532 21.333H21.43L23.733 18l-2.304-3.333H4.533v6.666zm8.134-6.666c-.537 0-.976-.343-.976-.762v-3.81c0-.419.44-.762.976-.762s.975.343.975.762v3.81c0 .419-.439.762-.975.762zm0 13.333c-.537 0-.976-.429-.976-.952v-4.762c0-.524.44-.953.976-.953s.975.429.975.953v4.762c0 .523-.439.952-.975.952z" transform="translate(4 2.667)"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>

  );
}

export default observer(IconUsdtGuide);