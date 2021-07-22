import axios from 'axios'

// const pullApi = 'https://nb-nbapi.nb668.cn/web_pull'

const bgroups = async () => {
  let data = await axios.get('/bgroups')
  return data
}

const ghomematch = async (params) => {
  let data = await axios.get('/ghomematch', {
    params
  })

  return data
}

const gmatch = async (params) => {
  let data = await axios.get('/gmatch', {
    params
  })

  return data
}

export default {
  bgroups,
  ghomematch,
  gmatch
}
