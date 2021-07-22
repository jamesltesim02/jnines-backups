import React from 'react'
import { inject, observer } from 'mobx-react'

const Error500 = () => {
  return (
    <>
      500
    </>
  )
}

export default inject('store')(
  observer(Error500)
)
