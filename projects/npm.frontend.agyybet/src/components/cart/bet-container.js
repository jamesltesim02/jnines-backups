import React from 'react'
import { observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import toSignin from '../../utils/to-signin'

import { withApi } from '../../api'

const OptionContainer = ({
  option,
  market: {
    options,
    ...market
  },
  match: {
    markets,
    ...match
  },
  store: {
    cart,
    member,
    toast
  },
  api: { quote },
  children
}) => {
  const intl = useIntl()
  const [quoting, setQuoting] = React.useState(false)
  const checked = cart.options.findIndex(({ optionId }) => optionId === option.optionId) > -1

  return (
    <>
    {children && children({
      checked,
      quoting,
      async onToggle () {
        // 如果当前状态为不可投,则不做任何操作
        if (option.status !== 1) {
          return
        }
        // 如果串关模式中, 该选项的可串关数为0,则不作任何操作
        if (
          cart.model === 1
          &&
          market.combo < 2
        ) {
          return
        }

        if (!checked) {
          if (cart.model === 1) {
            cart.add(
              {
                ...option,
                combCount: market.combo
              },
              market,
              match
            )
            return
          }
          if (!member.isLoged) {
            toast.warning(
              intl.formatMessage({ id: 'message.needLogin' })
            )
            // TODO 转到登录
            setTimeout(toSignin, 300)
            return
          }
          try {
            setQuoting(true)

            const result = await quote.doQuote([{ optionId: option.optionId }])
            const quotedOption = result[0]
            
            // TODO 判断是否可投
            // TODO 点水结果更新到 store的current对应比赛中
            cart.add(
              {
                ...option,
                ...quotedOption
              },
              market,
              match
            ) 
          } catch (e) {
            console.log(e)
            // toast.error(
            //   e.msg
            //   ||
            //   intl.formatMessage({ id: 'carts.quoteError' })
            // )
          } finally {
            setQuoting(false)
          }
        } else {
          cart.delete(option.optionId)
        }
      }
    })}
    </>
  )
}

export default withApi('quote')(
  observer(OptionContainer)
)
