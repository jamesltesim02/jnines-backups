import React from 'react';
import { observer } from "mobx-react";
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconMarkets() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <defs>
        <filter id="hjiasbl4ua">
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.956863 0 0 0 0 0.835294 0 0 0 0 0.596078 0 0 0 1.000000 0" />
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <path fill="#D8D8D8" fillOpacity="0" d="M0 0H32V32H0z" transform="translate(-378 -300) translate(238 291) translate(0 9) translate(140)" />
                <g transform="translate(-378 -300) translate(238 291) translate(0 9) translate(140)">
                  <g>
                    <path fill={app.skin === SkinType.BLACK ? "#fdecc1" : "#b90404"} d="M28.004 26.667H4.002c-2.209 0-4-1.837-4-4.102V4.101C.003 1.836 1.794 0 4.003 0h24.002c2.208 0 3.999 1.836 3.999 4.101v18.466c0 1.088-.42 2.131-1.17 2.9-.75.77-1.768 1.201-2.829 1.2M3.336 1.953h25.43c1.105 0 2 .896 2 2V22.62c0 1.105-.895 2-2 2H3.337c-1.104 0-2-.895-2-2V3.953c0-1.104.896-2 2-2zm24.077 12.15l-3.975-3.88c-.785-.767-2.054-.767-2.837 0l-.176.172v1.7h-.005c.002.027.005.052.005.078 0 .327-.271.592-.606.592-.037 0-.071-.003-.105-.01v.01h-7.478c-.082-.013-.164-.018-.248-.018-.888 0-1.604.702-1.604 1.57 0 .048.002.097.008.146v1.273c-.309.178-.712.14-.978-.12L5.44 11.73c-.314-.307-.314-.803 0-1.11L9.412 6.74c.266-.26.669-.298.977-.12v1.268c-.005.049-.008.1-.008.152 0 .867.72 1.569 1.604 1.569.058 0 .114-.003.169-.008h3.45c.322-.007.58-.262.58-.579 0-.316-.258-.57-.58-.578h-3.318v-.01c-.035.004-.069.01-.106.01-.334 0-.606-.265-.606-.592 0-.036.003-.07.01-.103h-.01V6.08l-.176-.173c-.785-.766-2.055-.766-2.837 0L4.589 9.791c-.785.766-.785 2.006 0 2.773l3.972 3.88c.785.766 2.055.766 2.837 0l.176-.173v-1.885h.01c.04-.222.206-.4.422-.464h.35l.035.01v-.01h7.639c.88-.007 1.588-.707 1.588-1.566 0-.057-.002-.11-.008-.165v-1.255c.309-.18.714-.14.978.12l3.972 3.883c.313.306.313.802 0 1.109l-3.972 3.877c-.266.26-.67.3-.978.12v-.861c.006-.054.008-.108.008-.165 0-.867-.719-1.57-1.604-1.57h-6.346c-.02-.002-.044-.002-.065-.002-.335 0-.606.265-.606.592 0 .327.271.592.606.592.02 0 .044 0 .065-.003h5.946v.013l.042-.013h.33c.255.07.442.299.442.569 0 .025-.003.051-.006.077h.006v1.312l.176.172c.785.767 2.055.767 2.837 0l3.972-3.882c.783-.767.783-2.007 0-2.773z" transform="translate(0 2.667)" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default observer(IconMarkets);