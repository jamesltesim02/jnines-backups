import HomeLiteHeader from './HomeLiteHeader';
import portals from './portals';


/**
 * FONT_ID对照
 * 亚游: 102001011JIaThBA (B79)
 * 凯时: 1000610117Qe1Gj0 (A06)
 * 酷游: 102061011cYgTGB2 (B06 凯发电游)
 * 和记: 1010410116Ea5Hq7 (E03)
 * 永乐: 101031011k3Lx9Tf (E04)
 */
const { FRONT_ID } = window.NBConfig;

export default portals[FRONT_ID] || HomeLiteHeader;
