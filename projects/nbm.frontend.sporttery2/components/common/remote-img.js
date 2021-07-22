import { RESOURCE_URL } from '../../config/config.ops'

const RemoteImg = ({
  src,
  lazy = false,
  style = {},
  className,
  ...props
}) => {
  const url = /^https?:\/\/.+/gi.test(src) ? src : (RESOURCE_URL + src)

  return (
    <img
      alt=""
      src={lazy ? null : url}
      data-src={lazy ? url : null}
      style={style}
      className={className}
      {...props}
    />
  )
}

export default RemoteImg
