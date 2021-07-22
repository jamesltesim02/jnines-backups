const [header] = document.getElementsByTagName('head');

const setTitle = (title) => {
  let titleEl = header.querySelector('title');

  if (titleEl) {
    titleEl.innerHTML = title;
  } else {
    titleEl = document.createElement('title');
    titleEl.innerHTML = title;
    header.appendChild(titleEl);
  }
};

const setMeta = (key, value) => {
  let el = header.querySelector(`meta[name="${key}"]`);
  if (el) {
    el.content = value;
  } else {
    el = document.createElement('meta');
    el.name = key;
    el.content = value;
    header.appendChild(el);
  }
};

export default (info) => {
  setTitle(info.pageTitle);
  setMeta('keywords', info.pageKeywords);
  setMeta('description', info.pageDescription);
};
