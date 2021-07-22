import store from '@/store';

/*
 * 赔率显示转换
 *
 * 1. 接口返回的赔率均为香港赔率
 * 2. 欧洲赔率在香港赔率基础上+1
 * 3. 标准盘(胜平负)都显示为欧洲赔率
*/
export default (source, gtp) => {
  if (store.state.setting.oddsType === 3 && gtp !== 1) {
    return (source || 0).toFixed(2);
  }

  return (((100 * source) + 100) / 100).toFixed(2);
};
