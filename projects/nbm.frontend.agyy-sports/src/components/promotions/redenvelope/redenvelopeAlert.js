import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {inject,observer} from "mobx-react";

import { makeStyles } from "@material-ui/styles";
import withApi from "../../../api";
import redImg from "./img/red-alert.png"

const useStyle = makeStyles({
  root: {
    zIndex: 1200,
    position: "fixed",
    top: "50%",
    right: 10,
    width: '80px',
    height: '80px',
    "& > img": {
      width: "100%",
    }
  }
})

function RedEnvelopeAlert(
  {
    store: {matchs,member}
  }
) {

  const classes = useStyle()
  const location = useLocation()
  const history = useHistory()

  const [showAlert, setShowAlert] = useState(false)

  const [matchId, setMatchId] = useState(null)

  useEffect(() => {
    if (matchs.detail) {
      if (matchs.detail.activityInfo){
        setShowAlert(false)
      }
    }

    if (!member.isLoged) {
      return ;
    }

    // 红包活动开启推送
    const handleNt1001 = ({detail}) => {
      if (location.pathname.includes('/match')) {
        const pathname = location.pathname.split('/')
        if (pathname[pathname.length - 1] !== detail.matchId) {
          setShowAlert(true)
          setMatchId(detail.matchId)
        }else {
          setShowAlert(false)
          setMatchId(null)
        }
      }else {
        setShowAlert(true)
        setMatchId(detail.matchId)
      }
    };

    window.addEventListener('push-nt-1001', handleNt1001);

    return () => window.removeEventListener('push-nt-1001', handleNt1001);
  }, [location.pathname, history]);

  useEffect(() => {

    let hideTimeout ;

    if (matchId) {
      hideTimeout = setTimeout(() => {
        setShowAlert(false)
        setMatchId(null)
      },20000)
    }

    return () => clearTimeout(hideTimeout)
  },[matchId])

  if (!showAlert) {
    return null;
  }

  return (
    <div
      className={classes.root}
      onClick={()=> {
        if (matchId) {
          if (location.pathname.includes('inPlay')){
            history.push('/match/inPlay' + matchId)
          }else  {
            history.push('/match/' + matchId)
          }
        }
      }}
    >
      <img src={redImg} alt="redImg"/>
    </div>
  );
}

export default withApi('pull')(
  inject("store")(
    observer(RedEnvelopeAlert)
  )
);