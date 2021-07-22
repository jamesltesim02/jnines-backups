import HomeOne from './HomeOne';
import HomeTwo from './HomeTwo';
import HomeThree from './HomeThree';
import { AppModes } from '@/config/constants';

import portals from './portals';

const {
  APP_MODE,
  HOME_STYLE,
  /**
   * FONT_ID对照
   * 亚游: 102001011JIaThBA
   * 凯时: 1000610117Qe1Gj0 (A06)
   * 酷游: 102061011cYgTGB2 (B06 凯发电游)
   * 和记: 1010410116Ea5Hq7 (E03)
   * 永乐: 101031011k3Lx9Tf (E04)
   */
  FRONT_ID,
} = window.NBConfig;

export default portals[FRONT_ID] || (() => {
  const isLite = APP_MODE === AppModes.STANDALONE_LITE;
  const HomePageSOne = isLite && HOME_STYLE === 2 ? HomeTwo : HomeOne;
  return isLite && HOME_STYLE === 3 ? HomeThree : HomePageSOne;
})();
