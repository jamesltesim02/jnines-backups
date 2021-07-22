import React from "react";
import sportsImgBase64 from "../icon-sports";
import app from "../../../stores/app";
import {SkinType} from "../../../consts/app";

// 左侧tab,在这添加项目
const sports = {
  '-1': 'my-matches',
  1: 'multiple',
  2: 'live',
  10: 'football',
  11: 'basketball',
  12: 'tennis',
  13: 'volleyball',
  14: 'pingpong',
  15: 'icehockey',
  16: 'baseball',
  99: 'esports'
}

function IconSport(
  {
    type = 10,
    active = false,
    dark = app.skin === SkinType.BLACK
  }
) {
  const darkStr = dark ? '_dark' : ''
  const activeStr = active ? '_active' : ''
  const imageBase64 = sportsImgBase64(`./${sports[type]}${darkStr}${activeStr}.png`)

  return (
    <img alt="" src={imageBase64} />
  )
}


export default IconSport;
