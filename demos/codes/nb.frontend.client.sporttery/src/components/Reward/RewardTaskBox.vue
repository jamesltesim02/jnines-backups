<template>
  <div class="nb-reward-task-box" >
    <div class="nb-reward-task-box-head flex-center">
      <div class="task-box-title">
        <i class="before"></i>
        <div class="task-slot-title flex-center"><slot name="title" /></div>
        <i class="after"></i>
      </div>
    </div>
    <div class="nb-reward-task-box-body"><slot /></div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'RewardTaskBox',
};
</script>

<style lang="less">
.nb-reward-task-box {
  width: 100%;
  margin-top: .1rem;
  padding-bottom: .1rem;
  background: #ffffff;
  .nb-reward-task-box-head { width: 100%; height: .48rem; padding-top: .1rem; }
  .task-box-title { position: relative; display: inline-block; width: auto; height: 100%; z-index: 1; }
  .task-box-title i { position: absolute; width: .03rem; height: .03rem; border-radius: 100%; z-index: 2; top: .2rem; background: #666666; }
  .task-box-title .before { left: -.1rem; }
  .task-box-title .after { right: -.1rem; }
  .task-box-title { .before::before, .after::before { position: absolute; content: ""; display: block; width: .67rem; height: .01rem; top: .01rem; z-index: 3; } }
  .task-box-title .before::before { right: .07rem; background: linear-gradient(to left, #666666, rgba(102,102,102,0)); }
  .task-box-title .after::before { left: .07rem; background: linear-gradient(to right, #666666, rgba(102,102,102,0)); }
  .task-slot-title { max-width: 2.15rem; height: 100%; font-size: .16rem; overflow: hidden; font-family: PingFangSC; color: #666666; span { color: #2e2f34; } }
  .nb-reward-task-box-body { padding: 0 .1rem; }
  .nb-reward-task-detail:last-child { margin-bottom: 0; }
}
.blue .nb-reward-task-box {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .task-box-title i { background: #666666; }
  .task-box-title .before::before { background: linear-gradient(to left, #666666, rgba(102,102,102,0)); }
  .task-box-title .after::before { background: linear-gradient(to right, #666666, rgba(102,102,102,0)); }
  .task-slot-title { color: #ecebeb; span { color: #53fffd; } }
}
</style>
