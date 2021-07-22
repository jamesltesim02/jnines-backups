
/**
 * 当前是否为服务器端环境
 */
export const isServer = () => typeof window === 'undefined'

/**
 * 是否为生产环境
 */
export const isProd = () => process.env.NODE_ENV === 'production'

/**
 * 当前环境版本
 */
export const version = () => process.env.VERSION || 'testing'
