import React from 'react'
import toOptionName from '../../utils/to-option-name'
import M from './m'

export default function OptionName({
  gameType, 
  betBar, 
  betOption
}) {
  const {
    prefix,
    key,
    value,
    suffix,
    params
  } = toOptionName(gameType, betBar, betOption)
  return (
    <>
      {prefix || ''}
      {
        key && (
          <M
            id={`common.option.${String(key).trim()}`}
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
