// 关闭比赛所有玩法
export default (vm, { mid }) => {
  if (!vm.matchGroups || !vm.matchGroups.length) {
    return;
  }

  if (!vm.matchs || !vm.matchs.length) {
    return;
  }

  const matchIndex = vm.matchs.findIndex((m) => {
    const ism = m.matchID === String(mid);
    return ism;
  });
  if (matchIndex === -1) {
    return;
  }
  vm.matchs[matchIndex].games = [];
};
