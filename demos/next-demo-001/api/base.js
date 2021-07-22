import { Component } from 'react'
import Axios , { CancelTokenSource, CancelToken } from 'axios'

import { isServer } from '../utils/env-utils'
import { initializeStore } from '../stores'

import OpsConfig from '../configs/config.ops'
import devConfig from '../configs/config.dev'

class BaseApi{
  axios = null
  store = null
  constructor (config) {
    this.axios = Axios.create(config)
    this.init()
  }

  init () {
    this.axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'
    this.axios.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    )
    this.axios.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  setStore (store) {
    this.store = store
  }

  handleRequest (conf) {
    conf.headers['Accept-Language'] = this.store.app.locale
    conf.headers.Authorization = 'aa123123'
    return conf
  }

  handleRequestError (err) {
    console.log('handle request error')
    return Promise.reject(err)
  }

  handleResponse ({data}) {
    console.log('handle response')
    return data
  }

  handleResponseError (err) {
    if (!err.response) {
      this.store.toast.error('未知网络错误')
      return Promise.reject(err)
    }

    const {
      status,
      data
    } = err.response

    if (devConfig.businessCodes.includes(status)) {
      this.store.toast.optionsToast(
        `common.apicode.${status}`,
        {
          variant: 'error',
          intl: true
        }
      )
    } else {
      this.store.toast.error(data)
      this.log({ content: JSON.stringify(err) })
    }

    return Promise.reject(err)
  }

  log (content) {
    this.post('/logs', content, { baseURL: OpsConfig.API_URL })
  }

  render () {
    return null
  }
}

['get', 'post', 'put', 'delete'].forEach(method => {
  BaseApi.prototype[method] = function (...args) {
    console.log(`will request method ${method} ${JSON.stringify(args)}`)
    return this.axios[method](...args)
  }
})

const useApi = (SubComponent, api) => {
  const createApiProps = (store) => {
    const apiProps = {}

    if (!store) {
      return apiProps
    }

    const entries = Object.entries(api)
    if (entries && entries.length) {
      entries.forEach(([k, v]) => {
        apiProps[k] = new v()
        apiProps[k].setStore(store)
      })
    }

    return apiProps
  }

  class ApiWrappedComponent extends Component {
    static async getInitialProps (ctx) {
      let pageProps = {}

      const store = initializeStore(isServer())
      const apiProps = createApiProps(store)

      if(SubComponent.getInitialProps) {
        pageProps = await SubComponent.getInitialProps({
          ...ctx,
          ...apiProps,
        })
      }

      return {
        ...pageProps,
      }
    }
    render () {
      const store = initializeStore(isServer())
      const apiProps = createApiProps(store)
      
      return (
        <SubComponent
          {...this.props}
          {...apiProps}
        />
      )
    }
  }

  return ApiWrappedComponent
}

const withBaseApi = (SubComponent) => useApi(SubComponent, { api: BaseApi })

export {
  BaseApi,
  withBaseApi
}

export default useApi
