// nt1 为改变头柱项状态
export default (vm, {
  data,
  mid,
  st,
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
      oddsLower: false,
      oddsUpper: false,
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
  vm.$set(vm.matchs, matchIndex, match);
};
