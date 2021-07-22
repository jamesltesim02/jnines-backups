import random from 'lodash/random';
import { makeRecords, randomCharactors, slicePage } from "./mock-util";

const now = Date.now();
const start = now - (1000 * 60 * 60 * 24 * 30);

const redRecords = makeRecords({
  range: [0, 150],
  filler: () => ({
    actId: randomCharactors({ min: 6, max: 12 }),
    amount: random(0.01, 8888.00, true).toFixed(2),
    createTime: random(start, now),
    matchName: (
      [
        randomCharactors({ min: 6, max: 12 }),
        randomCharactors({ min: 6, max: 12 })
      ].join(' vs ')
    ),
    tournamentName: randomCharactors({ min: 6, max: 12 })
  }),
  sorter (r1, r2) {
    return r1.createTime - r2.createTime;
  }
});

export default {
  name: 'activity',
  records: redRecords,
  get_getRedRecord ({ pageIndex = 1 }) {
    // return {
    //   code: 200,
    //   msg: '',
    //   data: {
    //     count: 0,
    //     data: []
    //   }
    // };
    return slicePage(
      redRecords,
      pageIndex
    );
  },
};
