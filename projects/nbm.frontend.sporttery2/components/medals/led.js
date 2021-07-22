import MedalList from './medal-list'

import { values } from '../../components/icons/icon-medal/icon-led'

/** 带红人数 */
export default function LedMedal ({ info: { medal = {} } }) {
  return (
    <MedalList
      type="led"
      medals={values}
      size={80}
      isAvailable={value => value < medal.totalRed || 0}
    />
  )
}
