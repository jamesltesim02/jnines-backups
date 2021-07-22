/**
 * 金额显示转换过滤器
 * 每3位加一个,号
 */
export default (source, fractionDigits = -1) => {
  if (!+source) {
    return source;
  }

  if (parseInt(source, 10) < 1000) {
    if (fractionDigits !== -1) {
      return (+source).toFixed(fractionDigits);
    }
    return source;
  }
  const [numInt, numDeci = 0] = String(source).split('.');
  const intLen = numInt.length;

  const ni = numInt.split('').map((c, i) => {
    if ((intLen - i - 1) % 3 === 0 && (intLen - i) > 3) {
      return `${c},`;
    }
    return c;
  }).join('');

  let di = 0;
  if (fractionDigits === -1) {
    di = numDeci;
  } else if (fractionDigits === 0) {
    di = 0;
  } else if (fractionDigits > 0) {
    di = `${numDeci}0000`.substring(0, fractionDigits);
  }

  di = di ? `.${di}` : '';

  return ni + di;
};
