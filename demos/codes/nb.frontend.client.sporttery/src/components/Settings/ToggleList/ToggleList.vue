<template>
  <div class="ss-toggle-list">
    <input-field label="投注时自动接受更高赔率变化">
      <toggle-button v-model="acceptHeightOddsChange" />
    </input-field>
    <input-field label="自动接受所有赔率变化">
      <toggle-button v-model="acceptAllOddsChange" />
    </input-field>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import InputField from './InputField';
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
    InputField,
    ToggleButton,
  },
  methods: {
    ...mapMutations('setting', ['updateSetting']),
  },
};
</script>
