import React from 'react';
import { DownOutlined } from '@ant-design/icons';

import mergeClass from '../../../../utils/mergeClass';

import M from '../../../common/m';

type Item = {
  value: any,
  text?: string,
  textKey?: string,
  count?: number
};

const LINE_HEIGHT = 24;

function FilterItem (
  {
    label,
    labelKey,
    className,
    checked = [],
    items = [],
    emptyAllItem = false,
    multiple = false,
    onChange = () => {}
  }: {
    label?: string,
    labelKey?: string,
    className?: string,
    checked: Array<any>,
    items: Array<Item>,
    emptyAllItem?: boolean,
    multiple?: boolean,
    onChange?: (checked: Array<any>) => void,
  }
) {
  const itemsRef = React.useRef(null);
  const [collapse, setCollapse] = React.useState(false);
  const [multing, setMulting] = React.useState(false);
  const [fullHeight, setFullHeight] = React.useState<number>(0);
  const [tempChecked, setTempChecked] = React.useState(checked);

  const handleClick = (value: any) => {
    if (
      checked.includes(value)
      &&
      !multiple
    ) {
      return
    }
    if (multing) {
      if (value === 'all') {
        setTempChecked([]);
        return;
      }
      const index = tempChecked.indexOf(value);
      if (index > -1) {
        tempChecked.splice(index, 1);
        setTempChecked([...tempChecked]);
      } else {
        setTempChecked([...tempChecked, value]);
      }
      return;
    }
    if (value === 'all') {
      onChange([]);
    } else {
      onChange([value]);
    }
    setCollapse(false);
  };

  const handleMultiToggle = () => {
    setTempChecked(checked);
    if (multing) {
      setMulting(false);
    } else {
      setMulting(true);
      setCollapse(true);
    }
  };

  const handleSubmit = () => {
    onChange(tempChecked);
    setMulting(false);
    setCollapse(false);
  };

  const handleCancel = () => {
    setTempChecked(checked);
    setMulting(false);
    setCollapse(false);
  };

  React.useEffect(
    () => {
      setTempChecked(checked);
    },
    [checked]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useLayoutEffect(
    () => {
      const items: any = itemsRef.current;
      if (!items) {
        return;
      }
      setFullHeight(items.clientHeight);
    }
  );

  React.useEffect(
    () => {
      window.addEventListener('resize', () => {
        const items: any = itemsRef.current;
        if (!items) {
          return;
        }
        setFullHeight(items.clientHeight);
      });
    },
    []
  );

  return (
    <section
      className={
        mergeClass(
          'filter-item',
          collapse ? 'collapsed' : null,
          multing ? 'multing' : null,
          className
        )
      }
    >
      <i
        className="cover"
        onClick={handleCancel}
      />
      <div>
        <label>
          {
            labelKey ? (
              <M id={labelKey} />
            ) : label
          }:
        </label>
        <section
          className="container"
          style={{ height: collapse ? fullHeight : LINE_HEIGHT }}
        >
          <div ref={itemsRef}>
            <div className="items">
            {
              emptyAllItem ? (
                <button
                  key="all"
                  className={
                    (
                      !tempChecked.length
                      ||
                      (
                        tempChecked.length === 1
                        &&
                        tempChecked[0] === undefined
                      )
                    )
                    ? 'active'
                    : undefined
                  }
                  onClick={() => handleClick('all')}
                >
                  <M id="common.all" />
                </button>
              ) : null
            }
            {
              items.map(
                item => (
                  <button
                    key={item.value}
                    className={
                      tempChecked.includes(item.value)
                      ? 'active'
                      : undefined
                    }
                    onClick={() => handleClick(item.value)}
                  >
                    {
                      item.textKey
                      ? <M id={item.textKey} />
                      : item.text
                    }
                    {
                      typeof item.count !== 'undefined'
                      ? ` (${item.count})`
                      : null
                    }
                  </button>
                )
              )
            }
            </div>
            {
              multing ? (
                <div className="submit-bar">
                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                  >
                    <M id="filter.ok" />
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={handleCancel}
                  >
                    <M id="filter.cancel" />
                  </button>
                </div>
              ) : null
            }
          </div>
        </section>
        <div className="oprs">
          {
            (
              multiple
              &&
              items.length
            ) ? (
              <button
                className="btn-multiple"
                onClick={handleMultiToggle}
              >
                <M id="filter.multiple" />
                {
                  tempChecked.length > 0
                  ? (<i>{tempChecked.length}</i>)
                  : null
                }
                
              </button>
            ) : null
          }
          {
            fullHeight > LINE_HEIGHT + 5 ? (
              <button
                className="collapse-button"
                onClick={() => {
                  setMulting(false);
                  setCollapse(!collapse);
                }}
              >
                <M id={`filter.collapse_${collapse}`} />
                <DownOutlined />
              </button>
            ) : null
          }
        </div>
      </div>
    </section>
  );
}

export default FilterItem;
