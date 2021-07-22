import React from 'react';
import { observer } from 'mobx-react';
import app from "../../stores/app";

import RulesLocale from '../../assets/locales/rules';
import BackButton from "../../components/common/BackButton";
import M from '../../components/common/m'

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
            {row.map((cell: any, ci: any) => (
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
      <div className="header dark">
        <BackButton/>
        <M id="pages.rules" />
      </div>
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
