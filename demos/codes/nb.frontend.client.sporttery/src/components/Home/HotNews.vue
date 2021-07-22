<template>
  <div class="hot-news">
    <div class="title">
      <h3>{{$t('page.hotNews')}}</h3>
      <v-touch
        tag="a"
        class="more"
        @tap="$router.push('/newslist')"
      >MORE</v-touch>
    </div>
    <loading-bar v-if="loading" />
    <ul>
      <v-touch
        tag="li"
        v-for="(n, i) in news"
        :key="i"
        class="news-item"
        @tap="$router.push(`/newsdetail/${n.newsID}`)"
      >
        <cimg :remote="true" :src="`image/${n.newsImg}`" />
        <div class="news-info">
          <h5>{{n.newsTitle}}</h5>
          <div class="news-content">
            <div class="news-date">
              <span>{{n.createDate | dateFormat('MM-dd HH:mm')}}</span>
            </div>
            <p>{{n.newsNote}}</p>
          </div>
        </div>
      </v-touch>
    </ul>
  </div>
</template>
<script>
import LoadingBar from '@/components/common/LoadingBar';
// import { StorageKey } from '@/config/constants';
// import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findnews } from '@/api/pull';

export default {
  data() {
    return {
      news: [],
      loading: false,
    };
  },
  components: {
    LoadingBar,
  },
  async created() {
    // this.news = loadFromStorage(StorageKey.HOT_NEWS_LIST_KEY, []);
    try {
      this.loading = true;
      this.news = await findnews({
        pageNum: 1,
        pageSize: 5,
      }) || [];

      // saveToStorage(StorageKey.HOT_NEWS_LIST_KEY, this.news);
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  },
};
</script>
<style lang="less">
.hot-news {
  margin-top: .2rem;
  .title {
    display: flex;
    line-height: .22rem;
    padding-right: .12rem;
  }
  h3 {
    flex-grow: 1;
    font-family: PingFangSC;
    font-size: .16rem;
    color: #4a4a4a;
    font-weight: 600;
    padding-left: .12rem;
  }
  .more {
    padding-right: .12rem;
    color: #2e2f34;
    font-size: .12rem;
    padding: 0 .1rem;
    background: #ebe7eb;
    border-radius: 10rem;
    transform: scale(0.8333333333333334);
  }
  ul {
    padding: 0 .12rem;
  }
  .news-item {
    display: flex;
    padding: .1rem 0;
    border-bottom: 1px solid #e8e6e8;
    img {
      width: 1.34rem;
      height: .96rem;
      border-radius: 6px;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .news-info {
    width: 2.18rem;
    word-break: break-all;
    padding: 0 .08rem 0 .14rem;
    h5 {
      font-size: .13rem;
      color: #282627;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      //这里是在第二行有省略号
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .news-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    .news-date {
      position: relative;
      text-align: right;
      padding-bottom: .05rem;
      &::before {
        position: absolute;
        content: "";
        display: inline-block;
        left: 0;
        top: .03rem;
        width: .43rem;
        height: .02rem;
        border-radius: .025rem;
        background-image: linear-gradient(93deg, #967eec, #c47ad1 32%, #f86ea7 73%, #ffaecf);
      }
    }
    span {
      display: inline-block;
      background: #ebe7eb;
      border-radius: 6px;
      width: .74rem;
      line-height: .16rem;
      font-size: .12rem;
      text-align: center;
      color: #a39ea3;
    }
    p {
      font-size: .12rem;
      color: #676267;
    }
  }
}

.black .hot-news {
  h3, h5, .more{
    color: #b0b0b0;
  }
  .more {
    background: linear-gradient(121deg, #3d4046, #35363c)
  }
  .news-item {
    border-color: #333339;
  }
  .news-content {
    .news-date::before {
      background: linear-gradient(91deg, #fe597d, #ffb775);
    }
    span {
      background: linear-gradient(121deg, #3d4046, #35363c);
      color: #a39ea3;
    }
    p {
      color: #b0b0b0;
    }
  }
}
</style>
