import MedalList from './medal-list'

import { values } from '../../components/icons/icon-medal/icon-consecutive'

/** 最高连红 */
export default function ConsecutiveMedal ({ info: { medal = {} } }) {
  return (
    <MedalList
      type="consecutive"
      medals={values}
      size={80}
      isAvailable={value => value < medal.historyHit || 0}
    />
  )
}
