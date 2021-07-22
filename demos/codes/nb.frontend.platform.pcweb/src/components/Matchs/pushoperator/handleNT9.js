export default (vm, { mid, data: { state } }) => {
  const [isOver, isLive] = [/^3$/.test(state), /^[12]$/.test(state)];
  let [showLive, matchIndex] = [window.NBConfig.SHOW_LIVE, -1];
  const sports = window.NBConfig.AVAILABLE_SPORTS;
  if (!vm.matchGroups || !vm.matchGroups.length) {
    return;
  }
  const groupIndex = vm.matchGroups.findIndex((g) => {
    matchIndex = g.matchs.findIndex(m => m.matchID === String(mid));
    return matchIndex !== -1;
  });
  if (groupIndex === -1 || matchIndex === -1) {
    return;
  }
  for (let i = 0; i < sports.length; i += 1) {
    const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
    if (`${vm.matchGroups[groupIndex].matchs[matchIndex].sportID}` === `${sno}` && typeof sports[i] === 'object') {
      showLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
      break;
    }
  }
  if (isOver || (isLive && !showLive)) {
    vm.matchGroups[groupIndex].matchs.splice(matchIndex, 1);
    const { matchDay } = vm.matchGroups[groupIndex];
    vm.countByDay[matchDay] -= 1;
    if (vm.countByDay[matchDay] === 0) {
      vm.matchGroups.splice(groupIndex, 1);
    }
  }
};
