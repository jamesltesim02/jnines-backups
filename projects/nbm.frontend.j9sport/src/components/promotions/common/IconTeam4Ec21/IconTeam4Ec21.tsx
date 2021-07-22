import React from 'react';
import mergeClass from '../../../../utils/mergeClass';

import Image01 from './images/奥地利.png';
import Image02 from './images/北马其顿.png';
import Image03 from './images/比利时.png';
import Image04 from './images/波兰.png';
import Image05 from './images/丹麦.png';
import Image06 from './images/德国.png';
import Image07 from './images/俄罗斯.png';
import Image08 from './images/法国.png';
import Image09 from './images/芬兰.png';
import Image10 from './images/荷兰.png';
import Image11 from './images/捷克.png';
import Image12 from './images/克罗地亚.png';
import Image13 from './images/葡萄牙.png';
import Image14 from './images/瑞典.png';
import Image15 from './images/瑞士.png';
import Image16 from './images/斯洛伐克.png';
import Image17 from './images/苏格兰.png';
import Image18 from './images/土耳其.png';
import Image19 from './images/威尔士.png';
import Image20 from './images/乌克兰.png';
import Image21 from './images/西班牙.png';
import Image22 from './images/匈牙利.png';
import Image23 from './images/意大利.png';
import Image24 from './images/英格兰.png';

import DefaultIcon from './images/default.png';
const ICON_MAP: any = {
  '奥地利': Image01,
  '北马其顿':Image02 ,
  '比利时': Image03,
  '波兰': Image04,
  '丹麦': Image05,
  '德国': Image06,
  '俄罗斯': Image07,
  '法国': Image08,
  '芬兰': Image09,
  '荷兰': Image10,
  '捷克': Image11,
  '克罗地亚':Image12 ,
  '葡萄牙': Image13,
  '瑞典': Image14,
  '瑞士': Image15,
  '斯洛伐克':Image16 ,
  '苏格兰': Image17,
  '土耳其': Image18,
  '威尔士': Image19,
  '威尔斯': Image19,
  '乌克兰': Image20,
  '西班牙': Image21,
  '匈牙利': Image22,
  '意大利': Image23,
  '英格兰': Image24,
}
function IconTeam4Ec21 (
  {
    name,
    className,
    circle = false,
    size = 66,
    width,
    height
  }: {
    name: string,
    className?: string,
    circle?: boolean,
    size?: number,
    width?: number,
    height?: number
  }
) {
  const src = (ICON_MAP[name?.replace(/\s/g,'')] || DefaultIcon);

  const styles = {
    width: width || size,
    height: height || size,
    backgroundImage: `url(${src})`
  }

  return (
    <i
      style={styles}
      className={mergeClass(
        'icon-team-for-ec21',
        circle ? 'circle' : undefined,
        className
      )}
    />
  );
}

export default IconTeam4Ec21;
