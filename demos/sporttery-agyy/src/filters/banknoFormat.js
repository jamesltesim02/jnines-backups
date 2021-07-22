// 银行卡格式拆分步长
const BANK_SPLIT_STEP = 4;

export default (source) => {
  if (!source) {
    return '';
  }

  return source.split('').map((c, i) => {
    if (i % BANK_SPLIT_STEP === 0) {
      return ` ${c}`;
    }
    return c;
  }).join('');
};
