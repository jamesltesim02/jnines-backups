// 比赛时间变化
export default (vm, {
  mid,
  data,
}) => {
  if (!vm.matchs || !vm.matchs.length) {
    return;
  }

  let match = null;
  const matchIndex = vm.matchs.findIndex((m) => {
    const ism = m.matchID === String(mid);
    if (ism) {
      match = m;
    }
    return ism;
  });
  if (matchIndex === -1) {
    return;
  }

  match.matchTime = JSON.stringify(data);

  // 比赛结束则从列表中删除
  if (data.period === 100) {
    vm.matchs.splice(matchIndex, 1);
    return;
  }

  vm.$set(vm.matchs, matchIndex, match);
};
