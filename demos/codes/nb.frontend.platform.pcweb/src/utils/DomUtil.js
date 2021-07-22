/**
 * 获取元素的绝对位置
 *
 * @param {HTMLDom} el
 *    被获取绝对位置的元素
 * @param {object} position
 *    初始位置值, 默认都为0
 */
export const getPosition = (el, position = { top: 0, left: 0 }) => {
  if (!el) {
    return position;
  }

  console.log(
    el,
    el.offsetTop,
    el.offsetLeft,
    position.top + el.offsetTop,
    position.left + el.offsetLeft,
  );

  [
    position.top,
    position.left,
  ] = [
    position.top + el.offsetTop,
    position.left + el.offsetLeft,
  ];

  return getPosition(el.offsetParent, position);
};

export default {};
