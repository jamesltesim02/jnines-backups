const { navigator } = window;
// 获取设备信息
const { userAgent } = navigator;

// 是否支持webp图片编码
const isWebpEnv = (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);


export default {
  isWebpEnv,
  userAgent,
};
