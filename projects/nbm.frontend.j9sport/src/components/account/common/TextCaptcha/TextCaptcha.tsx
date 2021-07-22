import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined } from "@ant-design/icons";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import M from '../../../common/m';

import clickImg from "./img/click-f.png";
import p1 from "./img/p-1.svg";
import p2 from "./img/p-2.svg";
import p3 from "./img/p-3.svg";
import p4 from "./img/p-4.svg";
import refreshImg from "./img/refresh.svg";
import successImg from "./img/success.svg";
import LoadingBar from "../../../common/LoadingBar";
import mergeClass from "../../../../utils/mergeClass";

const pointImg = [p1, p2, p3, p4]

function TextCaptcha(
  {
    onSuccess = (code: string) => {
    },
    onFailed = () => {
    },
    type,
    refreshVer,
  }: {
    onSuccess?: Function
    onFailed?: Function
    type: "REGISTER" | "LOGIN"
    refreshVer: number
  }
) {
  const [user] = useApi([User])
  const [bgImage, setBgImage] = useState('')
  const [naturalSize, setNaturalSize] = useState({width: 0, height: 0})
  const [size, setSize] = useState({width: 0, height: 0})
  const [words, setWords] = useState<string[]>([])
  const [points, setPoints] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(false)

  // 获取图片验证码
  const getCaptchaImg = () => {
    if (loading) {
      return;
    }
    setLoading(true)
    user.captchaClick(type).then(({bgImage, words}: any) => {
      setBgImage(bgImage);
      setWords(words);
    }).finally(() => {
      setLoading(false)
    })
  }
  // 添加小点
  const addPoint = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // 小点真实位置
    const {offsetY, offsetX} = event.nativeEvent
    if (points.length === words.length) {
      return;
    }
    // 小点在原始图片相对位置
    const [x, y] = [
      offsetX / size.width * naturalSize.width + (naturalSize.width * 0.01) / 2,
      parseInt(String(offsetY / size.height * naturalSize.height + (naturalSize.height * 0.01) / 2)),
    ];
    setPoints(
      [...points,
        {
          ry: offsetY,
          rx: offsetX,
          x,
          y
        }
      ]
    )
  }

  // 刷新图片验证码
  const refresh = () => {
    setPoints([])
    setStatus(false)
    getCaptchaImg()
  }

  // 发送检查请求
  const submit = () => {
    const code = btoa(JSON.stringify(points.map(({x, y}: any) => ({x, y}))));
    if (loading) {
      return;
    }
    user.captchaClickCheck(type, code).then((res: any) => {
      if (res) {
        onSuccess(code)
        setVisible(false)
        setStatus(true)
        setTimeout(() => {
        }, 200)
      }
    }).catch((err: any) => {
      if (err) {
        refresh()
      }
    })
  }

  useEffect(() => {
    refresh()
  }, [refreshVer])

  // 选中的小点数量达到发送检查请求
  useEffect(() => {
    if (
      bgImage
      && visible
      && points.length === words.length
    ) {
      submit();
    }
  }, [points])

  // 初始化图片位置参数
  useEffect(() => {
    if (!bgImage) {
      return;
    }
    const imgEl = document.getElementById('bgImage') as HTMLImageElement
    if (imgEl) {
      imgEl.onload = () => {
        setNaturalSize(
          {
            width: imgEl.naturalWidth,
            height: imgEl.naturalHeight
          }
        )
        setSize(
          {
            width: imgEl.offsetWidth,
            height: imgEl.offsetHeight
          }
        )
      }
    }
  }, [bgImage])

  return (
    <div className="text-captcha">
      <div
        className={
          mergeClass({
            "text-captcha-click": true,
            "text-captcha-click-success": status
          })
        }
        onClick={() => setVisible(true)}
      >
        <img src={status ? successImg : clickImg} alt=""/>
        {status ? "验证成功" : "点此进行验证"}
      </div>
      {
        visible
        &&
        <div className="text-captcha-textarea">
          <div>
            {/* 验证码图片*/}
            <img
              id="bgImage"
              src={bgImage}
              onClick={addPoint}
            />
            {/*刷新按钮*/}
            <img
              className="refresh"
              src={refreshImg}
              onClick={refresh}
            />
            <CloseCircleOutlined
              onClick={() => setVisible(false)}
            />
            {
              points.map(({rx, ry}: any, indexX: number) => (
                <img
                  className="textarea-point"
                  key={indexX}
                  src={pointImg[indexX]}
                  style={
                    {
                      top: ry,
                      left: rx
                    }
                  }
                  onClick={() => {
                    if (indexX === points.length - 1) {
                      setPoints(points.filter((item: any, indexY: number) => (indexY !== indexX)))
                    }
                  }}
                />
              ))
            }
          </div>
          {/*请依次点击*/}
          <div className="textarea-footer">
            {
              !loading ?
                <>
                  请依次点击
                  <M id="member.form.textCaptchaTip" />
                  <span>
                {
                  words.map((word: any) => {
                    return `"${word}" `
                  })
                }
               </span>
                </>
                : <LoadingBar/>
            }
          </div>
        </div>
      }
    </div>
  );
}

export default TextCaptcha;