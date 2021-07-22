export default (vm, {
  mid,
  data,
}) => {
  if (!vm.matchGroups || !vm.matchGroups.length) {
    return;
  }

  let matchIndex = -1;
  let match = null;

  const groupIndex = vm.matchGroups.findIndex((g) => {
    matchIndex = g.matchs.findIndex((m) => {
      const ism = m.matchID === String(mid);
      if (ism) {
        match = m;
      }
      return ism;
    });

    return matchIndex !== -1;
  });

  if (groupIndex === -1) {
    return;
  }

  match.matchTime = JSON.stringify(data);

  // 比赛结束则从列表中删除
  if (data.period === 100) {
    vm.matchGroups[groupIndex].matchs.splice(matchIndex, 1);
    return;
  }

  vm.$set(vm.matchGroups[groupIndex].matchs, matchIndex, match);
};
