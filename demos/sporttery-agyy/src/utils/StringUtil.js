/**
 * 获取字符串占位宽度中文占2个字符,英文占1个字符
 *
 * @param {string} str
 *    目标字符串
 */
export const placeLength = (str) => {
  let len = 0;
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len += 1;
    } else {
      len += 2;
    }
  }
  return len;
};

export default {};
