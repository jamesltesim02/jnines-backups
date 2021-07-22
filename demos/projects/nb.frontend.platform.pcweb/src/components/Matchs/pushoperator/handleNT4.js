export default (vm, {
  mid,
  data: {
    hs,
    as,
  },
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

  match.matchScore = `${hs}:${as}`;

  vm.$set(vm.matchGroups[groupIndex].matchs, matchIndex, match);
};
