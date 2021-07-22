import React, { useEffect, useState } from 'react';
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import { LoadingOutlined } from '@ant-design/icons';

function ImageCaptcha(
  {
    type,
    refreshVer
  }: {
    type: 'register' | 'login'
    refreshVer?: number
  }
) {
  const [user] = useApi([User])
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')

  const getCaptcha = () => {
    setLoading(true)
    user.captcha(type).then((res: any) => {
      setUrl(res)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getCaptcha()
  },[])

  useEffect(() => {
    if (refreshVer) {
      getCaptcha()
    }
  },[refreshVer])

  return (
    <div style={{transform:" translateX(10px)",textAlign: "center"}}>
      {
        loading
        ? <div style={{width: 80}}>
            <LoadingOutlined />
          </div>
        : <img
          style={{backgroundColor: "#fff", height: 38, cursor: "pointer"}}
            onClick={getCaptcha}
            src={url}
            alt=""
          />
      }
    </div>
  );
}

export default ImageCaptcha;