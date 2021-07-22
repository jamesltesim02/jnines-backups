const { navigator, screen } = window;
// 获取设备信息
const { userAgent } = navigator;
let osType = 'unknow';
if (/Android/i.test(userAgent)) {
  osType = 'android';
}
if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(userAgent)) {
  osType = 'ios';
}

// 是否是移动端
const isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|MQQBrowser)/i.test(userAgent);
// 是否是iPhone X
const isIPhoneX = (osType === 'ios' && screen.height >= 812 && screen.width >= 375);
// 是否支持webp图片编码
const isWebpEnv = (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);

// app信息
let appInfo = {
  // 是否是app
  isApp: false,
  // 是否是混合app
  isHybrid: false,
  // 是否是原生app
  isNative: false,
  // 是否是iOS
  isIos: false,
  // 是否是Android
  isAndroid: false,
  // 系统类型 (iOS, Android)
  osPlatform: '',
  // app版本
  version: '',
  // app User-Agent内容
  appua: '',
};

const appInfoUserAgent = userAgent.split(' NB/');
if (appInfoUserAgent.length > 1) {
  const [typePlat, version] = appInfoUserAgent[1].split('=');
  const [appType, osPlatform] = typePlat.split('-');

  appInfo = {
    isApp: true,
    isHybrid: appType === 'H',
    isNative: appType === 'N',
    isIos: osPlatform === 'iOS',
    isAndroid: osPlatform === 'Android',
    osPlatform,
    version,
    appua: `NB/${appInfoUserAgent[1]}`,
  };
}

export default {
  userAgent,
  osType,
  isMobile,
  standalone: !!navigator.standalone,
  isIos: osType === 'ios',
  isAndroid: osType === 'android',
  isIPhoneX,
  isSafari: /Safari/i.test(userAgent),
  isWeixin: /MicroMessenger/i.test(userAgent),
  isQQ: /\sQQ/i.test(userAgent),
  isWebpEnv,
  appInfo,
};
