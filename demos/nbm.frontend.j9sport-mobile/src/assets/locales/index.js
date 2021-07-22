import flatObject from '../../utils/flatObject';
import { Locales } from '../../consts/app';

import zh from './zh-CN.message'
import en from './en-US.message'

const locales = {
  [Locales.ZH_CN]: flatObject(zh),
  [Locales.EN_US]: flatObject(en),
}

export default locales;
