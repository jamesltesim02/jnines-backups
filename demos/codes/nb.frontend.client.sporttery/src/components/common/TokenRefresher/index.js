import TokenRefresher from './TokenRefresher';
import portals from './portals';

/**
 * FONT_ID对照
 * 亚游: 102001011JIaThBA
 * 凯时: 1000610117Qe1Gj0
 * 酷游: 102061011cYgTGB2 (凯发电游)
 * 和记: 1010410116Ea5Hq7
 * 永乐: 101031011k3Lx9Tf
 */
const { FRONT_ID } = window.NBConfig;

export default portals[FRONT_ID] || TokenRefresher;
