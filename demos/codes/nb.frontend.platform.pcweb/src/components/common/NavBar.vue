<template>
  <div class="nav-bar">
    <button @click="$router.go(-1)">
      <icon-arrow direction="left" />
    </button>
    <ul v-if="routes && routes.length">
      <li
        v-for="r in routes"
        :key="r.route"
      >
        <router-link :to="r.route">{{r.text}}</router-link>
        <icon-arrow direction="right" />
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['routes'],
};
</script>

<style lang="less">
.nav-bar {
  height: 56px;
  display: flex;
  button {
    height: 56px;
    margin-right: 17px;
    svg {
      height: 22px;
      width: 15px;
      path {
        fill: #4a4a4a;
      }
    }
  }
  ul {
    display: flex;
    line-height: 56px;
    li {
      font-size: 12px;
      svg {
        margin: 0 5px;
        width: 9px;
        height: 9px;
        path {
          fill: #9b9b9b;
        }
      }
      &:last-child svg{
        display: none;
      }
    }
  }
}
</style>
