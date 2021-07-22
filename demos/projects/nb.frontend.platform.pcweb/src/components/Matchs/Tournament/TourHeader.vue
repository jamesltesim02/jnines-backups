<template>
  <h3
    @click="$emit('update:expanded', !expanded)"
    class="tour-header"
  >
    <span>{{name}}</span>
    <i>{{count}}</i>
    <button>
      <icon-arrow
        :direction="expanded ? 'up' : 'down'"
      />
    </button>
  </h3>
</template>
<script>

export default {
  props: ['expanded', 'name', 'count'],
};
</script>

<style lang="less">
.tour-header {
  position: relative;
  line-height: 34px;
  padding-bottom: 10px;
  border-left: 7px solid #ff5353;
  border-bottom: 1px solid #ff5353;
  padding-left: 24px;
  font-size: 20px;
  color: #ecebeb;
  box-shadow: 0 2px 4px 0 rgba(37, 37, 37, 0.5);
  cursor: pointer;
  * {
    position: relative;
    z-index: 1;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, #28262d, #1e1d23);
    opacity: .74;
    z-index: 0;
  }
  i {
    font-size: 14px;
    color: #9b9b9b;
    display: inline-block;
    width: 22px;
    line-height: 22px;
    background: #3f3f3f;
    text-align: center;
    border-radius: 50%;
    margin-left: 12px;
    font-weight: normal;
    font-style: normal;
  }
  button {
    position: absolute;
    right: 15px;
    padding: 10px 15px;
    svg {
      height: 12px;
      width: 8px;
      g path{
        fill: #909090;
      }
    }
  }
}
</style>
