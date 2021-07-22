import flatObject from '../../utils/flatObject';
import { Locales } from '../../consts/app';

import zh from './zh-CN.message'
import en from './en-US.message'

export default {
  [Locales.ZH_CN]: flatObject(zh),
  [Locales.EN_US]: flatObject(en),
}
