export default (vm, {
  data,
  mid,
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

  // 赔率变化
  match.games.forEach(async (g, gi) => {
    const modifyGame = data.find(vg => vg.gtp === g.gameType);
    if (!modifyGame) {
      return;
    }

    g.options.forEach((opt) => {
      const modifyOption = modifyGame.options.find(v => String(v.oid) === opt.optionID);
      const gms = match.games && match.games[gi];
      if (!modifyOption || !gms || !gms.options) {
        return;
      }
      opt.oddsUpper = opt.odds < modifyOption.odds;
      opt.oddsLower = opt.odds > modifyOption.odds;
      opt.odds = modifyOption.odds;
      if (opt.oddsUpper || opt.oddsLower) {
        if (opt.timmer) {
          clearTimeout(opt.timmer);
        }
        opt.timmer = setTimeout(() => {
          opt.oddsUpper = false;
          opt.oddsLower = false;
        }, 1500);
      }
    });
  });
};
