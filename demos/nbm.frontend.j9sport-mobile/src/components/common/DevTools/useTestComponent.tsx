import React from 'react';

function useTestComponent () {
  const [count, setCount] = React.useState(0);

  React.useEffect(
    () => {
      console.log('effect in test-----------', count);
    },
    [count]
  );

  console.log('use test compoent.');

  const Comp = (
    <div>
      <button
        onClick={() => setCount(count - 1)}
        style={{
          padding: 5,
          border: '1px solid #ccc',
        }}
      >-</button>
      &nbsp;&nbsp;
      {count}
      &nbsp;&nbsp;
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: 5,
          border: '1px solid #ccc',
        }}
      >+</button>
    </div>
  );

  return {
    Comp,
    count,
    methods: {
      setCount
    },
  };
}

export default useTestComponent;
