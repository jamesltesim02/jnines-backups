import MedalList from './medal-list'

import { values } from '../../components/icons/icon-medal/icon-profit'

/** 累计中奖 */
export default function ProfitMedal ({ info: { medal = {} } }) {
  return (
    <MedalList
      type="profit"
      medals={values}
      size={80}
      isAvailable={value => value < medal.winAmount || 0}
    />
  )
}
