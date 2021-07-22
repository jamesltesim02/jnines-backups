import React from 'react';
import images from './images';
import { Sports } from '../../../consts/match';
import { observer } from "mobx-react";
import app from "../../../stores/app";

const SPORT_TO_NAME: Record<Sports, string> = {
  [Sports.SOCCER]: 'soccer',
  [Sports.BASKETBALL]: 'basketball',
  [Sports.TENNIS]: 'tennis',
  [Sports.ESPORTS]: 'egame',
  [Sports.VOLLEYBALL]: 'volleyball',
  [Sports.TABLETENNIS]: 'tabletennis',
  [Sports.ICEHOCKEY]: 'icehockey',
  [Sports.BASEBALL]: 'baseball',
};

function IconNav (
  {
    name,
    sportId
  }: {
    name?: string,
    sportId?: Sports
  }
) {
  const type = name || SPORT_TO_NAME[sportId as Sports]
  const src =  images(`./${type}-${app.skin}.png`)

  return (
    <img
      alt=""
      className="icon-nav"
      src={src}
    />
  );
}

export default observer(IconNav);
