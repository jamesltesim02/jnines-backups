import Options from "./Options";
import ThirdOptions from './ThirdOptions';

import AppConfig from '../../../../configs';


import "./Options.less"

export default (AppConfig.THIRD_MODE ? ThirdOptions : Options);