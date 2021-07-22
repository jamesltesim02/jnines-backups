import React from 'react'
import { inject, observer } from 'mobx-react'
import { useLocation } from 'react-router'

import SingleBet from './single-bet'
import MultiBet from './multi-bet'

import ResultDialog from './result-dialog'

const Cart = ({
  store: {
    match: { cart }
  }
}) => {
  const location = useLocation()

  React.useEffect(
    () => {
      const state = new URLSearchParams(location.search).get('state')
      cart.setModel(state === '99' ? 1 : 0)
    },
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
        : (<MultiBet />)
      }
      <ResultDialog />
    </>
  )
}

export default inject('store')(
  observer(Cart)
)
