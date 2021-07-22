import React from 'react'
import toOptionName from './to-option-name'
import M from '../common/m'

export default function OptionName({
  marketType, 
  marketGroup,
  betBar, 
  betOption
}) {
  const {
    prefix,
    key,
    value,
    suffix,
    params
  } = toOptionName(
    marketType,
    marketGroup,
    betBar,
    betOption
  )

  return (
    <>
      {prefix || ''}
      {
        key && (
          <M
            id={`option.${key}`}
            values={{
              ...params,
              betOption,
              betBar
            }}
          />
        )
      }
      {value || ''}
      {suffix || ''}
    </>
  )
}
