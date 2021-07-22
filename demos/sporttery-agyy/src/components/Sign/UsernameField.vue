<template>
  <input-field
    :value="value"
    :maxlength="maxlength"
    :placeholder="placeholder"
    autocomplete="off"
    @input="value => $emit('input', value)"
    @keypress="e => $emit('keypress', e)"
  >
    <v-touch
      v-show="value"
      @tap="$emit('input', '')"
      slot="control"
    ><icon-clear /></v-touch>
  </input-field>
</template>
<script>
import InputField from '@/components/Sign/InputField';
import IconClear from './icons/IconClear';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      default: '',
    },
    placeholder: {},
    maxlength: {
      default: 20,
    },
  },
  components: {
    InputField,
    IconClear,
  },
};
</script>
