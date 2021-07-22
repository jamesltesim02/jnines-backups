import React, {useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {notification} from "antd";
import dayjs from "dayjs";

function RedEnvelopeAlert() {

  const history = useHistory()

  const location = useLocation()

  useEffect(() => {
    const openNotification = (detail: any) => {
      notification.warn({
        duration: 15,
        className: 'goal-notification',
        placement: 'bottomRight',
        message: '红包活动开启了！点击前往比赛',
        description: (
          <section>
            <div className="red-envelope-push">
              <div>
                {detail.matchName}
              </div>
              <div>
                开启时间：
                {dayjs(detail.actionTime).format('YYYY MM-DD HH:mm:ss')}
              </div>
            </div>
          </section>
        ),
        onClick() {
          history.push(`/detail/${detail.matchId}`)
        }
      });
    };

    // 红包活动开启推送
    const handleNT1001 = (detail: any) => {
      if (location.pathname.includes('/detail')) {
        const pathname = location.pathname.split('/')
        if (pathname[pathname.length - 1] !== detail.matchId) {
          openNotification(detail)
        }
      }else {
        openNotification(detail)
      }
    };

    const handleNt1001 = (evt: any) => handleNT1001(evt.detail);
    window.addEventListener('push-nt-1001', handleNt1001);

    return () => window.removeEventListener('push-nt-1001', handleNt1001);
  }, [location.pathname, history]);

  return (
    <>
    </>
  )
}

export default RedEnvelopeAlert;