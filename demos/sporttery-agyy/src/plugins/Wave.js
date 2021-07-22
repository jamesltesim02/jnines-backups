const getLeft = (el) => {
  const rst = el.offsetParent ? el.offsetLeft + getLeft(el.offsetParent) : el.offsetLeft;
  return rst;
};
const getTop = (el) => {
  const rst = el.offsetParent ? el.offsetTop + getTop(el.offsetParent) : el.offsetTop;
  return rst;
};
const getClick = (e, el) => {
  el.data.touchFlag = e.targetTouches ? true : el.data.touchFlag;
  let touch = e.targetTouches ? e.targetTouches[0] : e;
  touch = e.changedTouches ? e.changedTouches[0] : touch;
  const [ex, ey] = [touch.clientX, touch.clientY];
  el.data.posit = [ex, ey];
  return [ex, ey];
};
const getPosit = (el) => {
  [el.data.left, el.data.top] = [getLeft(el), getTop(el)];
};
const getXAndY = (ex, ey, el) => {
  const [hw, hh] = [el.data.width / 2, el.data.height / 2];
  let [x, y] = [ex - el.data.left - hw, ey - el.data.top - hh];
  [x, y] = [Math.abs(x) > hw ? 0 : x, Math.abs(y) > hh ? 0 : y];
  return [x, y, hw, hh];
};
const getPara = (e, el) => {
  el.data.id += 1;
  getPosit(el);
  const [ex, ey] = getClick(e, el);
  const [x, y, hw, hh] = getXAndY(ex, ey, el);
  return [el.data.id, hw, hh, x, y, 0];
};
const runWave = (el) => {
  for (let i = el.data.waves.length - 1; i >= 0; i -= 1) {
    el.data.waves[i].scale += el.data.waves[i].speed;
    if (el.data.waves[i].scale >= 1.2) el.data.waves.splice(i, 1);
  }
  let newHtml = el.data.html;
  for (let i = 0; i < el.data.waves.length; i += 1) {
    newHtml += '<span style="position:absolute;display:block;border-radius:100%;background:rgba(0,0,0,0.1);';
    newHtml += `z-index:${el.data.waves[i]['z-index']};width:${el.data.waves[i].width};height:${el.data.waves[i].height};`;
    newHtml += `top:${el.data.waves[i].top};left:${el.data.waves[i].left};transform-origin:${el.data.waves[i]['transform-origin']};`;
    newHtml += `transform:scale(${el.data.waves[i].scale},${el.data.waves[i].scale});"></span>`;
  }
  el.innerHTML = newHtml;
  if (el.data.waves.length) setTimeout(() => { runWave(el); }, 20);
};
const createWave = (e, el) => {
  const [id, hWidth, hHeight, x, y, scale] = getPara(e, el);
  const obj = Object.assign({ id, scale, speed: 0.01 }, {
    'z-index': id + 100,
    width: `${2 * el.data.radius}px`,
    height: `${2 * el.data.radius}px`,
    top: `${hHeight - el.data.radius}px`,
    left: `${hWidth - el.data.radius}px`,
    'transform-origin': `${el.data.radius + x}px ${el.data.radius + y}px`,
    transform: `scale(${scale},${scale})`,
  });
  el.data.waves.push(obj);
  if (el.data.waves.length < 2) runWave(el);
};
const changeWave = (el) => {
  for (let i = 0; i < el.data.waves.length; i += 1) {
    el.data.waves[i].speed = 0.08;
  }
};
const eFun = (e, el) => {
  if (el.data.touchFlag && !e.targetTouches) return;
  changeWave(el);
  if (el.data.clicked && Date.now() - el.data.t.st <= el.data.t.max) clearTimeout(el.data.t.timer);
  el.data.clicked = false;
};
const sFun = (e, el) => {
  if (el.data.touchFlag && !e.targetTouches) return;
  el.data.t.st = Date.now();
  if (!el.data.clicked) {
    getClick(e, el);
    el.data.clicked = true;
    createWave(e, el);
    clearTimeout(el.data.t.timer);
    el.data.t.timer = setTimeout(() => {
      if (el.data.clicked) {
        el.data.t.st = Date.now();
        eFun(e, el);
      }
    }, el.data.t.max);
  }
};
const mFun = (e, el) => {
  if (el.data.touchFlag && !e.targetTouches) return;
  getPosit(el);
  const [ex, ey] = getClick(e, el);
  let rst = ex < el.data.left || ex > el.data.left + el.data.width;
  rst = rst || ey < el.data.top || ey > el.data.top + el.data.height;
  if (el.data.clicked && rst) eFun(e, el);
};
export default {
  inserted(el) {
    const [sWidth, sHeight] = [el.offsetWidth * el.offsetWidth, el.offsetHeight * el.offsetHeight];
    const rds = Math.sqrt(sWidth + sHeight) / 2;
    el.data = { id: 0, width: el.offsetWidth, height: el.offsetHeight };
    el.data = Object.assign(el.data, { top: 0, left: 0, radius: parseInt(rds, 10) + 1 });
    el.data = Object.assign(el.data, { waves: [], clicked: false, posit: [0, 0] });
    el.data = Object.assign(el.data, { touchFlag: false, attrs: [], html: el.innerHTML });
    [el.data.t, el.style.position, el.style.zIndex] = [{ max: 500, st: 0, timer: null }, 'relative', 90];
    [el.style.userSelect, el.style.overflow, el.style.cursor] = ['none', 'hidden', 'pointer'];
    el.style['-webkit-tap-highlight-color'] = 'transparent';
    el.addEventListener('touchstart', (e) => { sFun(e, el); });
    el.addEventListener('mousedown', (e) => { sFun(e, el); });
    el.addEventListener('touchmove', (e) => { mFun(e, el); });
    el.addEventListener('mousemove', (e) => { mFun(e, el); });
    el.addEventListener('touchend', (e) => { eFun(e, el); });
    el.addEventListener('mouseup', (e) => { eFun(e, el); });
    el.oncontextmenu = () => false;
  },
};
