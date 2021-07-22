import axios from 'axios'

// 查询接口地址
const pullUrl = window.NBServer.p_s1

export const gsinglematch = (mid) => {
  return axios.get(
    'gsinglematch',
    {
      params: {mid},
      baseUrl: pullUrl
    }
  )
}