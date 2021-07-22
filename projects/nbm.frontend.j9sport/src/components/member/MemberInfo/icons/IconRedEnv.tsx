import React from 'react';
import IconMember from './IconMember';

function IconRedEnv (
  props : {
    /** 图标大小 */
    size?: number,
    /** 是否高亮 */
    active?: boolean
  }
) {
  return (
    <IconMember
      name="redenv"
      {...props}
    >
      <g transform="translate(-344 -382) translate(344.167 382)">
        <circle cx="24" cy="24" r="24" fill="url(#redenv-linear1)"/>
        <g fill="url(#redenv-linear2)" transform="translate(12 12)">
          <path d="M22.444 5.256V1.245C22.444.553 21.89 0 21.199 0H2.8C2.11 0 1.556.553 1.556 1.245v4.011S3.77 7.331 8.334 9.13c0 0-3.389.83-6.778-1.314v15.492c0 .415.346.692.692.692h19.504c.415 0 .692-.346.692-.692V7.885c-3.458 2.005-6.778 1.314-6.778 1.314 4.91-1.868 6.778-3.943 6.778-3.943zM12 8.784c1.937 0 3.527 1.59 3.527 3.527S13.937 15.84 12 15.84s-3.527-1.591-3.527-3.528c0-2.006 1.59-3.527 3.527-3.527z"/>
        </g>
      </g>
    </IconMember>
  )
}

export default IconRedEnv;
