import React, { ChangeEvent, useEffect, useState } from 'react';
import { CSSTransition } from "react-transition-group";
import { Icon } from "antd-mobile";
import mergeClass from "../../utils/mergeClass";
import { Link, useLocation } from "react-router-dom";
import useDebounce from "./useDebounce";
import { useApi } from "../../apis";
import Pull from "../../apis/Pull";
import { Sports, MatchState } from "../../consts/match";
import dayjs from "dayjs";

import M from '../common/m'
import IconTeam from "../icons/IconTeam";
import EmptyList from "../common/EmptyList";
import LoadingBar from "../common/LoadingBar";
import { useIntl } from "react-intl";

function HighlightText(
  {
    source,
    keyword,
  }: {
    source: string,
    keyword: string
  }
) {
  return (
    <label
      className="highlight-text"
      dangerouslySetInnerHTML={{
        __html: source.split(
          new RegExp(keyword, 'gi')
        ).join(
          `<b>${keyword}</b>`
        )
      }}
    />
  );
}

function Search() {

  const intl = useIntl()
  const [pull] = useApi([Pull])

  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [matchList, setMatchList] = useState([])
  const [tourList, setTourList] = useState([])

  const location = useLocation()

  useEffect(() => {
    const searchEl = document.getElementsByClassName("search-button")[0]

    if (searchEl) {
      searchEl.addEventListener("touchstart", () => {
        setShowSearch(true)
      })
    }
  }, [location.pathname])

  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [showSearch])

  // 获取搜索结果
  const getResult = useDebounce(() => {
    if (searchValue !== '') {
      setLoading(true)
      pull.getMatchTours(searchValue).then(({matchs, tours}: any) => {
        setMatchList(matchs)
        setTourList(tours)
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setTourList([])
      setMatchList([])
    }
  }, 300)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(' ', "")
    setSearchValue(value)
    getResult()
  }

  return (
    <CSSTransition
      in={showSearch}
      timeout={300}
      classNames="search-container"
      unmountOnExit
    >
      <div
        className="search-container"
      >
        <div className="search-bar dark">
          <div className="search-bar-input">
            <Icon type="search" className="search-icon"/>
            <input
              value={searchValue}
              type="text"
              placeholder={intl.formatMessage({id: 'search.placeholder'})}
              onChange={onChange}
            />
            <button
              className={
                mergeClass({
                  "search-clear": true,
                  "search-clear-hide": searchValue === ''
                })
              }
              onClick={() => {
                setTourList([])
                setMatchList([])
                setSearchValue('')
              }}
            >
              <Icon type="cross" color="#181818"/>
            </button>
          </div>
          <button
            className="search-cancel"
            onClick={() => {
              setShowSearch(false)
            }}
          >
            <M id="filter.cancel" />
          </button>
        </div>
        {
          loading ?
            <LoadingBar/> :
            (tourList.length + matchList.length) > 0 ?
              <div className="search-result">
                <div className="search-result-league">
                  {
                    tourList.length > 0
                    &&
                    <div className="title">
                      <M id="search.tours" />（{tourList.length}）
                    </div>
                  }
                  {
                    tourList.map((item: any) => (
                      <Link
                        key={item.id}
                        onClick={() => setShowSearch(false)}
                        to={`/tours/${item.sportId}/${JSON.stringify({name: item.name, tourIds: [item.id]})}`}
                      >
                        <HighlightText
                          source={item.name as string}
                          keyword={searchValue}
                        />
                        <span>
                          <M 
                            id="search.match_count" 
                            values={{count: tourList.length}}
                          />
                         <Icon type="right" color="#777777"/>
                        </span>
                      </Link>
                    ))
                  }
                </div>
                <div className="search-result-match">
                  {
                    matchList.length > 0
                    &&
                    <div className="title">
                      <M id="search.matchs" />（{matchList.length}）
                    </div>
                  }
                  {
                    matchList.map((item: any) => {

                        const team1 = item.name.split(' vs ')[0]
                        const team2 = item.name.split(' vs ')[1]

                        let logo1 = item.logo1
                        let logo2 = item.logo2

                        if (
                          ![Sports.SOCCER, Sports.BASKETBALL, Sports.ESPORTS].includes(item.sportId)
                        ) {
                          logo1 = logo2 = undefined;
                        }

                        return (
                          <Link
                            key={item.id}
                            onClick={() => setShowSearch(false)}
                            to={`/detail/${item.id}`}
                          >
                            <div className="team">
                              <IconTeam src={logo1} name={team1} size={40}/>
                              <HighlightText
                                source={team1}
                                keyword={searchValue}
                              />
                            </div>
                            <div className="center">
                              <div>
                                {
                                  item.matchState !== MatchState.LIVE
                                    ? (
                                      dayjs(item.matchDate).format('MM/DD HH:mm')
                                    )
                                    : <M id="search.playing"/>
                                }
                              </div>
                              <div>VS</div>
                              <div>
                                <M id="match.more_plays" />
                                <span>
                                  &nbsp;
                                  {item.matchMarket + '+'}
                                </span>
                              </div>
                            </div>
                            <div className="team">
                              <IconTeam src={logo2} name={team2} size={40}/>
                              <HighlightText
                                source={team2}
                                keyword={searchValue}
                              />
                            </div>
                          </Link>
                        )
                      }
                    )
                  }
                </div>
              </div> :
              <EmptyList/>
        }
      </div>
    </CSSTransition>
  );
}

export default Search;