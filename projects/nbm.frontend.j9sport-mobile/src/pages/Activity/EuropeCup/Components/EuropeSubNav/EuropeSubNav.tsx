import React, { useEffect, useState } from 'react';
import mergeClass from "../../../../../utils/mergeClass";

function EuropeSubNav(
  {
    navs,
    onChange,
    content
  }: {
    navs: Array<string>,
    onChange?: (val: any) => void,
    content?: Array<JSX.Element>
  }
) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    onChange
    &&
    onChange(navs[active])
  }, [active])

  return (
    <div className="europe-sub-nav">
      <header>
        {
          navs.map((item, index: number) => {
            return (
              <div
                key={item}
                className={mergeClass({
                  "active": active === index
                })}
                onClick={() => setActive(index)}
              >
                {item}
              </div>
            )
          })
        }
      </header>
      <section>
        {
          content && content[active]
        }
      </section>
    </div>
  );
}

export default EuropeSubNav;
