import React from 'react';
import IconMember from './IconMember';

function IconRules (
  props : {
    /** 图标大小 */
    size?: number,
    /** 是否高亮 */
    active?: boolean
  }
) {
  return (
    <IconMember
      name="rules"
      {...props}
    >
      <g transform="translate(-138 -482) translate(138.5 482)">
        <circle cx="24" cy="24" r="24" fill="url(#rules-linear1)" />
        <g fill="url(#rules-linear2)" transform="translate(12 12)">
          <path d="M18.989 1.5v13.905H6.218c-1.44 0-2.607 1.167-2.607 2.606 0 1.44 1.167 2.607 2.607 2.607h14.465V4.979h1.668v17.372H2.803c-.72 0-1.303-.584-1.303-1.303V2.803c0-.72.583-1.303 1.303-1.303H18.99zm-.013 15.638v1.733H7.065v-1.733h11.91z" />
        </g>
      </g>
    </IconMember>
  )
}

export default IconRules;
