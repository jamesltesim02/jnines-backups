import React from 'react';
import { observer } from "mobx-react";
import app from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconAndroid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <g fill={app.skin === SkinType.BLACK ? '#633100' : '#ffffff'}>
          <g>
            <g>
              <g>
                <g>
                  <path d="M6 18c0 .6.4 1 1 1h1v3.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V19h2v3.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V19h1c.6 0 1-.4 1-1V8H6v10zM3.5 8C2.7 8 2 8.7 2 9.5v7c0 .8.7 1.5 1.5 1.5S5 17.3 5 16.5v-7C5 8.7 4.3 8 3.5 8zm17 0c-.8 0-1.5.7-1.5 1.5v7c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5zm-5-5.8L16.8.9c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0l-1.5 1.5C13.9 1.2 13 1 12 1s-1.9.2-2.7.6L7.9.1c-.2-.1-.6-.1-.8 0-.1.2-.1.6 0 .8l1.3 1.3C7 3.3 6 5 6 7h12c0-2-1-3.8-2.5-4.8zM10 5H9V4h1v1zm5 0h-1V4h1v1z" transform="translate(-865 -539) translate(569 224) translate(24 205) translate(233 98) translate(39 12)"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default observer(IconAndroid);