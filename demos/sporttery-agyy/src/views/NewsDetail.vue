<template>
  <list-page class="news-detail-page">
    <nav-bar
      :title="$t('page.newsDetail')"
      slot="header"
    />
    <loading-bar v-if="loading && !detail.newsID" />
    <div v-if="detail.newsID">
      <h2>{{detail.newsTitle}}</h2>
      <div class="writer-and-date">
        <span class="witer">{{detail.newsSource}}</span>
        &nbsp;|&nbsp;
        <span class="date">{{detail.createDate | dateFormat('yyyy-MM-dd HH:mm:ss')}}</span>
      </div>
      <div class="detail-content" v-html="content" />
    </div>
  </list-page>
</template>
<script>
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import LoadingBar from '@/components/common/LoadingBar';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findnewsbyid } from '@/api/pull';

const cdn = window.NBConfig.RESOURCE_URL;

export default {
  props: ['id'],
  data() {
    return {
      detail: {},
      loading: false,
    };
  },
  components: {
    ListPage,
    NavBar,
    LoadingBar,
  },
  computed: {
    content() {
      if (!this.detail.newsBody) {
        return '';
      }
      return this.detail.newsBody
        .replace(
          /src="\/cdn\/image\//gim,
          `src="${cdn}image/`,
        )
        .replace(/style=".+?"/gim, '');
    },
  },
  async created() {
    const cacheKey = `${StorageKey.NEWS_DETAIL_KEY}-${this.id}`;
    this.detail = loadFromStorage(cacheKey, {});
    try {
      this.loading = true;
      const detail = await findnewsbyid(this.id);
      if (detail) {
        this.detail = detail;
        saveToStorage(cacheKey, this.detail);
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
    this.$toast.center(this.$t('message.noNewsDetail'));
    this.$router.go(-1);
  },
};
</script>
<style lang="less">
.news-detail-page {
  .page-content {
    padding: .15rem .12rem;
  }
  h2 {
    font-size: .22rem;
  }
  .writer-and-date {
    padding: .1rem 0;
    color: #999;
  }
  .detail-content {
    font-size: .14rem;
    color: #2e2f34;
    p {
      padding: .05rem 0;
    }
    img {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}

.black {
  h2 {
    color: #bababa;
  }
  .writer-and-date {
    color: #5c5c5c;
  }
  .detail-content {
    color: #909090;
  }
}
</style>
