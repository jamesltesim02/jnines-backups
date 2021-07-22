<template>
  <div class="login-register-toggle">
    <router-link
      :to="to"
      :replace="true"
    >{{label}}</router-link>
  </div>
</template>
<script>
export default {
  props: ['to', 'label'],
};
</script>
<style lang="less">
.login-register-toggle {
  position: absolute;
  width: 100%;
  bottom: .5rem;
  text-align: center;
  a {
    opacity: .8;
    color: #fff;
  }
}
</style>
