import { History, Location } from 'history';
import AppConfig from "../configs";

import appStore from '../stores/app';
import memberStore from '../stores/member';

function toRoute (fn: Function) {
  window.dispatchEvent(
    new CustomEvent('route', { detail: fn })
  );
}

export const toSignin = () => {
  if (AppConfig.THIRD_MODE) {
    let targetUrl = appStore.loginUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      if (!appStore.origin) {
        return;
      }
      targetUrl = new URL(targetUrl, appStore.origin).toString();
    }
    window.location.href = targetUrl;
  } else {
    toRoute((history: History, location: Location) => {
      history.replace(`/login?from=${location.pathname}`);
    });
  }
};
export const toSignup = () => {
  window.location.href = appStore.origin;
};
export const toRecharge = () => {
  window.location.href = appStore.origin;
};
export const toWithdrawl = () => {
  window.location.href = appStore.origin;
};