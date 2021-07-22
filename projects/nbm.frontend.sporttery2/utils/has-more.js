import devConfig from '../config/config.dev'

export default (
  {
    currentCount,
    currentPage
  }
  ,
  pageSize = devConfig.pageParams.pageSize
) => {
  return currentCount > currentPage * pageSize
}
