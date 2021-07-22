import { useState } from 'react'
import { useSnackbar } from 'notistack'

import { version } from '../../utils/env-utils'

export default function Version () {
  const [times, setTimes] = useState(0)
  const { enqueueSnackbar } = useSnackbar()

  return <button onClick={()=>{
    console.log('times:', times)
    if (times >= 5) {
      enqueueSnackbar(`current version is: ${version()}`)
      setTimes(0)
      return
    }
    setTimes(times + 1 )
  }}>click 5 times to show version</button>
}
