import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Link} from "react-router-dom";
import {RightOutlined} from '@ant-design/icons';
import IconSport from "../../../icons/icon-type/icon-sports";
import IconTeam from "../../../icons/IconTeam";
import {MatchState, Sports} from "../../../../consts/match";
import dayjs from "dayjs";

import M from '../../m';
import mergeClass from "../../../../utils/mergeClass";

function HighlightText (
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

function SearchResult(
  {
    matchList,
    tourList,
    keyword
  }: {
    matchList: any[]
    tourList: any[],
    keyword: string
  }
) {
  const history = useHistory()
  const [curSelected, setCurSelected] = useState(0)

  useEffect(() => {
    const downHandler = (
      {
        key,
      }:
      {
        key: string
      }
    ) => {
      if (key === 'ArrowUp') {
        setCurSelected((curSelected) => {
          if (curSelected <= 0) {
            return curSelected
          }else {
            return curSelected - 1
          }
        })
      }
      if (key === 'ArrowDown') {
        setCurSelected((curSelected) => {
          if (curSelected >= (matchList.length + tourList.length -1)) {
            return curSelected
          }else {
            return  curSelected + 1
          }
        })
      }

      const curEl = document.getElementsByClassName('list-item selected')[0]
      const scroller = document.getElementsByClassName('search-bar-content')[0]

      if (curEl) {

        if (key === 'Enter') {
          const url = curEl.getAttribute('href')
          history.push(`${url}`)
        }

        if (curEl.getBoundingClientRect().y > 650) {
          scroller.scrollBy(0,curEl.getBoundingClientRect().height)
        }
        if (curEl.getBoundingClientRect().y < 200) {
          scroller.scrollBy(0,-curEl.getBoundingClientRect().height)
        }
      }
    };
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [tourList, matchList, setCurSelected, history]);



  return (
    <div>
      {/*联赛查询结果*/}
      {
        tourList.length ? (
          <div className="tour-result">
            <div className="head">
                  <span>
                    <M id="search.tours"/>
                    ({tourList.length})
                  </span>
            </div>
            <div className="tour-result-list">
              {
                tourList.map((item, index) => (
                  <Link
                    className={
                      mergeClass({
                        'list-item': true,
                        'selected': index === curSelected
                      })
                    }
                    onMouseEnter={() => setCurSelected(index)}
                    key={item.id}
                    to={`/tours/${item.sportId}/${JSON.stringify({name: item.name, tourIds: [item.id]})}`}
                  >
                    <HighlightText
                      source={item.name as string}
                      keyword={keyword}
                    />
                    <span>
                      <M
                        id="match.serch_countoftour"
                        values={{ count: item.matchMarket }}
                      />
                    </span>
                    <RightOutlined />
                  </Link>
                ))
              }
            </div>
          </div>
        ) : null
      }
      {/*比赛查询结果*/}
      {
        matchList.length ? (
          <div className="match-result">
            <div className="head">
                  <span>
                  <M id="search.matchs"/>
                  ({matchList.length})
                  </span>
            </div>
            <div className="match-result-list">
              {
                matchList.map((item, index) => {
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
                      className={
                        mergeClass({
                          'list-item': true,
                          'selected': (index + tourList.length) === curSelected
                        })
                      }
                      key={item.id}
                      onMouseEnter={() => setCurSelected(index + tourList.length)}
                      to={`/detail/${item.id}`}
                    >
                      {/*球队名 icon*/}
                      <div className="match-name">
                        <HighlightText
                          source={team1}
                          keyword={keyword}
                        />
                        <IconTeam src={logo1} name={team1} size={16}/>
                        VS
                        <IconTeam src={logo2} name={team2} size={16}/>
                        <HighlightText
                          source={team2}
                          keyword={keyword}
                        />
                      </div>
                      {/*开赛时间 玩法数量*/}
                      <div className="match-time">
                        <span>
                          <IconSport type={item.sportId}/>
                          {
                            item.matchState !== MatchState.LIVE
                              ? (
                                <M
                                  id="search.time"
                                  values={{time: dayjs(item.matchDate).format('MM/DD HH:mm')}}
                                />
                              )
                              : <M id="search.playing"/>
                          }
                          &emsp;
                          {item.matchMarket + '+'}
                        </span>
                        {/*跳转比赛详情*/}
                        <span>
                          <M id="match.to_detail"/>
                          <RightOutlined/>
                        </span>
                      </div>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        ) : null
      }
    </div>
  );
}

export default SearchResult;