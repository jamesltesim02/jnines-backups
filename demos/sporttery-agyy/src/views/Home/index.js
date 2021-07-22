import Home from './Home';
import HomeLite from './HomeLite';
import { AppModes } from '@/config/constants';

const {
  NBConfig: { APP_MODE },
} = window;
const HomePage = APP_MODE === AppModes.STANDALONE_LITE ? HomeLite : Home;

export default HomePage;
