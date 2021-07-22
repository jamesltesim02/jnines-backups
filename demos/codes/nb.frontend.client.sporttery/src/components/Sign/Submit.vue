<template>
  <div class="submit">
    <v-touch
      tag="button"
      @tap="$emit('submit')"
    >{{label}}</v-touch>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      default: '',
    },
  },
};
</script>

<style lang="less">
.submit{
  text-align: center;
  padding: 0 .15rem 0 .3rem;
  margin-top: .52rem;
  button {
    letter-spacing: 1px;
    font-size: .16rem;
    width: 100%;
    line-height: .4rem;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 10rem;
  }
}
.horizontal .submit {
  position: absolute;
  bottom: .3rem;
  width: 100%;
}
</style>
