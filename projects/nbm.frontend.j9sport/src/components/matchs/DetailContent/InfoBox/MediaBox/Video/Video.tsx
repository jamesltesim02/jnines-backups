import React from 'react';

import AppConfig from '../../../../../../configs';
import { MediaPath } from '../../../../../../consts/network';

import MediaContainer from '../MediaContainer';

/* eslint-disable react-hooks/exhaustive-deps */
function Video (
  {
    resource,
    active,
    muted,
    ...props
  }: any
) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = React.useState(false);

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
    []
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
      encodeURIComponent(resource || '')
    }&disablescale=true`
  );

  if (muted) {
    liveSrc += '&muted=true';
  }

  return (
    <div className={`video ${active ? 'active' : ''}`}>
      <MediaContainer {...props}>
        <iframe
          ref={iframeRef}
          src={liveSrc}
          title="video"
          scrolling="no"
          allowFullScreen
          allow="autoplay"
        ></iframe>
      </MediaContainer>
    </div>
  )
}

export default Video;
