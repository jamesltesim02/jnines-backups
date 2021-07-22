<template>
  <list-page class="lottery" v-if="!horizScreen" >
    <nav-bar :title="lotTitle" slot="header" />
    <lottery-body :recordId="recordId" :type="type" />
  </list-page>
  <div class="lottery-horiz" v-else >
    <list-page class="lottery-horiz-left" >
      <nav-bar :title="lotTitle" slot="header" />
    </list-page>
    <list-page class="lottery-horiz-right" >
      <lottery-body :recordId="recordId" :type="type" />
    </list-page>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import NavBar from '@/components/common/NavBar';
import LotteryBody from '@/components/Lottery/LotteryBody';

export default {
  props: { recordId: String, type: Number },
  computed: {
    ...mapState('app', ['horizScreen']),
    lotTitle() {
      let lotStr = /^1$/.test(this.type) ? this.$t('share.betTaskFsh') : '';
      lotStr = /^2$/.test(this.type) ? this.$t('share.betShTaskFsh') : lotStr;
      lotStr = /^4$/.test(this.type) ? this.$t('share.flwTaskFsh') : lotStr;
      lotStr = /^11$/.test(this.type) ? this.$t('share.flwShTaskFsh') : lotStr;
      return lotStr;
    },
  },
  components: { NavBar, LotteryBody },
};
</script>
<style lang="less">
.horizontal .lottery-horiz { width: 100%; height: 100%; }
.lottery-horiz-left { width: 3.75rem; float: left; }
.lottery-horiz-right { float: right; }
.lottery, .lottery-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  }
}
.blue .lottery, .blue .lottery-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
.lottery, .lottery-horiz { .page-content, .page-content.scrollable { padding: 0; } }
</style>
