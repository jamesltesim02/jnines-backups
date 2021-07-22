import MedalList from './medal-list'

import { values } from '../../components/icons/icon-medal/icon-certificated'

export default function CertifyMedal ({ info: { medal = {} } }) {
  return (
    <MedalList
      type="certificated"
      medals={values}
      size={80}
      isAvailable={value => {
        return (
          value[0] < medal.winAmount || 0
          &&
          value[1] < medal.totalRed || 0
        )
      }}
    />
  )
}
