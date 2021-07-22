
import AppConfig from '../configs';
import appStore from '../stores/app';

import memberStore from '../stores/member';

export function toMainSite (url: string, blank?: boolean) {
  const href = getMainSiteUrl(url);

  if (blank) {
    window.open(href);
  } else {
    window.top.location.href = href;
  }
}

export function getMainSiteUrl (url: string) {
  // let targetPath = url;
  let [targetPath, hash] = url.split('#');

  // 判断是否登录
  if (memberStore.isLoged) {
    if (url.indexOf('?') === -1) {
      targetPath += '?';
    } else {
      targetPath += '&';
    }
    targetPath += `agtoken=${memberStore.agToken}`;
  }

  if (hash) {
    targetPath += `#${hash}`;
  }

  return new URL(
    targetPath,
    (
      appStore.origin
      ||
      appStore.mainSiteDomain
      ||
      AppConfig.DEFAULT_ORIGIN
    )
  ).toString();
}
