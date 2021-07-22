<template>
  <list-page
    class="news-list-page"
    @scrollBottom="nextPage"
    v-if="!horizScreen"
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
  <div class="news-list-page" v-else>
    <div class="news-list-header">
      <nav-bar :title="$t('page.newsList')" />
    </div>
    <div class="news-list-content">
      <loading-bar v-if="loading && loadingPn == 1" />
      <ul class="flex-start-wrap">
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import LoadingBar from '@/components/common/LoadingBar';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findnews } from '@/api/pull';

const SCROLL_BOTTOM_HEIGHT = 20;
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
  computed: {
    ...mapState('app', ['horizScreen']),
  },
  components: {
    ListPage,
    NavBar,
    LoadingBar,
  },
  watch: {
    horizScreen() {
      this.listenScroll();
    },
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
    nextPage() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.queryNewsList({
        pageNum: this.pageNum + 1,
      });
    },
    listenScroll() {
      setTimeout(() => {
        const sc = this.$el.querySelector('.news-list-content');
        if (!sc) return;
        let [trigged, scrTop] = [false, sc.scrollTop];
        sc.addEventListener('scroll', () => {
          const toBottom = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
          if (toBottom <= SCROLL_BOTTOM_HEIGHT && sc.scrollTop > scrTop) {
            if (!trigged) {
              trigged = true;
              setTimeout(() => { trigged = false; }, 500);
              this.nextPage();
            }
          }
          scrTop = sc.scrollTop;
        });
      }, 100);
    },
  },
  mounted() {
    this.listenScroll();
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
.horizontal .news-list-page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .news-list-header {
    position: relative;
    width: 100%;
    height: .44rem;;
    z-index: 12;
  }
  .news-list-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
    ul {
      padding: .12rem 0;
      li {
        width: 3.5rem;
        margin-left: .12rem;
        margin-right: .12rem;
      }
    }
  }
}
</style>
