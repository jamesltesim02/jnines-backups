import React from 'react'
import {observer} from 'mobx-react'
import app from "../../stores/app";

import RulesLocale from '../../assets/locales/rules'
import Navs from "../../components/common/Navs";

const navs = [
  {
    textKey: 'pages.rules',
    path: '/rules'
  }
]

const Child = (
  {
    item,
    level
  }
) => {
  if (typeof item === 'string') {
    return item
  }

  if (Array.isArray(item)) {
    return (
      <table>
        <tbody>
        {item.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
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
  }
) => {

  if (!children || !children.length) {
    return null
  }

  return (
    <ol className={`ol${level}`}>
      {
        children.map((child, i) => (
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
      <Navs list={navs} />
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
