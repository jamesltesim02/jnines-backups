
import { Urls } from '../configs';
import { MainSitePath } from '../consts/network';
import appStore from '../stores/app';

export function toMainSite (url: string) {
  window.top.location.href = new URL(
    url,
    (
      appStore.origin
      ||
      Urls.DEFAULT_ORIGIN
    )
  ).toString()
}

export const toSignin = () => toMainSite(MainSitePath.SIGNIN);
export const toMember = () => toMainSite(MainSitePath.MEMBER);
export const toDeposit = () => toMainSite(MainSitePath.DEPOSIT);
