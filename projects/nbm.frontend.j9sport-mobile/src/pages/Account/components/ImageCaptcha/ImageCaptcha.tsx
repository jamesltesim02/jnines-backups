import React, { useEffect, useState } from 'react';
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";

import LoadingBar from "../../../../components/common/LoadingBar";

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
    <div>
      {
        loading
        ? <LoadingBar />
        : <img
            onClick={getCaptcha}
            src={url}
            alt=""
          />
      }
    </div>
  );
}

export default ImageCaptcha;