<template>
  <v-touch
    tag="a"
    class="x-info-item"
    @tap="$emit('tap')"
  >
    <label>{{label}}</label>
    <div><slot /></div>
    <button>
      <icon-arrow
        direction="right"
        color="#909090"
        width=".08rem"
        height=".14rem"
      />
    </button>
  </v-touch>
</template>
<script>
export default {
  props: {
    label: {},
  },
};
</script>
<style lang="less">
.x-info-item {
  display: grid;
  grid-template-columns: 1fr 2fr .12rem;
  line-height: .6rem;
  align-items: center;
  color: #505050;
  border-bottom: 1px solid #ebebeb;
  &:last-child {
    border: 0;
  }
  label {
    font-size: .14rem;
  }
  div {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button {
    text-align: right;
  }
}
.blue .x-info-item {
  color: #ecebeb;
  border-bottom: 1px solid #2e2f34;
}
</style>
