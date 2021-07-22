<template>
  <div class="x-introduction">
    <template v-if="isLoged || simplify">
      <section class="account-info">
        <div class="x-head">
          <icon-head :src="memberInfo.header" />
        </div>
        <div class="account">
          <h4>
            <span>{{ nickName }}</span>
            <v-touch
              v-if="!simplify"
              tag="button"
              @tap="toPath('/member/info')"
            >
              <icon-edit />
            </v-touch>
          </h4>
          <div class="relations">
            <v-touch tag="span" @tap="toFansPage">粉丝{{ memberInfo.fansCount }}</v-touch>
            <v-touch tag="span" @tap="toFlwerPage">关注{{ memberInfo.focusCount }}</v-touch>
          </div>
        </div>
        <div
          v-if="isCurrent"
          class="to-more"
        >
          <v-touch
            v-if="!simplify"
            tag="button"
            @tap="toPath(`/member/specialist/${memberInfo.userId}/0`)"
          >
            <icon-arrow
              direction="right"
              width=".08rem"
              height=".14rem"
            />
          </v-touch>
        </div>
        <div
          v-else
          class="add-follow"
        >
          <v-touch
            tag="button"
            :class="{
              followed: memberInfo.focus
            }"
            @tap="toggleFollow"
          >{{memberInfo.focus ? '已关注' : '+ 关注'}}</v-touch>
        </div>
      </section>
      <p v-if="memberInfo.remark">{{ memberInfo.remark }}</p>
    </template>
    <template v-else>
      <v-touch
        tag="section"
        class="account-info unloged"
        @tap="toLogin"
      >
        <span class="unloged-head">
          <icon-unloged />
        </span>
        <div class="tips">
          <div>马上登陆，享更多精彩服务</div>
          <div><button>立即登录</button></div>
        </div>
        <div class="to-more">
          <v-touch tag="button">
            <icon-arrow
              direction="right"
              width=".08rem"
              height=".14rem"
            />
          </v-touch>
        </div>
      </v-touch>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { fansFocus, cancelFocus } from '@/api/activity';
import { toPoralUrlByKey, pushToLogedPath } from '@/utils/PortalUtils';
import IconHead from './icons/IconHead';
import IconEdit from './icons/IconEdit';
import IconUnloged from './icons/IconUnloged';

export default {
  props: {
    simplify: {
      type: Boolean,
      default: false,
    },
    memberInfo: {
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    isCurrent() {
      return this.isLoged && this.userinfo.nbUser === this.memberInfo.userId;
    },
    nickName() {
      if (this.memberInfo.nickName) {
        return this.memberInfo.nickName;
      }
      if (this.isCurrent && this.userinfo.memberAccount) {
        return this.userinfo.memberAccount;
      }
      return this.memberInfo.userId;
    },
  },
  components: {
    IconEdit,
    IconHead,
    IconUnloged,
  },
  methods: {
    toLogin() {
      toPoralUrlByKey('LOGIN_PAGE_URL');
    },
    toPath(url) {
      pushToLogedPath(url);
    },
    async toggleFollow() {
      if (!this.isLoged) {
        this.toLogin();
        return;
      }

      if (this.loading) {
        return;
      }

      const {
        memberInfo: {
          focus,
          userId,
        },
        userinfo: {
          nbUser,
        },
      } = this;
      const fn = focus ? cancelFocus : fansFocus;

      try {
        this.loading = true;
        this.$loading('请稍后');
        await fn({
          memberUserId: userId,
          myUserId: nbUser,
        });
      } finally {
        this.$loading.close();
        this.loading = false;
      }

      this.$toast.center(`${focus ? '取消' : ''}关注成功`);

      this.$emit('followStateChange', !focus);
    },
    toFansPage() {
      if (!this.simplify && this.memberInfo.fansCount) {
        this.$router.push('/focusfans/0');
      }
    },
    toFlwerPage() {
      if (!this.simplify && this.memberInfo.focusCount) {
        this.$router.push('/focusfans/1');
      }
    },
  },
};
</script>
<style lang="less">
.x-introduction {
  padding: .1rem .15rem;
  .account-info {
    display: grid;
    grid-template-columns: .6rem 1fr .6rem;
    .x-head {
      width: .6rem;
      height: .6rem;
    }
    .account, .to-more, .add-follow {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    .account {
      padding-left: .1rem;
      h4 {
        font-size: .2rem;
        line-height: .24rem;
        letter-spacing: 1.33px;
        span {
          display: inline-block;
          max-width: 1.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        button {
          margin-left: .02rem;
          transform: translateY(.01rem);
        }
        svg path { fill: #AAAAAA; }
      }
      .relations {
        line-height: .17rem;
        margin-top: .08rem;
        font-size: .12rem;
        color: #666;
        margin: .08rem -.075rem 0;
        span {
          display: inline-block;
          padding: 0 .075rem;
          line-height: .12rem;
        }
        span:first-child {
          border-right: .005rem solid #505050;
        }
      }
    }
    .to-more {
      align-items: flex-end;
      margin-right: -.1rem;
      button {
        padding: 0.08rem;
        line-height: .08rem;
      }
      svg path {
        fill: #909090;
      }
    }
    .add-follow button {
      background: #ff5353;
      color: #fff;
      line-height: .24rem;
      padding: 0 .08rem;
      font-size: .12rem;
      border-radius: 10rem;
      transition: all .25s ease-out;
      &.followed {
        filter: grayscale(100%);
      }
    }
  }
  .account-info.unloged {
    .unloged-head {
      display: flex;
      width: .6rem;
      height: .6rem;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #E0E0E0;
      svg {
        transform: translate(.02rem, .01rem);
      }
    }
    .tips {
      padding: .09rem 0 0 .1rem;
      color: #bababa;
      button {
        line-height: .24rem;
        background: #ff5353;
        color: #fff;
        letter-spacing: -0.23px;
        padding: 0 .1rem;
        border-radius: 10rem;
        margin-top: .1rem;
      }
    }
  }
  p {
    color: #909090;
    font-size: .12rem;
    letter-spacing: 0.3px;
    margin-top: .12rem;
  }
}
.blue .x-introduction {
  .account-info {
    h4 {
      color: #ecebeb;
      button svg path { fill: #777; }
    }
    .relations {
      color: #999999;
      span:first-child { border-right: .005rem solid #666666; }
    }
    .to-more svg path { fill: #909090; }
    .add-follow button { background: #00b5b3; color: #fff; }
  }
  .account-info.unloged {
    .unloged-head {
      background: rgba(102,102,102,.5);
      border: .01rem solid #2e2f34;
    }
    .tips {
      color: #909090;
      button { background: #00b5b3; color: #fff; }
    }
  }
  p { color: #bababa; }
}
</style>
