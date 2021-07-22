  /**
   * 计算可串关列表
   * @param {array} items
   *        已选中的投注项
   */
export const toSeries = (items = []) => {
  var result = [],
    ops,
    ncnt,
    nbit;

  if (!items.length) {
    return [];
  }

  ops = items.map(function (v, i) {
    return {
      mid: v.mid,
      odds: v.odds || 0
    };
  });

  ncnt = ops.length;
  nbit = 0xFFFFFFFF >>> (32 - ncnt);
  for (var i = 1; i <= nbit; i++) {
    var cms = [];
    for (var j = 0; j < ncnt; j++) {
      if ((i << (31 - j)) >> 31 == -1) {
        cms.push(ops[j]);
      }
    }
    var isrepts = false;
    for (var m = 0; m < cms.length; m++) {
      var repts = 0;
      for (var n = 0; n < cms.length; n++) {
        if (cms[m].mid == cms[n].mid) {
          repts++;
        }
        if (repts >= 2) {
          isrepts = true;
          break;
        }
      }
      if (isrepts) {
        break
      }
      ;
    }
    if (isrepts) {
      continue
    }
    ;
    var resultObj = null;
    for (m = 0; m < result.length; m++) {
      if (result[m].nm === cms.length) {
        resultObj = result[m];
        break;
      }
    }
    if (!resultObj) {
      resultObj = { mct: 0, odds: 0, nm: cms.length };
      result.push(resultObj);
    }
    resultObj.mct++;
    var odds = 1;
    for (var m = 0; m < cms.length; m++) {
      odds *= cms[m].odds
    }
    resultObj.odds += odds;
  }

  return result
}

/**
 * 计算每场被选中的
 * @param {array} items
 *      已选中的投注项
 */
export const toMoc = (items = []) => {
  let moc = {}

  if (!items || !items.length) {
    return
  }

  items.forEach(item => {
    moc[item.mid] = (moc[item.mid] || 0) + 1
  })

  return moc
}