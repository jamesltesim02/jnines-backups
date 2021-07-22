
export default (vm, {
  mid,
}) => {
  if (!vm.matchGroups || !vm.matchGroups.length) {
    return;
  }

  let matchIndex = -1;
  const groupIndex = vm.matchGroups.findIndex((g) => {
    matchIndex = g.matchs.findIndex(m => m.matchID === String(mid));
    return matchIndex !== -1;
  });

  if (groupIndex === -1) {
    return;
  }

  vm.matchGroups[groupIndex].matchs.splice(matchIndex, 1);

  const { matchDay } = vm.matchGroups[groupIndex];
  vm.countByDay[matchDay] -= 1;

  if (vm.countByDay[matchDay] === 0) {
    vm.matchGroups[groupIndex].splice(groupIndex, 1);
  }
};
