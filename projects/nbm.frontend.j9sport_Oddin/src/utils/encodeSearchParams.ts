const encodeSearchParams = (obj: any) => {
  const params = <any>[]

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'undefined') {
      value = ''
    }
    params.push([key, encodeURIComponent(value)].join('='))
  })
  return params.join("&")
}

export default encodeSearchParams;