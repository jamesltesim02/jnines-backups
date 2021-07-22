// 比赛阶段改变
export default (
  vm,
  {
    mid,
    data: {
      state,
    },
  },
) => {
  if (!vm.matchs || !vm.matchs.length) {
    return;
  }

  const matchIndex = vm.matchs.findIndex(({ matchID }) => matchID === String(mid));

  if (matchIndex > -1 && state === 3) {
    vm.matchs.splice(matchIndex, 1);
  }
};
