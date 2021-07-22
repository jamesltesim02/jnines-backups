import { sortGames, Game } from '../gameSort';
import store from '@/store';
import { getSettingAttr } from '@/utils/PortalUtils';

export default (vm, { st, data }) => {
  // 迭代本次推送中的所有玩法
  data.forEach(({
    gtp,
    bstage,
    ovalue,
    bcontent,
    gno,
    options: modifyOptions,
  }) => {
    /*
     * !!!!!!!!!!!!!!!!!!!!!!!!!!
     * 劲彩足球不开让球(16)和大小(18)
     */
    if (getSettingAttr('SOCCER_1618_AVAILABLE') !== true && +vm.sno === 10 && [16, 18].includes(gtp)) {
      return;
    }

    // 寻找当前页面中的匹配玩法列表
    const matchGame = vm.match.games.find(({
      gameType,
      betStage,
    }) => gtp === gameType && bstage === betStage);

    // 如果没有找到对应玩法,则判断是否需要添加玩法到列表中
    if (!matchGame) {
      const visibleOptions = [];
      modifyOptions.forEach(({
        name,
        state,
        odds,
        oid,
      }) => {
        if (state === 0) {
          return;
        }

        visibleOptions.push({
          optionID: String(oid),
          betOption: name,
          betStatus: state,
          odds,
          optionNo: gno,
        });
      });

      if (!visibleOptions.length) {
        return;
      }

      const game = new Game({
        sportID: st,
        gameType: gtp,
        betStage: bstage,
        groupType: bcontent,
        gameNo: gno,
      });
      game.addOptions(visibleOptions, ovalue);
      vm.match.games.push(game);
      return;
    }

    // 迭代推送玩法中的option并逐个更新的到页面上
    modifyOptions.forEach(({
      name,
      odds,
      oid,
      state,
      ono,
    }) => {
      let alreadyMatched = false;

      for (let columnIndex = matchGame.options.length - 1; columnIndex >= 0; columnIndex -= 1) {
        let matchColumn = matchGame.options[columnIndex];
        if (!Array.isArray(matchColumn)) {
          matchColumn = [matchColumn];
        }
        const mathedIndex = matchColumn.findIndex(v => v && v.optionID === String(oid));
        if (mathedIndex !== -1) {
          alreadyMatched = true;

          // 0不显示 不显示则从列表中删除元素
          if (state <= 5) {
            matchColumn.splice(mathedIndex, 1);
          } else {
            matchColumn[mathedIndex].betStatus = state;
          }

          // 如果某一组option被删除,直接从game中删除该组
          if (!matchColumn.length) {
            matchGame.options.splice(columnIndex, 1);
          }

          break;
        }
      }

      // 如果本次更新为可见并在页面中为找到对应项,则添加到页面中
      if (!alreadyMatched && state > 5) {
        matchGame.addOptions(
          [{
            optionID: String(oid),
            betOption: name,
            betStatus: state,
            odds,
            optionNo: ono,
          }],
          ovalue,
        );
      }
    });

    // 对game中的option重新排序
    matchGame.sortOptions();
  });

  // 对玩法列表重新排序
  sortGames(vm.match.games);
  store.commit('match/updateDetailOptionRefreshToken');
};
