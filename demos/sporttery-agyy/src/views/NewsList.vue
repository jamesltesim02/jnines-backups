<template>
  <list-page
    class="news-list-page"
    @scrollBottom="toNext"
  >
    <nav-bar
      :title="$t('page.newsList')"
      slot="header"
    />
    <loading-bar v-if="loading && loadingPn == 1" />
    <ul>
      <v-touch
        tag="li"
        v-for="(n, i) in list"
        :key="i"
        @tap="$router.push(`/newsdetail/${n.newsID}`)"
        class="news-item"
      >
        <div class="info">
          <h3>{{n.newsTitle}}</h3>
          <div class="source">{{n.newsSource}}</div>
        </div>
        <cimg :remote="true" :src="`image/${n.newsImg}`" />
      </v-touch>
    </ul>
    <div v-if="!hasMore && !loading" class="no-more">{{$t('message.noMoreRecords')}}</div>
    <loading-bar v-if="loading && loadingPn > 1" />
  </list-page>
</template>
<script>
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import LoadingBar from '@/components/common/LoadingBar';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findnews } from '@/api/pull';

export default {
  data() {
    return {
      pageSize: 20,
      pageNum: 1,
      list: [],
      hasMore: true,
      loading: false,
      loadingPn: 1,
      usingTempData: false,
    };
  },
  components: {
    ListPage,
    NavBar,
    LoadingBar,
  },
  created() {
    this.queryNewsList();
  },
  methods: {
    async queryNewsList(condition = {}) {
      const queryParam = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ...condition,
      };

      this.list = loadFromStorage(StorageKey.NEWS_LIST_KEY, []);
      try {
        this.loading = true;
        this.loadingPn = queryParam.pageNum;
        const data = await findnews(queryParam);
        if (queryParam.pageNum === 1) {
          this.list = [];
          saveToStorage(StorageKey.NEWS_LIST_KEY, data || []);
        }
        if (data && data.length) {
          this.list.push(...data);
          this.pageNum = queryParam.pageNum;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 按当前条件查询下一页比赛
     */
    toNext() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.queryNewsList({
        pageNum: this.pageNum + 1,
      });
    },
  },
};
</script>
<style lang="less">
.news-list-page {
  .page-content {
    padding: .12rem;
  }

  .news-item {
    display: flex;
    padding: .05rem 0 .1rem;
    border-bottom: 1px solid #e8e6e8;
    &:last-child {
      border-bottom: 0;
    }
    .info {
      flex-grow: 1;
      padding: 0 .1rem;
      width: 2.54rem;
    }
    h3 {
      font-size: .14rem;
      word-break: break-all;
    }
    .source {
      color: #999;
      font-size: .12rem;
    }

    img {
      width: .97rem;
      height: .66rem;
      border-radius: 6px;
    }
  }
}
.black .news-list-page .news-item {
  border-color: #2E2F34;
  h3 {
    color: #bababa;
  }
}
</style>
