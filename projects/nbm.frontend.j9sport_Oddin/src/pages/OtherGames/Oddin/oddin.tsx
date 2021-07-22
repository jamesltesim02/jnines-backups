import React from 'react';
import { observer } from "mobx-react";
import memberStore from "../../../stores/member";
import appStore from "../../../stores/app";

const CURRENCY_MAP = {
  1: 'CNY',
  2: 'USD',
  101: 'CNY'
} as any;

const winTop = window.top || window

const OddinConfig = {
  brandToken: "bc58d2f6-86cf-41c0-87c1-fe80ecc5b0e8",
  baseUrl: "https://bifrost.integration.oddin.gg",
  customDomain: winTop.location.hostname,
}


function Oddin () {
  React.useEffect(
    () => {
      const win: any = window;
      new Promise<void>((resolve, reject) => {
        if (win.oddin) {
          resolve();
        }
        const el = document.createElement('script');
        el.addEventListener('load', () => resolve());
        el.src = 'https://bifrost.oddin.gg/script.js';
        document.body.appendChild(el);
      }).then(() => {
        const {baseUrl, brandToken, customDomain} = OddinConfig
        win.oddin.buildBifrost({
          token: memberStore.memberInfo.token,
          brandToken,
          baseUrl,
          language: appStore.locale,
          currency: CURRENCY_MAP[memberStore.currency],
          contentElement: "#oddinContainer",
          customDomain,
          eventHandler: (e: any) => {
      
          }
        });
      })
    },
    []
  );

  return (
    <div id="oddinContainer"></div>
  );
}


// function Oddin() {

//   const {baseUrl, brandToken, customDomain} = OddinConfig

//   const [src, setSrc] = useState('')

//   const buildUrl = (url: string, params: object | string) => {

//     if (typeof params === 'string') {
//       return url + params
//     }

//     const paramsStr = Object.entries(params).map(
//       ([key, value], index ) => {
//         if (!value) {
//           return ;
//         }
//         return index === 0 ? `${key}=${value}` : `&${key}=${value}`
//       }
//     ).join('')

//     return `${url}?${paramsStr}`
//   }

//   useEffect(() => {
//     const xhr = new XMLHttpRequest();
//     const src = buildUrl(baseUrl, {
//       referer: window.location.origin + window.location.pathname,
//       lang: appStore.locale,
//       currency: CURRENCY_MAP[memberStore.currency],
//       token: memberStore.memberInfo.token,
//       brandToken: brandToken,
//       // customDomain: customDomain
//     })
//     xhr.open('HEAD',src)
//     xhr.onreadystatechange = function () {
//       if (xhr.status === 200) {
//         setSrc(src)
//         return ;
//       }
//       if(xhr.status === 403) {
//         setSrc(buildUrl(baseUrl, '/access-denied.html'))
//       }else{
//         setSrc(buildUrl(baseUrl, '/maintenance.html'))
//       }
//     }
//     xhr.send()

//     window.addEventListener('message',(r) => {
//       console.log(r)
//     },{once: true})

//     return () => {
//       window.removeEventListener('message',() => {})
//     }
//   },[baseUrl, brandToken, customDomain])

//   return (
//     <iframe
//       className="other-games-oddin"
//       src={src}
//       frameBorder={0}
//     />
//   );
// }

export default observer(Oddin);