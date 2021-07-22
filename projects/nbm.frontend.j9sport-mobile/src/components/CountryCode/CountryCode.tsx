import React, { useEffect, useState } from 'react';

import codelist, { commonList } from "./Codelist";
import Drawer from "../common/Drawer";
import { Icon } from "antd-mobile";
import mergeClass from "../../utils/mergeClass";

function CountryCode(
  {
    onSelected,
    initialCode = "+86",
    className,
    classes
  }: {
    onSelected: Function
    initialCode?: string
    className?: string,
    classes?: {
      root?: string,
      drawer?: string,
    }
  }
) {
  const [searchText, setSearchText] = useState('')
  const [searchList, setSearchList] = useState<any[]>([])
  const [code, setCode] = useState(initialCode);
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const initial = [] as any;

  useEffect(() => {
    codelist.forEach(item => {
      if (!initial.includes(item.name_en.slice(0, 1))) {
        initial.push(item.name_en.slice(0, 1))
      }
    })
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setSearchList([])
      return;
    }
    setSearchList(codelist.filter((item) => {
      return  (item.name_en + item.name_ch + item.num).replace(" ","").includes(searchText)}
    ))
  }, [searchText])

  useEffect(() => {
    onSelected(code)
  },[code])

  const CountryCodeList = ({codelist, title}: any) => {
    return (
      <>
        <dl>
          <dt>{title}</dt>
          {
            codelist.map((item: any) => {
              return (
                <dd
                  key={item.name_en}
                  onClick={() => {
                    setCode(item.num)
                    setShowCodeDrawer(false)
                  }}
                >
                  {item.name_ch}
                  <span>
                    {item.num}
                  </span>
                </dd>
              )
            })
          }
        </dl>
      </>
    )
  }

  return (
    <div
      className={mergeClass(
        'country-code',
        className,
        classes?.root
      )}
    >
      <span
        className="code"
        onClick={() => setShowCodeDrawer(true)}
      >
        {code}
      </span>
      <Drawer
        unmountOnExit={true}
        open={showCodeDrawer}
        className={mergeClass(
          'drawer-content-fullscreen',
          classes?.drawer
        )}
      >
        <div className="country-code-search">
          <div>
            <Icon type="search"/>
            <input
              value={searchText}
              type="text"
              placeholder="输入国家名称或区号查询"
              onChange={(event => setSearchText(event.target.value))}
            />
          </div>
          <span
            onClick={() => {
              setShowCodeDrawer(false);
            }}
          >
            取消
          </span>
        </div>
        <section className="country-code-list">
          {
            searchList.length === 0
            &&
          <>
            <CountryCodeList title="常用国家/地区" codelist={commonList}/>
            <CountryCodeList title="全部国家/地区" codelist={codelist}/>
          </>
          }
          {
            searchList.length > 0
            &&
            <CountryCodeList codelist={searchList}/>
          }
        </section>
      </Drawer>
    </div>
  );
}

export default CountryCode;