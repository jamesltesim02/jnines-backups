import { inject, observer } from 'mobx-react'
import ButtonArea from '../../common/button-area'

const OptionsOther = ({
  store: { matchs },
  market,
  match,
  className
}) => {

  return (
    <ButtonArea
      className={className}
      onClick={
        () => matchs.setChoosing({
          matchId: match.matchId,
          marketType: market.marketType
        })
    }
    >请选择投注内容</ButtonArea>
  )
}

export default inject('store')(
  observer(OptionsOther)
)
