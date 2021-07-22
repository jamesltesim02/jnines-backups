<template>
<ul class="agyy-settings">
  <li>
    <div>{{$t('agPage.member.acceptHeigher')}}</div>
    <toggle-button v-model="acceptHeightOddsChange" />
  </li>
  <li>
    <div>{{$t('agPage.member.acceptAll')}}</div>
    <toggle-button v-model="acceptAllOddsChange" />
  </li>
</ul>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import ToggleButton from './ToggleButton';

export default {
  computed: {
    ...mapState('setting', ['oddsAC']),
    acceptHeightOddsChange: {
      get() {
        return this.oddsAC >= 1;
      },
      set(n) {
        this.updateSetting({
          key: 'oddsAC',
          value: n ? 1 : 0,
        });
      },
    },
    acceptAllOddsChange: {
      get() {
        return this.oddsAC === 2;
      },
      set(n) {
        if (this.oddsAC === 0) {
          return;
        }
        this.updateSetting({
          key: 'oddsAC',
          value: n ? 2 : 1,
        });
      },
    },
  },
  components: {
    ToggleButton,
  },
  methods: {
    ...mapMutations('setting', ['updateSetting']),
  },
};
</script>
<style lang="less">
.agyy-settings {
  padding-left: 10px;
  li {
    padding-left: 10px;
    border-bottom: 1px solid #353535;
    display: flex;
    div {
      flex-grow: 1;
      cursor: default;
    }
    i.toggle-button {
      margin-top: 8px;
    }
  }
}
</style>
