import React, { useState } from 'react'
import Layout from '../components/common/layout'

export default () => {
  const [
    state,
    setState
  ] = useState({
    count: 5,
    name: 'zhangsan',
    editing: false
  })
  const { count, name, editing } = state
  const updateState = (newState) => setState({ ...state, ...newState })

  const [age, setAge] = useState(18)

  let tempName = ''

  return (
    <Layout title="Hooks demo">
      <h3>hooks: useState</h3>
      <div>
        <label>count:</label>
        {count}
        &nbsp;&nbsp;&nbsp;
        <button onClick={() => updateState({ count: count + 1 })}>+</button>
        &nbsp;
        <button onClick={() => updateState({ count: Math.max(0, count - 1) })}>-</button>
      </div>
      {
        editing
        ? (
          <div>
            name:
            <input
              type="text"
              defaultValue={name}
              onChange={({ target: { value } }) => tempName = value}
            />
            <button
              onClick={() => updateState({
                name: tempName,
                editing: false
              })}
            >ok</button>
          </div>
        )
        : (
          <div>
            <label>name:</label>
            <span style={{
              display: 'inline-block',
              minWidth: '100px'
            }}>{name}</span>
            <button onClick={() => updateState({ editing: true })}>edit</button>
          </div>
        )
      }
      <div>
        <label>age:</label>
        <span style={{
          fontSize: '20px',
          fontWeight: 'bolder',
          color: age < 18 ? '#ff5353' : '#99ee99'
        }}>{age}</span>
        &nbsp;&nbsp;&nbsp;
        <button onClick={() => setAge(age + 1)}>+</button>
        &nbsp;
        <button onClick={() => setAge(Math.max(0, age - 1))}>-</button>
      </div>
      <style jsx>{`
        label {
          margin-right: 5px;
        }
      `}</style>
    </Layout>
  )
}
