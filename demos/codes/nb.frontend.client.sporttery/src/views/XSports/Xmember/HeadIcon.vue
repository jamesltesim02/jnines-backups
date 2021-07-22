<template>
  <list-page>
    <nav-bar
      title="个人信息"
      slot="header"
    />
    <div class="x-head-icon">
      <v-touch
        tag="a"
        v-for="i in defaultIcons"
        :key="i"
        :class="{
          active: i === headrSrc,
        }"
        @tap="changeTo(i)"
      >
        <icon-head :src="i" />
        <i></i>
      </v-touch>
    </div>
  </list-page>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { modifyHeader } from '@/api/activity';
import IconHead from '@/components/XSports/Xmember/icons/IconHead/IconHead';

export default {
  data() {
    return {
      defaultIcons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    };
  },
  computed: {
    ...mapState('member', ['memberInfo']),
    headrSrc() {
      return +this.memberInfo.header || 0;
    },
  },
  components: {
    IconHead,
  },
  methods: {
    ...mapMutations('member', ['setMemberInfo']),
    async changeTo(head) {
      try {
        this.$loading(this.$t('message.submitting'));
        await modifyHeader({
          userId: this.memberInfo.userId,
          header: head,
        });
        this.setMemberInfo({
          ...this.memberInfo,
          header: head,
        });
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.x-head-icon {
  display: grid;
  grid-template-columns: repeat(5, .6rem);
  justify-content: space-around;
  grid-row-gap: .2rem;
  padding: .15rem .07rem;
  a {
    position: relative;
    i {
      display: none;
      position: absolute;
      bottom: 0;
      right: 0;
      width: .2rem;
      height: .2rem;
      background: #ff5353;
      border-radius: 50%;
      &::before, &::after{
        content: "";
        display: block;
        position: absolute;
        background: #fff;
        height: .02rem;
        border-radius: 1rem;
      }
      &::before {
        width: .05rem;
        top: .1rem;
        left: .05rem;
        transform: rotate(40deg);
      }
      &::after {
        width: .1rem;
        top: .09rem;
        left: .07rem;
        transform: rotate(-50deg);
      }
    }
  }
  a.active {
    i {
      display: block;
    }
  }
}
</style>
