import { makeStyles } from '@material-ui/core/styles'

import CommissionImage from './commission.png'
import CustomizeImage from './customize.png'
import MedalImage from './medal.png'
import MessageImage from './message.png'
import PostedImage from './posted.png'
import RecordsImage from './records.png'
import WalletImage from './wallet.png'
import ShopImage from './shop.png'
import VerifyImage from './verify.png'
import AmountRecordsImage from './amount-records.png'
import AddressImage from './address.png'

const useStyles = makeStyles(
  {
    root: {
      width: 25,
      height: 25,
      verticalAlign: 'middle'
    },
  },
  { name: 'IconProfiles' }
)

const mapping = {
  commission: CommissionImage,
  customize: CustomizeImage,
  medal: MedalImage,
  message: MessageImage,
  posted: PostedImage,
  records: RecordsImage,
  wallet: WalletImage,
  shop: ShopImage,
  verify: VerifyImage,
  amountrecords: AmountRecordsImage,
  address: AddressImage
}

export default function IconProfiles ({ type }) {
  return (
    <img
      className={useStyles().root}
      src={mapping[type]}
    />
  )
}
