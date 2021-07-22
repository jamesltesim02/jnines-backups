import React from 'react'
import { inject, observer } from 'mobx-react'
import { useLocation } from 'react-router'

import SingleBet from './single-bet'
import MultiBet from './multi-bet'
import ResultDialog from './result-dialog'

const MULTI_PATTERN = new RegExp(
  [
    '(^\\/tab\\/home\\/\\d+?\\/99)',
    '(^\\/match\\/99\\/)'
  ].join('|'),
  'i'
)

const Cart = ({
  store: { cart },
  intabs = false
}) => {
  const location = useLocation()

  React.useEffect(
    () => cart.setModel(
      MULTI_PATTERN.test(location.pathname)
      ? 1
      : 0
    ),
    [location]
  )

  if (cart.model === null) {
    return null
  }
  return (
    <>
      {
        cart.model === 0
        ? (<SingleBet />)
        : (<MultiBet intabs={intabs} />)
      }
      <ResultDialog />
    </>
  )
}

export default inject('store')(
  observer(Cart)
)
