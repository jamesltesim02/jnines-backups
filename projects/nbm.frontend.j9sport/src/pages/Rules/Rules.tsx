import React from 'react'
import {observer} from 'mobx-react'

import M from '../../components/common/m';
import app from "../../stores/app";

import RulesLocale from '../../assets/locales/rules'
import Back from "../Member/Settings/Back";

const Child = (
  {
    item,
    level
  }: any
) : any => {
  if (typeof item === 'string') {
    return item
  }

  if (Array.isArray(item)) {
    return (
      <table>
        <tbody>
        {item.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell: any, ci: number) => (
              <td key={ci}>{cell}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      {item.content}
      <Children
        children={item.children}
        level={level + 1}
      />
    </>
  )
}

const Children = (
  {
    children = [],
    level = 1
  }: {
    children: any,
    level: number
  }
) => {

  if (!children || !children.length) {
    return null
  }

  return (
    <ol className={`ol${level}`}>
      {
        children.map((child: any, i: number) => (
          <li key={i}>
            <Child
              item={child}
              level={level}
            />
          </li>
        ))
      }
    </ol>
  )
}

const RuleContent = () => {

  const rules = RulesLocale[app.locale]

  return (
    <div className="rules-content">
      <Back title={<M id="pages.rules" />} />
      <section>
        <p>{rules.content}</p>
        <Children
          children={rules.children}
          level={1}
        />
      </section>
    </div>
  )
}

export default observer(RuleContent)
