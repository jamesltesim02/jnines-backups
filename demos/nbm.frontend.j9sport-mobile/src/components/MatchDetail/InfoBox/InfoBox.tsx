import React from 'react';
import { MatchState, MediaType } from '../../../consts/match';
import Match from '../../../stores/matchs/Match';
import DetailInfo from './DetailInfo';
import LmtInfo from './LmtInfo';
import VideoInfo from './VideoInfo';
import { Icon } from 'antd-mobile';
import { throttle } from 'lodash';
import IconFullscreen from '../../icons/IconFullscreen';

const MEDIA_COMPS = {
  [MediaType.INFO]: DetailInfo,
  [MediaType.VIDEO]: VideoInfo,
  [MediaType.LMT]: LmtInfo
};

function InfoBox (
  {
    match,
    fullscreen,
    onFullscreenChange
  }: {
    match: Match,
    fullscreen: boolean,
    onFullscreenChange: (fullscreen: boolean) => void
  }
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const items: MediaType[] = [MediaType.INFO, ...match.medias];
  const [active, setActive] = React.useState(
    (
      match.isLive
      &&
      match.medias.length
    ) ? (
      match.liveUrl
      ? MediaType.VIDEO
      : MediaType.LMT
    ) : MediaType.INFO
  );
  const [styles, setStyles] = React.useState<any>({
    width: '100%',
    height: '100%'
  });

  const calcStyles = React.useCallback(
    () => {
      if (!containerRef.current) {
        return;
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      const proportion = containerWidth / containerHeight;
      if (
        active !== MediaType.VIDEO
        ||
        match.matchState !== MatchState.LIVE
        ||
        !containerRef.current
        ||
        containerRect.y === 45
        ||
        fullscreen
      ) {
        setStyles({
          width: containerWidth,
          height: containerHeight
        });
        return;
      }

      if (containerRect.y <= 45 - containerHeight) {
        setStyles((styles: any) => ({
          ...styles,
          top: 98,
          transition: 'all .05s ease-out'
        }));
        return;
      }

      if (containerRect.y <= (45 - (containerHeight * .3))) {
        const height = Math.min(
          containerHeight * .7,
          document.documentElement.clientHeight * .4
        );
        setStyles((styles: any) => ({
          ...styles,
          width: height * proportion,
          height,
          top: 45,
          transition: 'all .05s ease-out'
        }));
        return;
      }

      const height = containerHeight + containerRect.y - 45;
      setStyles({
        width: height * proportion,
        height,
        position: 'fixed',
        top: 45,
        right: containerRect.right - containerWidth,
        transition: 'all .05s ease-out'
      });
    },
    [containerRef, active, fullscreen, match.matchState, setStyles]
  );

  React.useEffect(
    () => {
      const handleScrollEVent = throttle(calcStyles, 16);
      window.addEventListener('scroll', handleScrollEVent);
      window.addEventListener('resize', handleScrollEVent);
      calcStyles();
      return () => {
        window.removeEventListener('scroll', handleScrollEVent);
        window.removeEventListener('resize', handleScrollEVent);
      };
    },
    [calcStyles]
  );

  return (
    <div
      ref={containerRef}
      className="info-box-container"
    >
      <div
        className="info-box"
        style={styles}
      >
        {
          items.map((type: MediaType) => {
            const MediaComp = MEDIA_COMPS[type];
            return (
              <MediaComp
                key={type}
                match={match}
                active={type === active}
                onActiveChange={setActive}
              />
            );
          })
        }
        {
          active !== MediaType.INFO ? (
            <button
              className="btn-close"
              onClick={() => {
                if (fullscreen) {
                  onFullscreenChange(false);
                }
                setActive(MediaType.INFO);
              }}
            >
              <Icon
                type="cross-circle-o"
                size="xs"
              />
            </button>
          ) : null
        }
        {
          active === MediaType.VIDEO ? (
            <button
              className="btn-fullscreen"
              onClick={() => onFullscreenChange(!fullscreen)}
            >
              <IconFullscreen
                fullscreen={fullscreen}
              />
            </button>
          ) : null
        }
      </div>
    </div>
  );
}

export default InfoBox;
