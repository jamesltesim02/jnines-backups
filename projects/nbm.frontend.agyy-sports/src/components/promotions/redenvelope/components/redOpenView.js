import React from 'react';
import {makeStyles} from "@material-ui/styles";

import openViewImg from '../img/open-view.png'
import openViewCloseImg from '../img/open-view-close.png'

const useStyle = makeStyles({
  root: {
    position: "absolute",
    width: "60%",
    left: "50%",
    top: "30%",
    transform: "translateX(-50%)",
    animation: '$open-show .5s linear',
    '& > .content': {
      position: "relative",
      width: "100%",
      fontSize: 14,
      '& > img': {
        width: "100%",
      },
      '& > p,.amount,.btn,.nomore': {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
      },
      '& > .title': {
        color: "#ffffff",
        top: "6%",
      },
      '& > .cash': {
        top: "22%",
      },
      '& > .soon': {
        fontSize: 12,
        top: "50%"
      },
      '& > .btn': {
        bottom: '18%',
        width: "80%",
        height: "9vw",
        lineHeight: "9vw",
        textAlign: "center",
        borderRadius: 50,
        background: "linear-gradient(#f0f38c,#ffb819)",
        '&:active': {
          background: "linear-gradient(#ffb819,#f0f38c)"
        }
      },
      '& > .amount': {
        color: '#f40c06',
        top: "32%",
        fontSize: "5vw",
        fontWeight: 500,
        letterSpacing: 1.5,
        '& span': {
          fontSize: "8vw"
        }
      },
      '& > .nomore': {
        color: '#f40c06',
        fontSize: '4vw',
        top: "28%",
        textAlign: "center",
      }
    }
  },
  "@keyframes open-show": {
    "0%": {
      transform: "translateX(-50%) scale(0)"
    },
    "100%": {
      transform: "translateX(-50%) scale(1)"
    }
  },
})

function RedOpenView(
  {
    closeAct,
    redAmount,
    showOpenView = false,
    setShowOpenView,
    loading
  }
) {

  const classes = useStyle()

  if (!showOpenView) {
    return null;
  }

  const RedAgain = () => (
    <>
      <p className="title">恭喜获得</p>
      <p className="cash">现金红包</p>
      <p className="soon">红包将会尽快派发</p>
      <div
        className="btn"
        onClick={()=> setShowOpenView(false)}
      >继续抢红包</div>
    </>
  )

  const NoMore = () => (
    <>
      <p className="title">再接再厉</p>
      <div
        className="btn"
        onClick={()=>closeAct()}
      >退出活动</div>
    </>
  )

  return (
    <div className={classes.root}>
      <div className="content">
        {
          loading ?
            <>
              <p className="title">正在打开红包</p>
              <img src={openViewCloseImg} alt="openview"/>
            </>
            :
            <>
            {
              redAmount ?
                <RedAgain/> :
                <NoMore/>
            }
            {
              redAmount ?
                <div className="amount">
                  <p>
                    $
                    <span>{redAmount.toFixed(2)}</span>
                  </p>
                </div>:
                <div className="nomore">
                  红包已抢完
                  <br/>
                  请期待下次进球
                </div>
            }
            <img src={openViewImg} alt="openview"/>
          </>
        }
      </div>
    </div>
  );
}

export default RedOpenView;