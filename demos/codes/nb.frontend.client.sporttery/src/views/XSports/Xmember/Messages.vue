<template>
  <list-page
    class="x-messages"
    @nextPage="toNext"
  >
    <nav-bar
      title="站内信"
      slot="header"
    />
    <no-records
      v-if="!hasMore && !pageIndex"
      minify
    />
    <template v-else>
      <v-touch
        tag="a"
        v-for="m in messages"
        :key="m.id"
        :class="{
          item: true,
          unread: m.state === 0,
        }"
        @tap="$router.push(`/member/messages/${m.id}`)"
      >
        <header>
          <h3>{{ m.title }}</h3>
          <span>{{ m.createDate | dateFormat }}</span>
        </header>
        <section>{{ m.content }}</section>
      </v-touch>
    </template>
    <loading-bar v-if="loading" />
    <template slot="footer">
      <v-touch
        tag="button"
        @tap="readAll"
      >
        <div class="icon"><icon-set-read /></div>
        <div>全部已读</div>
      </v-touch>
      <v-touch
        tag="button"
        @tap="deleteAll"
      >
        <div class="icon"><icon-trash /></div>
        <div>全部删除</div>
      </v-touch>
    </template>
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { getMailsByUser, deleteAll, setAllReaded } from '@/api/activity';
import IconTrash from '../icons/IconTrash';
import IconSetRead from '../icons/IconSetRead';

export default {
  data() {
    return {
      // 是否正在调用接口
      loading: false,
      // 是否有更多数据
      hasMore: true,
      messages: [],
      pageSize: 20,
      pageIndex: 0,
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
  },
  components: {
    IconTrash,
    IconSetRead,
  },
  created() {
    this.queryMessages();
  },
  methods: {
    async queryMessages(pageIndex = 1) {
      try {
        this.loading = true;
        if (pageIndex === 1) {
          this.pageIndex = 0;
          this.messages = [];
        }
        const result = await getMailsByUser({
          pageSize: this.pageSize,
          userId: this.userinfo.nbUser,
          pageIndex,
        });
        if (!result || !result.length) {
          this.hasMore = false;
          return;
        }
        this.hasMore = true;
        this.messages.push(...result);
        this.pageIndex = pageIndex;
      } finally {
        this.loading = false;
      }
    },
    toNext() {
      this.queryMessages(this.pageIndex + 1);
    },
    async deleteAll() {
      try {
        this.$loading('请稍后...');
        await deleteAll({
          userId: this.userinfo.nbUser,
        });
        this.$toast('删除成功');
        this.queryMessages(1);
      } finally {
        this.$loading.close();
      }
    },
    async readAll() {
      try {
        this.$loading('请稍后...');
        await setAllReaded({
          userId: this.userinfo.nbUser,
        });
        this.$toast('设置成功');
        this.queryMessages(1);
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.x-messages {
  .page-content {
    padding: 0 .1rem;
    .item {
      display: block;
      border-radius: 6px;
      box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.5);
      background-image: linear-gradient(to top, #f9f9f9, #ffffff);
      padding: .1rem;
      margin-top: .1rem;
      header {
        display: grid;
        grid-template-columns: 3fr 2fr;
        letter-spacing: -0.23px;
        line-height: .2rem;
        h3 {
          font-size: 14px;
          font-weight: normal;
          letter-spacing: -0.27px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          text-align: right;
          font-size: .12rem;
          color: #999;
          font-style: normal;
        }
      }
      section {
        margin-top: .08rem;
        padding: 0 .08rem;
        color: #999;
        font-size: .12rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.unread header h3 {
        position: relative;
        padding-left: .08rem;
        font-weight: bolder;
        &::before {
          content: "";
          background: #ff5353;
          border-radius: 50%;
          display: block;
          width: .05rem;
          height: .05rem;
          position: absolute;
          left: 1px;
          top: 50%;
        }
      }
    }
  }
  .page-footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    height: .8rem;
    box-shadow: 0 -7px 20px 0 rgba(0, 0, 0, 0.08);
    background-image: linear-gradient(to top, #f8f8f8, #ffffff);
    button {
      color: #666;
      .icon {
        height: .24rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .05rem;
      }
    }
  }
}
.blue .x-messages {
  .page-content {
    .item {
      box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
      background: linear-gradient(to bottom, #3a393f, #333238);
      header {
        h3 { color: #ecebeb; }
        span { color: #999999; }
      }
      section { color: #999999; }
      &.unread header h3 {
        &::before { background: #ff5353; }
      }
    }
  }
  .page-footer {
    border: 1px solid #2e2f34;
    background: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 -.07rem .2rem 0 rgba(0,0,0,.1);
    button { color: #777777; }
  }
}
</style>
