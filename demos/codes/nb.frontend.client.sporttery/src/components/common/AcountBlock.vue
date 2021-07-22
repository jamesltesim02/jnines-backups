<template>
  <div class="memberinfo">
    <div class="account">
      <div v-if="!userinfo" class="account-group">
        {{$t('page.noLoginLabel')}}
      </div>
      <div v-else class="account-group">
        <span>{{userinfo.memberAccount}}</span>
        <span class="member-level">{{$t(`pagelite.levels.${userinfo.memberLevel}`)}}</span>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  props: ['userinfo'],
};
</script>
<style lang="less">
.memberinfo {
  position: relative;
  margin-right: .1rem;
  padding-top: .3rem;
  padding-bottom: .24rem;
  * {
    position: relative;
    z-index: 2;
  }
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    opacity: 0.9;
    border-radius: 6px;
    border-top-right-radius: .45rem;
    overflow: hidden;
    z-index: 0;
  }
  .account {
    text-align: center;
    .account-group {
      position: relative;
      display: inline-block;
      font-size: .15rem;
      width: 1.55rem;
      color: #ff5353;
    }
    .account-group::before, .account-group::after {
      content: "";
      display: block;
      position: absolute;
      width: .67rem;
      height: .01rem;
      top: .105rem;
      transition: all  .25s ease-out;
      opacity: .8;
    }
    .account-group::before {
      left: -.8rem;
      background: linear-gradient(90deg, #ffffff, #ff5353);
    }
    .account-group::after {
      right: -.8rem;
      background: linear-gradient(-90deg, #ffffff, #ff5353);
    }
  }
  .member-level {
    margin-left: .1rem;
    display: inline-block;
    // width: .42rem;
    padding: 0 .08rem 0 .05rem;
    line-height: .2rem;
    font-size: .12rem;
    box-shadow: 0 1px 4px 2px rgba(255, 74, 74, 0.38);
    background: linear-gradient(105deg, #fe597d, #ffb775);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top-right-radius: .1rem;
    border-bottom-right-radius: .1rem;
    color: #fff;
  }
}

.black .memberinfo {
  &::before {
    box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
    background-image: linear-gradient(to bottom, #3a393f, #2b2a2f);
  }
  .account {
    .account-group {
      color: #ecebeb;
    }
    .account-group::before {
      background: linear-gradient(90deg, #36353b, #ff5353);
    }
    .account-group::after {
      background: linear-gradient(-90deg, #36353b, #ff5353);
    }
  }
}
</style>
