import createAxios from './index'
import devConfig from '../config/config.dev'

const axios = createAxios()

export const betReport = (params) => {
  return axios.get(
    'betReport/query',
    {
      params: {
        ...params
      }
    }
  )
}

export const betChart = (params) => {
  return axios.get(
    'chart/betChartQuery',
    {
      params
    }
  )
}
export const userChart = (params) => {
  return axios.get(
    'chart/userChartQuery',
    {
      params
    }
  )
}