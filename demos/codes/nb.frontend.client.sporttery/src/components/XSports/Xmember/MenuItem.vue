<template>
  <v-touch
    :class="{
      'x-menu-item': true,
      'split-content': splitContent,
    }"
    @tap="$emit('tap')"
  >
    <slot
      class="icon-menu-item"
      name="icon"
    />
    <div class="content"><slot /></div>
    <slot name="operation">
      <button>
        <icon-arrow
          direction="right"
          width=".08rem"
          height=".14rem"
        />
      </button>
    </slot>
  </v-touch>
</template>
<script>
export default {
  props: {
    splitContent: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less">
.x-menu-item {
  display: flex;
  align-items: center;
  line-height: .5rem;
  padding: 0 .15rem 0 .2rem;
  margin-top: .01rem;
  background: #fff;
  border-bottom-left-radius: 6px;
  .content {
    flex-grow: 1;
    padding-left: .1rem;
  }
  &.split-content .content {
    display: flex;
    span {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  button {
    padding: 0.08rem;
    line-height: .08rem;
    margin-right: -.08rem;
  }
  svg.icon-arrow path {
    fill: #909090;
  }
}
.blue .x-menu-item {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #37363c, #333238);
  .content { color: #cccccc; }
  svg.icon-arrow path {
    fill: #909090;
  }
}
</style>
