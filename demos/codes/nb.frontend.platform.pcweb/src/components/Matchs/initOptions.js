export default (matchs) => {
  if (matchs && matchs.length) {
    matchs.forEach((m) => {
      if (!m.games || !m.games.length) {
        return;
      }
      m.games.forEach((g) => {
        if (!g.options || !g.options.length) {
          return;
        }
        g.options.forEach((o) => {
          if (!o) {
            return;
          }

          o.betBar = g.betBar;
          // 赔率上升下降标志, 0 无变化, 大于0 为上升, 小于0位下降
          o.oddsStatus = 0;
        });
      });
    });
  }

  return matchs;
};
