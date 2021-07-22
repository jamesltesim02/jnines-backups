import store from '@/store';

/*
 * 赔率显示转换
 *
 * 1. 接口返回的赔率均为香港赔率
 * 2. 欧洲赔率在香港赔率基础上+1
 * 3. 标准盘(胜平负)都显示为欧洲赔率
*/
export default (source, gtp) => {
  const oddType = store.state.setting.oddsType;
  const addNum = oddType === 3 && gtp !== 1 ? 0 : 1;
  const newOdds = addNum + (source || 0) + 0.00000005;
  return `${newOdds}`.replace(/(\d+\.\d{2})\d*/, '$1');
};
