/**
 * 初始化option
 *
 * @param {object} opt
 *    投注项对象
 * @param {string} betBar
 *    玩法值(如: 1, 1:1, 2)
 */
export const initOption = (opt, betBar) => {
  opt.betBar = betBar;
  opt.oddsLower = false;
  opt.oddsUpper = false;
  return opt;
};

const columnFlow = cn => (options, betBar) => {
  const cols = [];
  options.forEach((o) => {
    const count = cols.reduce((total, curr) => total + curr.length, 0);
    const index = count % cn;
    if (!cols[index]) {
      cols[index] = [];
    }
    cols[index].push(initOption(o, betBar));
  });

  const len = Math.max(...cols.map(c => c.length));
  cols.forEach((col) => {
    col.length = len;
  });

  return cols;
};
const COLUMN_FLOW_2 = columnFlow(2);
const COLUMN_FLOW_3 = columnFlow(3);

/**
 * 针对特定玩法进行特殊排序处理
 */
const OPTIONS_SORTERS = {
  // 让分标准盘
  14: {
    columns: 3,
    k2i: {
      1: 0,
      x: 1,
      X: 1,
      2: 2,
    },
  },
  // 让分
  16: {
    columns: 2,
    k2i: {
      1: 0,
      2: 1,
    },
  },
  // 大小
  18: {
    columns: 2,
    k2i: {
      Over: 0,
      Under: 1,
    },
  },
  21: COLUMN_FLOW_2,
  25: COLUMN_FLOW_2,
  30: COLUMN_FLOW_2,
  // 波胆
  45: (options, betBar) => {
    const columns = [[], [], []];
    options.forEach((o) => {
      const scores = o.betOption.split(/[-:]/);
      let columnIndex = 0;

      if (scores[0] === scores[1]) {
        columnIndex = 1;
      } else if (scores[0] < scores[1]) {
        columnIndex = 2;
      }

      columns[columnIndex].push(initOption(o, betBar));
    });

    const len = Math.max(...columns.map(c => c.length));
    columns.forEach((col) => {
      col.length = len;
    });

    return columns;
  },
  47: COLUMN_FLOW_3,
};

/**
 * game信息类
 */
export class Game {
  constructor(game) {
    this.sportID = game.sportID;
    this.groupType = game.groupType;
    this.betStage = game.betStage;
    this.gameType = game.gameType;
    this.gameNo = game.gameNo;
    this.options = [];
    this.optionSorted = false;
    this.expanded = true;
    this.matchState = game.matchState;
  }

  /**
   * 添加多个option到玩法中
   * @param {object} options
   *    投注项列表
   * @param {string} betBar
   *    玩法值
   */
  addOptions(options, betBar) {
    if (!options) {
      return;
    }
    options = options.filter(o => o.betStatus >= 6 || this.matchState === 3);
    if (!options.length) {
      return;
    }

    const optionSorter = OPTIONS_SORTERS[this.gameType];

    if (typeof optionSorter === 'function') {
      this.options = optionSorter(options, betBar);
      return;
    }

    if (!this.options || !this.options.length) {
      if (optionSorter) {
        this.options = new Array(optionSorter.columns);
        for (let i = 0; i < optionSorter.columns; i += 1) {
          this.options[i] = [];
        }
      } else {
        this.options = [];
      }
    }

    options.forEach((o) => {
      let targetContainer = optionSorter ? this.options[optionSorter.k2i[o.betOption]] : this.options;
      if (typeof targetContainer === 'undefined') {
        if (!this.options) {
          targetContainer = [];
          this.options = targetContainer;
        } else {
          targetContainer = [];
          this.options[optionSorter.k2i[o.betOption]] = targetContainer;
        }
      }
      targetContainer.push(initOption(o, betBar));
    });
  }

  optionComparator(v1, v2) {
    if (this.gameType === 18) {
      return (+v2.betBar || 0) - (+v1.betBar || 0);
    }
    if (this.gameType === 16) {
      if (this.hasZero) {
        return (+v1.betBar || 0) - (+v2.betBar || 0);
      }
      return Math.abs(+v2.betBar || 0) - Math.abs(+v1.betBar || 0);
    }
    return v1.optionNo - v2.optionNo;
  }

  /**
   * 对玩法中的所有投注项进行排序
   */
  sortOptions() {
    if (!this.options || !this.options.length) {
      return;
    }

    if (!Array.isArray(this.options[0])) {
      this.options.sort(this.optionComparator.bind(this));
      return;
    }

    if (this.gameType === 16) {
      this.hasZero = this.options[0].findIndex(({ betBar }) => +betBar === 0) !== -1;
    }

    this.options.forEach((opt) => {
      opt.sort(this.optionComparator.bind(this));
    });
  }
}

/**
 * 对玩法列表进行排序
 * @param {array} games
 *    被排序的玩法列表
 */
export const sortGames = games => games.sort((v1, v2) => {
  if (!v1.optionSorted && v1.options && v1.options.length) {
    v1.sortOptions();
    v1.optionSorted = true;
  }
  if (!v2.optionSorted && v2.options && v2.options.length) {
    v2.sortOptions();
    v2.optionSorted = true;
  }

  const gns = v1.gameNo - v2.gameNo;
  if (gns !== 0) {
    return gns;
  }

  return v1.betStage - v2.betStage;
});

export default (games) => {
  if (!games || !games.length) {
    return [];
  }

  const gameGroups = {};
  games.forEach((g) => {
    const key = `${g.gameType}_${g.betStage}`;
    let game = gameGroups[key];

    if (!game) {
      game = new Game(g);
      gameGroups[key] = game;
    }

    game.addOptions(g.options, g.betBar);
  });

  const newGames = Object.values(gameGroups);
  sortGames(newGames);

  return newGames;
};
