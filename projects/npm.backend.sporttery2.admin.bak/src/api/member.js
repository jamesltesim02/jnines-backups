import opsConfig from '@/config/ops-config'

import createAxios from './index'

const axios = createAxios({
  baseURL: opsConfig.MEMBER_API_URL
})

// axios.ssss