import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'

import withApi from '../../../api'

import ToTop from '../../../components/common/to-top'
import LoadingBlock from '../../../components/common/loading-block'

import HomeNav from '../../../components/matchs/home-nav'
import FocusMatchs from '../../../components/matchs/focus-maths'
import PlaySoon from '../../../components/matchs/play-soon'
import HomeInplay from '../../../components/matchs/home-inplay'
import FeaturedMatchs from '../../../components/matchs/featured-matchs'
import FriendLinks from '../../../components/matchs/friend-links'

const MainPage = ({
  store: {
    matchs
  },
  api: { pull },
}) => {
  const history = useHistory()

  const [ad, setAd] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const handleSportChange = sport => history.replace(`/tab/home/${sport}/`)

  React.useEffect(
    () => {
      setLoading(true)

      Promise.all([
        pull.getFocusAndAds(),
        pull.getInplayAndFeatured()
      ]).then(
        ([
          { ad, ...data },
          {
            live: inplay,
            select: featured
          }
        ]) => {
          setAd(ad)
          matchs.setData(data)
          matchs.setData({
            inplay,
            featured
          })
        }
      ).finally(
        () => setLoading(false)
      )

      // 页面卸载清空数据
      return () => matchs.clear()
    },
    []
  )

  return (
    <>
      <HomeNav
        fixed
        sport={false}
        onChange={handleSportChange}
      />
      <LoadingBlock loading={loading} />
      {
        loading
        ? null
        : (
          <>
            {/* 焦点赛事 */}
            <FocusMatchs
              list={matchs.focus.list}
            />
            {/* 即将开赛 */}
            <PlaySoon
              ad={ad}
              list={matchs.soon.list}
            />
            {/* 滚球列表 */}
            <HomeInplay
              list={matchs.inplay.list}
            />
            {/* 精选足球 */}
            <FeaturedMatchs
              sportId={10}
              list={matchs.featured.list}
            />
            {/* 精选篮球 */}
            <FeaturedMatchs
              sportId={11}
              list={matchs.featured.list}
            />
          </>
        )
      }
      <FriendLinks />
      {
        (
          matchs.inplay.list.length
          +
          matchs.featured.list.length
        ) > 4
        ? <ToTop />
        : null
      }
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(MainPage)
  )
)
