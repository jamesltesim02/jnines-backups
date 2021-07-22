export default (vm, {
  data,
  mid,
  st,
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

  const matchedGames = match.games;
  data.forEach((modifyGame) => {
    const gameIndex = matchedGames.findIndex(v => v.gameType === modifyGame.gtp);
    const modifyOptions = modifyGame.options.filter(v => v.state > 5).map(mo => ({
      optionID: String(mo.oid),
      betOption: mo.name,
      betStatus: mo.state,
      odds: mo.odds,
      optionNo: mo.ono,
      betBar: modifyGame.ovalue,
      oddsStatus: 0,
    }));

    if (!modifyOptions.length) {
      if (gameIndex !== -1) {
        matchedGames.splice(gameIndex, 1);
      }
      return;
    }

    const newGame = {
      gameType: modifyGame.gtp,
      betStage: modifyGame.bstage,
      betBar: modifyGame.ovalue,
      gameNo: modifyGame.gno,
      groupType: modifyGame.bcontent,
      sportID: st,
      options: modifyOptions,
    };

    if (gameIndex !== -1) {
      matchedGames[gameIndex] = newGame;
    } else {
      matchedGames.push(newGame);
    }
  });
  vm.$set(vm.matchGroups[groupIndex].matchs, matchIndex, match);
};
