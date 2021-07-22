<template>
  <input-field
    :value="value"
    :type="show ? 'text' : 'password'"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @input="v => $emit('input', v)"
    @keypress="e => $emit('keypress', e)"
  >
    <v-touch
      slot="control"
      @tap="show = !show"
    ><icon-eye :opened="show" /></v-touch>
  </input-field>
</template>
<script>
import InputField from '@/components/Sign/InputField';
import IconEye from './icons/IconEye';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      default: '',
    },
    maxlength: {
      default: '20',
    },
    placeholder: {},
  },
  data() {
    return {
      show: false,
    };
  },
  components: {
    InputField,
    IconEye,
  },
};
</script>
