import React, { useEffect, useState } from 'react';
import mergeClass from "../../../utils/mergeClass";

function Countdown(
  {
    count,
    className,
    onCountdown = () => {}
  }: {
    count: number
    className?: string
    onCountdown?: Function
  }
) {
  const [_count, setCount] = useState(count)

  useEffect(() => {
    if (_count < 0) {
      return ;
    }
    if (_count > 0) {
      setTimeout(() => {
        setCount(_count - 1)
      },1000)
    }else {
      onCountdown()
    }
  },[_count])

  useEffect(() => {
    if (count > 0) {
      setCount(count)
    }
  },[count])
  return (
    <span className={mergeClass({
      [String(className)]: Boolean(className)
    })}
    >
      {_count}
    </span>
  );
}

export default Countdown;