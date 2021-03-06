import React from 'react';
import IconMember from './IconMember';

function IconRecords (
  props : {
    /** 图标大小 */
    size?: number,
    /** 是否高亮 */
    active?: boolean
  }
) {
  return (
    <IconMember
      name="records"
      {...props}
    >
      <g transform="translate(-447 -382) translate(447 382)">
        <circle cx="24" cy="24" r="24" fill="url(#records-linear1)"/>
        <g fill="url(#records-linear2)" transform="translate(12 12)">
        <path d="M1.233 10.68c.285-.206.647-.27.986-.175l.124.043 9.56 4.036 9.561-3.718c.364-.145.777-.095 1.095.133.278.198.456.505.493.84l.006.127v8.63c.003.6-.445 1.107-1.041 1.177l-.133.009H1.924c-.6-.003-1.103-.456-1.167-1.052l-.007-.133v-8.956c-.004-.38.177-.737.484-.961h-.001zM4.839 1.5h14.13c.695.015 1.267.554 1.323 1.247l.004.13v6.938l-8.394 3.26L3.51 9.515v-6.64c-.01-.695.507-1.286 1.198-1.367l.13-.009h14.13H4.838zm10.782 5.361H8.185c-.42.001-.767.328-.793.747-.026.42.277.787.694.84l.1.006h7.436c.42 0 .768-.327.794-.746.027-.42-.277-.788-.693-.841l-.1-.006h-.002zm0-2.922H8.185c-.42-.002-.77.324-.798.745-.028.42.276.79.693.843l.105.007h7.437c.419-.001.765-.326.793-.744.028-.417-.272-.785-.687-.842l-.106-.008z"/>
        </g>
      </g>
    </IconMember>
  )
}

export default IconRecords;
