export default (vm, { data }) => {
  vm.match.games.forEach((g, gi) => {
    const modifyGames = data.filter(({ gtp }) => gtp === g.gameType);
    if (!modifyGames || !modifyGames.length) {
      return;
    }

    const modifyOptions = [];
    modifyGames.forEach((mg) => {
      modifyOptions.push(...mg.options);
    });

    g.options.forEach((gos) => {
      if (!Array.isArray(gos)) {
        gos = [gos];
      }
      gos.forEach(async (go) => {
        const mo = modifyOptions.find(v => String(v.oid) === go.optionID);
        if (!mo || !mo.odds || go.odds === mo.odds) {
          return;
        }

        go.oddsStatus = mo.odds - go.odds;
        go.odds = mo.odds;
        if (go.oddsStatus) {
          if (go.timmer) {
            clearTimeout(go.timmer);
          }
          go.timmer = setTimeout(() => {
            go.oddsStatus = 0;
            vm.$set(vm.match.games, gi, g);
          }, 1500);
        }
        vm.$set(vm.match.games, gi, g);
      });
    });
  });
};
