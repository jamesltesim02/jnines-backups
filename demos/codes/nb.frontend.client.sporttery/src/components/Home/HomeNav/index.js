import HomeNavOne from './HomeNavOne';
import HomeNavTwo from './HomeNavTwo';

export default /^3$/.test(window.NBConfig.HOME_STYLE) ? HomeNavTwo : HomeNavOne;
