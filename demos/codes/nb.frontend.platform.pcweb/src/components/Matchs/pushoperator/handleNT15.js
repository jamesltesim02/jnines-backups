
export default (vm, { mid }) => {
  if (!vm.matchGroups || !vm.matchGroups.length) {
    return;
  }
  let matchIndex = -1;
  const groupIndex = vm.matchGroups.findIndex((g) => {
    matchIndex = g.matchs.findIndex(m => m.matchID === String(mid));
    return matchIndex !== -1;
  });
  if (groupIndex === -1 || matchIndex === -1) {
    return;
  }
  vm.matchGroups[groupIndex].matchs[matchIndex].games = [];
};
