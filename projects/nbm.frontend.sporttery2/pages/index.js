import React from 'react'

import withApi from '../api'

import LineHolder from '../components/common/line-holder'

import {
  AppNav,
  Banner,
  Announcement,
  MainNav,
  Ranking,
  Gurus,
  News,
  HotLive
} from '../components/index'

function IndexPage ({
  initBanners = [],
  initAnnos: {
    totalRecord: annoCount = 0,
    list:annoList = []
  } = {},
  initNews: {
    totalRecord: newsCount = 0,
    list:newsList = []
  } = {},
  initGurus: {
    totalRecord: guruCount = 0,
    list:guruList = []
  } = {}
}) {
  return (
    <>
      <AppNav />
      {
        initBanners && initBanners.length
        ? (
          <Banner
            items={initBanners}
            hp={0.4266666666666667}
          />
        )
        : null
      }
      {annoCount ? <Announcement annos={annoList} /> : <LineHolder />}
      <MainNav />
      <Ranking />
      <HotLive />
      {guruCount ? <Gurus items={guruList} /> : null}
      {newsCount ? <News news={newsList} /> : <LineHolder />}
    </>
  )
}

IndexPage.getInitialProps = async ({
  api: {
    info,
    guru
  }
}) => {
  const [
    initBanners,
    initAnnos,
    initNews,
    initGurus,
  ] = await Promise.all([
    info.listBanner(),
    info.listAnnos(),
    info.listNews({ pageSize: 5 }),
    guru.list({
      isTop: 1,
      pageSize: 5
    })
  ])

  return {
    initBanners,
    initAnnos,
    initNews,
    initGurus
  }
}

export default withApi('info', 'guru')(IndexPage)
