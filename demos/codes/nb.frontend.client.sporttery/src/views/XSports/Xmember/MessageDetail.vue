<template>
  <list-page class="x-message-detail">
    <nav-bar
      title="站内信"
      slot="header"
    />
    <div class="create-time">{{ message.createDate | dateFormat }}</div>
    <section>
      <h4>{{ message.title }}</h4>
      <p>{{ message.content }}</p>
    </section>
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { getMailInfoById, modifyMailReaded } from '@/api/activity';

export default {
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      message: {},
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
  },
  created() {
    if (!this.id) {
      this.$router.go(-1);
      return;
    }
    this.queryMessage();
  },
  methods: {
    async queryMessage() {
      try {
        // 设置loading
        this.message = await getMailInfoById({
          id: this.id,
          userId: this.userinfo.nbUser,
        });
        if (this.message.state === 0) {
          // TODO 响应结果处理
          modifyMailReaded({
            id: this.id,
            userId: this.userinfo.nbUser,
          });
        }
      } finally {
        // loading 设置false
      }
    },
  },
};
</script>
<style lang="less">
.x-message-detail .page-content{
  padding: .1rem;
  .create-time {
    color: #999;
    font-size: .12rem;
    letter-spacing: -0.23px;
  }
  section {
    margin-top: .1rem;
    border-radius: 6px;
    padding: .1rem .18rem;
    box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    h4 {
      font-size: .14rem;
      font-weight: normal;
    }
    p {
      padding: .1rem 0;
    }
  }
}
.blue .x-message-detail .page-content{
  .create-time { color: #999999; }
  section {
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
    background: linear-gradient(to bottom, #3a393f, #333238);
    h4 { color: #ecebeb; }
    p { color: #ecebeb; }
  }
}
</style>
