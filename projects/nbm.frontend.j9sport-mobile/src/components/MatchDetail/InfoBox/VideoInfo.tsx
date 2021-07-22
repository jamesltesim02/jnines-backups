import React from 'react';
import Match from '../../../stores/matchs/Match';

import AppConfig from '../../../configs';
import { MediaPath } from '../../../consts/network';
import ItemContainer from './ItemContainer';

function VideoInfo (
  {
    match,
    active
  }: {
    match: Match
    active: boolean,
  }
) {

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = React.useState(false);
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      if (!iframeRef?.current) {
        return;
      }

      const handleIframeLoad = () => setIframeReady(true);
      iframeRef.current.addEventListener('load', handleIframeLoad);
      return () => {
        if (!iframeRef?.current) {
          return;
        }
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    },
    [iframeRef]
  );

  React.useEffect(
    () => {
      if (!iframeRef?.current || !iframeReady) {
        return;
      }

      iframeRef.current.contentWindow?.postMessage(
        active,
        AppConfig.MEDIA_URL
      );
    },
    [iframeRef, iframeReady, active]
  );

  let liveSrc = (
    `${
      AppConfig.MEDIA_URL
    }${
      MediaPath.VIDEO
    }?url=${
      encodeURIComponent(match.videoSrc || '')
    }&disablescale=true`
  );

  // if (muted) {
  //   liveSrc += '&muted=true';
  // }

  return (
    <ItemContainer
      className="video-info"
      active={active}
    >
      <iframe
        ref={iframeRef}
        src={liveSrc}
        title="video"
        scrolling="no"
        allowFullScreen
        allow="autoplay"
      ></iframe>
    </ItemContainer>
  );
}

export default VideoInfo;
