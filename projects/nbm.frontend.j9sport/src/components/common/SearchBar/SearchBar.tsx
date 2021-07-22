import React, { useState } from "react";
import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons'
import QueueAnim from 'rc-queue-anim';
import {withApi} from "../../../apis";
import Pull from "../../../apis/Pull";
import useDebounce from "./useDebounce";

import SearchEmpty from './components/SearchEmpty'
import SearchLoading from "./components/SearchLoading";
import SearchResult from "./components/SearchResult";
import { useIntl } from "react-intl";

function SearchBar(
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {
  const intl = useIntl();

  const [showContent, setShowContent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [matchList, setMatchList] = useState([])
  const [tourList, setTourList] = useState([])

  // 获取焦点打开搜索框
  function onFocus(ev: any) {
    if (ev.target.value !== '') {
      setShowContent(true)
    }
  }

  function onChange(ev: any) {
    setShowContent(ev.target.value !== '')
    setLoading(true)
    setContent(ev.target.value.trim())
    getResult()
  }
  // 获取搜索结果
  const getResult = useDebounce(() => {
    if (content !== '') {
      pull.getMatchTours(content).then(({matchs,tours}) => {
        setMatchList(matchs)
        setTourList(tours)
      }).finally(() => {
        setLoading(false)
      })
    }
  }, 300)

  return (
    <div className="search-bar">
      <span
        className="search-bar-modal"
        style={!showContent ? {display:"none"} : {}}
        onClick={() => {setShowContent(false)}}
      />
      <div className="search-bar-input">
        <Input
          allowClear
          size="large"
          placeholder={
            intl.formatMessage({ id: 'search.placeholder' })
          }
          onFocus={onFocus}
          onChange={onChange}
          suffix={<SearchOutlined />}
        />
      </div>
      <QueueAnim
        animConfig={[
          {opacity: [1, 0], translateY: [0, 50]},
          {opacity: [1, 0], translateY: [0, 50]}
        ]}
      >
        {showContent ? [
          <div className='line' key="ln">
          </div>,
          <div
            className="search-bar-content"
            key="sc"
          >
            {
              loading ?
                <SearchLoading/> :
              (matchList.length + tourList.length) > 0 ?
                <SearchResult
                  matchList={matchList}
                  tourList={tourList}
                  keyword={content}
                />:
                <SearchEmpty/>
            }
          </div>
        ] : null}
      </QueueAnim>
    </div>
  )
}

export default withApi({pull: Pull})(SearchBar);