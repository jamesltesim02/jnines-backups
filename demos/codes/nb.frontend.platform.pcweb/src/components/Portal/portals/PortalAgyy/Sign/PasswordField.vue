<template>
  <input-field
    :label="label || $t('agPage.sign.password')"
    :type="visible ? 'text' : 'password'"
    :placeholder="placeholder || $t('agPage.sign.passholder')"
    :value="value"
    maxlength="20"
    @input="v => $emit('input', v)"
    @keypress="e => $emit('keypress', e)"
  >
    <a
      slot="icon"
      class="agyy-pass-icon"
      @click="visible = !visible"
    >
      <img
        v-if="visible"
        src="./images/pass-hide.png"
      />
      <img
        v-else
        src="./images/pass-show.png"
      />
    </a>
  </input-field>
</template>
<script>
import InputField from './InputField';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: ['label', 'value', 'placeholder'],
  data() {
    return {
      visible: false,
    };
  },
  components: {
    InputField,
  },
};
</script>
<style lang="less">
.agyy-pass-icon {
  cursor: pointer;
}
</style>
