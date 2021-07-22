import React  from 'react'
import MasterProgramItem from './master-program-item'
import LineHolder from '../common/line-holder'

export default function MasterPrograms ({ items }) {
  return (
    <>
      <ul>
      {
        items.map(item => (
          <li key={item._id}>
            <MasterProgramItem item={item} />
            <LineHolder />
          </li>
        ))
      }
      </ul>
    </>
  )
}
