import React from 'react';
import { ResourceDir } from '../../../consts/network';
import Image from '../../common/Image';

function IconTeam (
  {
    src,
    name,
    size,
    type = ResourceDir.COMPETITOR
  }: {
    src?: string,
    name: string,
    size: number,
    type?: ResourceDir
  }
) {

  const style = {
    width: size,
    height: size,
    fontSize: Math.max(size / 2, 12)
  };

  if(!src) {
    return (
      <i
        className="icon-team-logo"
        style={style}
      >{name.charAt(0)}</i>
    );
  }

  return (
    <Image
      className="icon-team-logo"
      style={style}
      src={src as string}
      dir={type}  
    />
  );
}

export default IconTeam;
