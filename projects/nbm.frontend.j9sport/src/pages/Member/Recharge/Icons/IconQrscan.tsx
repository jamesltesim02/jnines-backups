import React from 'react';
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconQrscan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <filter id="u94chq1r3a-qrcode">
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.956863 0 0 0 0 0.835294 0 0 0 0 0.596078 0 0 0 1.000000 0" />
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <g>
                  <path fill="#D8D8D8" fillOpacity="0" d="M0 0H32V32H0z" transform="translate(-378 -877) translate(268 695) translate(0 173) translate(0 9) translate(110)"/>
                  <path fill={app.skin === SkinType.BLACK ? "#fdecc1" : "#b90404"} d="M30.666 21.101v5.102c0 2.465-1.998 4.464-4.463 4.464H21.1v-1.914h5.102c1.409 0 2.55-1.141 2.55-2.55V21.1h1.913zm-27.42 0v5.102c0 1.409 1.142 2.55 2.551 2.55h5.101v1.914h-5.1c-2.466 0-4.465-1.999-4.465-4.464V21.1h1.913zm27.42-6.434v2.666H1.334v-2.666h29.334zM26.204 1.333c2.465 0 4.464 1.999 4.464 4.464V10.9h-1.914V5.796c0-1.409-1.141-2.55-2.55-2.55H21.1V1.332zm-15.304 0v1.913H5.796c-1.409 0-2.55 1.142-2.55 2.551v5.101H1.332v-5.1c0-2.396 1.886-4.35 4.254-4.46l.21-.005H10.9z" transform="translate(-378 -877) translate(268 695) translate(0 173) translate(0 9) translate(110)"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>

  );
}

export default IconQrscan;