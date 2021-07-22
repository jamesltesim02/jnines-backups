// 比分改变
export default (vm, {
  mid,
  data: {
    hs,
    as,
  },
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

  match.matchScore = `${hs}:${as}`;

  vm.$set(vm.matchs, matchIndex, match);
};
