import Icon from './icon'

import WonImage from './images/won.png'
import LoseImage from './images/lose.png'

export default function IconFollowState ({
  width = 37,
  height = 32,
  style = {},
  won = false
}) {
  return (
    <Icon
      width={width}
      height={height}
      style={{
        verticalAlign: 'sub',
        backgroundImage: `url(${won ? WonImage : LoseImage})`,
        ...style
      }}
    />
  )
}
