import React from 'react'
import MyOrderItem from './MyOrderItem'

import './MyOrderList.css'

const MyOrderList = ({items}) => (
  <div>
    {
      items.map(({bamt, bcnt, btm, bets}, i) => (
        bets.map((bet,i) => (
          <MyOrderItem
            key={i}
            item={{
              bamt,
              bcnt,
              btm,
              ...bet
            }}
          />
        ))
      ))
    }
  </div>
)
export default MyOrderList