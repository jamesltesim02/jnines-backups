import React from 'react'
import Noneicon from '@/components/common/icons/Noneicon'

import './EmptyItem.css'

const EmptyItem = ({
  children
}) => (
  <div className="nb-bet-empty">
    <div className="nb-bet-empty-icon">
      <Noneicon />
      <div>{children}</div>
    </div>
  </div>
)

export default EmptyItem
