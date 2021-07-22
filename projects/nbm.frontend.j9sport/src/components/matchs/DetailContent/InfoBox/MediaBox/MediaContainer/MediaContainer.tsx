import React from 'react';
import {
  LoadingOutlined,
  SelectOutlined,
  BlockOutlined,
  BorderOuterOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import mergeClass from '../../../../../../utils/mergeClass';

function MediaContainer (
  {
    children,
    fixable = false,
    fullscreen = false,
    fullable = false,
    onClick = () => {},
    onToggleFullscreen = () => {}
  }: {
    children: any,
    bottomFreeHeight?: number,
    fixable?: boolean,
    fullscreen?: boolean,
    fullable?: boolean,
    className?: string,
    onClick?: () => void,
    onToggleFullscreen?: (fullscreen: boolean) => void
  }
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = React.useState(false);
  const [rect, setRect] = React.useState<any>({});
  const [movable, setMoveable] = React.useState(false);

  const handleFixedChange = () => {
    if (!ref.current || !ref.current?.parentElement) {
      return;
    }
    const crect = ref.current.parentElement.getBoundingClientRect();

    if (!fixed) {
      setRect({
        position: 'fixed',
        width: crect.width,
        height: crect.height,
        top: crect.top,
        left: crect.left,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, .5)',
      });
      setFixed(true);
      setTimeout(
        () => {
          setRect({
            position: 'fixed',
            width: crect.width,
            height: crect.height,
            top: document.body.clientHeight - crect.height - 10,
            left: document.body.clientWidth - crect.width - 10,
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, .5)',
            transition: 'left .3s ease-out, top .3s ease-out'
          });
        },
        50
      );
    } else {
      setRect({
        position: 'fixed',
        width: crect.width,
        height: crect.height,
        top: crect.top,
        left: crect.left,
        boxShadow: 'none',
        transition: 'left .3s ease-out, top .3s ease-out'
      });
      setTimeout(
        () => {
          setRect({});
          setFixed(false)
        },
        300
      );
    }
  };

  const handleMoveActive = () => {
    if (!fixed) {
      return;
    }

    setMoveable(true);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      if (!fixed || !movable) {
        return;
      }

      const init: any = {
        rect: {...rect},
        minTop: 0,
        minLeft: 0,
        maxTop: document.body.clientHeight - rect.height,
        maxLeft: document.body.clientWidth - rect.width
      }

      const handleMove = (event: MouseEvent) => {
        if (!movable) {
          return;
        }
        if (!init.x) {
          init.x = event.clientX;
          init.y = event.clientY;
          return;
        }

        const left = Math.max(
          Math.min(
            init.rect.left + (event.clientX - init.x),
            init.maxLeft
          ),
          init.minLeft
        );
        const top = Math.max(
          Math.min(
            init.rect.top + (event.clientY - init.y),
            init.maxTop
          ),
          init.minTop
        );

        setRect({
          ...init.rect,
          left,
          top,
          transition: 'none'
        });
      };
      const handleInactive = () => setMoveable(false);

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleInactive);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleInactive);
      }
    },
    [fixed, movable, setMoveable, setRect]
  );

  React.useEffect(
    () => {
      if (!ref.current)  {
        return;
      }
      const handleDoubleClick = (event: MouseEvent) => {
        console.log('double click event.');
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
      };
      ref.current.addEventListener('dblclick', handleDoubleClick, { capture: true });
    },
    [ref.current]
  );

  return (
    <div
      ref={ref}
      className={mergeClass({
        'container': true,
        'media-container': true,
        fixed
      })}
      style={rect}
    >
      <LoadingOutlined />
      {children}
      {
        fixed ? (
          <>
            {
              movable
              ? <i className="move-cover" />
              : null
            }
            <button
              className="btn-move"
              onClick={onClick}
              onMouseDown={handleMoveActive}
            >
              <BorderOuterOutlined />
            </button>
          </>
        ) : null
      }
      {
        fixable ? (
          <button
            className="btn-toggle-fix"
            onClick={handleFixedChange}
          >
            {
              fixed
              ? (<SelectOutlined />)
              : (<BlockOutlined />)
            }
          </button>
        ) : null
      }
      {
        fullable ? (
          <button
            className="btn-toggle-fullscreen"
            onClick={() => onToggleFullscreen(!fullscreen)}
          >
            {
              fullscreen
              ? (<FullscreenExitOutlined />)
              : (<FullscreenOutlined />)
            }
          </button>
        ) : null
      }
    </div>
  );
}

export default MediaContainer;
