import createAxios from './index'

const axios = createAxios()

export const uploadFiles = (params) => {
  return axios.post(
    'file/upload',
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data;charset=UTF-8'
      },
      transformRequest: [
        function (data, headers) {
          return data;
        }
      ]
    }
  )
}
