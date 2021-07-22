import React, { useEffect, useState } from 'react';

import { SearchOutlined } from "@ant-design/icons";
import codelist, { commonList } from "./Codelist";
import mergeClass from "../../../utils/mergeClass";

function CountryCode (
  {
    onSelected,
    initialCode = "+86",
    className
  }: {
    onSelected: Function
    initialCode?: string
    className?: string
  }
) {
  const [searchText, setSearchText] = useState('')
  const [searchList, setSearchList] = useState<any[]>([])
  const [code, setCode] = useState(initialCode);
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const initial = [] as any;


  const selfClick = (ev: any) => {
    console.log(ev)
    const selfClick = ev.path.find((el: any) => el.className?.includes('country-code'))
    if (!selfClick) {
      setShowCodeDrawer(false)
    }
  }

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
        return (item.name_en + item.name_ch + item.num).replace(" ", "").includes(searchText)
      }
    ))
  }, [searchText])

  useEffect(() => {
    onSelected(code)
  }, [code])

  useEffect(() => {
    if (!showCodeDrawer) {
      return;
    }
    window.addEventListener("click", selfClick)
    return () => {
      window.removeEventListener("click", selfClick)
    }
  }, [showCodeDrawer])

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
    <div className={
      mergeClass({
        "country-code": true,
        [String(className)]: Boolean(className)
      })
    }>
      <span
        className="code"
        onClick={() => setShowCodeDrawer(true)}
      >
        {code}
      </span>
      <div className={
        mergeClass({
          "country-code-container": true,
          "hide": !showCodeDrawer
        })
      }>
        <div className="country-code-search">
          <div>
            <SearchOutlined/>
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
      </div>
    </div>
  );
}

export default CountryCode;