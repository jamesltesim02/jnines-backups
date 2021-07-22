export default (vm, {
  data,
  mid,
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

  match.games.forEach(async (g, gi) => {
    const modifyGame = data.find(vg => vg.gtp === g.gameType);
    if (!modifyGame) {
      return;
    }

    g.options.forEach((opt, oi) => {
      const modifyOption = modifyGame.options.find(v => String(v.oid) === opt.optionID);
      const mGp = vm.matchGroups && vm.matchGroups[groupIndex];
      const mth = mGp && mGp.matchs && mGp.matchs[matchIndex];
      const gms = mth && mth.games && mth.games[gi];
      if (!modifyOption || !gms || !gms.options) {
        return;
      }
      opt.oddsUpper = opt.odds < modifyOption.odds;
      opt.oddsLower = opt.odds > modifyOption.odds;
      opt.odds = modifyOption.odds;
      if (opt.oddsUpper || opt.oddsLower) {
        if (opt.timmer) clearTimeout(opt.timmer);
        opt.timmer = setTimeout(() => {
          opt.oddsUpper = false;
          opt.oddsLower = false;
          vm.$set(vm.matchGroups[groupIndex].matchs[matchIndex].games[gi].options, oi, opt);
        }, 1500);
      }
      vm.$set(vm.matchGroups[groupIndex].matchs[matchIndex].games[gi].options, oi, opt);
    });
  });
};
