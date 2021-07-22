<template>
  <div class="ss-memberinfo">
    <div class="ss-content">
      <div>
        <div class="ss-account">
          <v-touch
            v-if="!isLoged"
            tag="span"
            @tap="toLogin"
          >{{$t('page.noLoginLabel')}}</v-touch>
          <span v-else>{{userinfo.memberAccount || userinfo.nbUser}}</span>
        </div>
        <div class="ss-purse">
          <div class="title">
            <span>{{$t('page.wallettitle')}}</span>
          </div>
          <div class="balance">
            <span>{{(userinfo.balance || '0.00') | moneyFormat}}</span>
          </div>
          <v-touch
            tag="button"
            class="operate"
            @tap="toDeposit"
          ><i>diposit</i></v-touch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';

export default {
  computed: {
    ...mapState('app', {
      isLoged: state => state.isLoged,
      userinfo: state => state.userinfo || {},
    }),
  },
  methods: {
    toLogin() {
      toPoralUrlByKey('LOGIN_PAGE_URL');
    },
    toDeposit() {
      if (!this.isLoged) {
        this.toLogin();
        return;
      }
      toPoralUrlByKey('DEPOSIT_PAGE_URL');
    },
  },
};
</script>
<style lang="less">
.ss-memberinfo {
  padding: .2rem .1rem .05rem;
  .ss-content {
    position: relative;
    padding: .28rem 0;
    box-shadow: 0 10px 20px 0 rgba(255, 83, 83, 0.07);
    transition: all  .25s ease-out;
    & > div {
      position: relative;
      z-index: 1;
    }
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      background: #fff;
      opacity: .95;
      transition: all  .25s ease-out;
    }
  }
  .ss-account {
    text-align: center;
    span {
      position: relative;
      display: inline-block;
      color: #ff5353;
      font-size: .15rem;
      width: 1.55rem;
    }
    span::before, span::after {
      content: "";
      display: block;
      position: absolute;
      width: .67rem;
      height: .02rem;
      top: .105rem;
      transition: all  .25s ease-out;
    }
    span::before {
      left: -.8rem;
      background: linear-gradient(90deg, #ffffff, #9e9e9e);
    }
    span::after {
      right: -.8rem;
      background: linear-gradient(-90deg, #ffffff, #9e9e9e);
    }
  }
  .ss-purse {
    margin-top: .28rem;
    padding: 0 .2rem 0 .3rem;
    display: flex;
    .title {
      display: flex;
      align-items: flex-end;
      color: #2e2f34;
      font-size: .12rem;
      line-height: .23rem;
      opacity: .7;
      transition: all  .25s ease-out;
    }
    .balance {
      position: relative;
      flex-grow: 1;
      color: #ff5353;
      font-size: .3rem;
      padding-left: .15rem;
      text-align: center;
      &::before {
        content: "￥";
        position: absolute;
        left: 15px;
        bottom: 0;
        color: #909090;
        font-size: .18rem;
        margin-right: .1rem;
        opacity: .7;
        transition: all  .25s ease-out;
      }
    }
    .operate {
      font-size: 0;
      display: flex;
      align-items: center;
      padding: 0 .1rem;
      i {
        position: relative;
        display: block;
        height: .2rem;
        width: .2rem;
        border-radius: 50%;
        background: #ff5353;
        transition: all  .25s ease-out;
      }
      i::before, i::after {
        content: "";
        display: block;
        position: absolute;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all  .25s ease-out;
      }
      i::before {
        height: .02rem;
        width: .12rem;
      }
      i::after {
        height: .12rem;
        width: .02rem;
      }
    }
  }
}

.black .ss-memberinfo {
  .ss-content {
    box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
    &::before {
      background: #3a393f;
    }
  }
  .ss-account {
    span { color: #ff5353; }
    span::before {
      background: linear-gradient(90deg, #36353b, #ff5353);
    }
    span::after {
      background: linear-gradient(-90deg, #36353b, #ff5353);
    }
  }
  .ss-purse {
    .title {
      opacity: 1;
      color: #909090;
    }
    .balance { color: #ff5353; }
    .balance ::before {
      color: #c2cacb;
    }
    .operate {
      i {
        background: #ff5353;
        box-shadow: 1px -1px 32px -1px #ff5353;
      }
      i::before, i::after {
        background: #2e2d33;
      }
    }
  }
}
.blue .ss-memberinfo {
  .ss-content {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    &::before {
      background: linear-gradient(to bottom, #3a393f, #333238);
    }
  }
  .ss-account {
    span { color: #53fffd; }
    span::before {
      background: linear-gradient(90deg, #36353b, #53fffd);
    }
    span::after {
      background: linear-gradient(-90deg, #36353b, #53fffd);
    }
  }
  .ss-purse {
    .title {
      opacity: 1;
      color: #909090;
    }
    .balance { color: #53fffd; }
    .balance ::before {
      color: #c2cacb;
    }
    .operate {
      i {
        background: #00b5b3;
        box-shadow: 1px -1px 32px -1px #00b5b3;
      }
      i::before, i::after {
        background: #2e2d33;
      }
    }
  }
}
</style>
