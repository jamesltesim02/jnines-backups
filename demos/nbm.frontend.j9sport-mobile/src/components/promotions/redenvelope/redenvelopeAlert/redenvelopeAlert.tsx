import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import matchs from "../../../../stores/matchs/Matchs";
import member from "../../../../stores/member";
import redImg from "../img/red-alert.png"

function RedEnvelopeAlert() {

  const location = useLocation()
  const history = useHistory()

  const [showAlert, setShowAlert] = useState(false)

  const [matchId, setMatchId] = useState(null)

  useEffect(() => {
    if (matchs.detail) {
      if (matchs.detail.activityInfo) {
        setShowAlert(false)
      }
    }

    if (!member.isLoged) {
      return;
    }

    // 红包活动开启推送
    const handleNt1001 = ({detail}: any) => {
      if (location.pathname.includes('/detail')) {
        const pathname = location.pathname.split('/')
        if (pathname[pathname.length - 1] !== detail.matchId) {
          setShowAlert(true)
          setMatchId(detail.matchId)
        } else {
          setShowAlert(false)
          setMatchId(null)
        }
      } else {
        setShowAlert(true)
        setMatchId(detail.matchId)
      }
    };

    window.addEventListener('push-nt-1001', handleNt1001);

    return () => window.removeEventListener('push-nt-1001', handleNt1001);
  }, [location.pathname, history]);

  useEffect(() => {

    let hideTimeout = null as any;

    if (matchId) {
      hideTimeout = setTimeout(() => {
        setShowAlert(false)
        setMatchId(null)
      }, 20000)
    }

    return () => clearTimeout(hideTimeout)
  }, [matchId])

  if (!showAlert) {
    return null;
  }

  return (
    <div
      className="redevelope-alert"
      onClick={() => {
        history.push('/detail/' + matchId)
      }}
    >
      <img src={redImg} alt="redImg"/>
    </div>
  );
}

export default observer(RedEnvelopeAlert);