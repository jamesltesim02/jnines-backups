const header = document.querySelector('head');

const setTitle = (title) => {
  let titleEl = header.querySelector('title');

  if (!titleEl) {
    titleEl = document.createElement('title');
    header.appendChild(titleEl);
  }
  titleEl.innerHTML = title;
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

const portalSetting = window.NBConfig.PORTAL_SETTING;
const setFavicon = () => {
  if (!portalSetting || !portalSetting.FAVICON_URL) {
    return;
  }

  const oldIcons = header.querySelectorAll('link[rel="icon"]');
  if (oldIcons && oldIcons.length) {
    oldIcons.forEach(icon => header.removeChild(icon));
  }

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = portalSetting.FAVICON_URL;

  header.appendChild(favicon);
};

export default (info) => {
  setTitle(info.pageTitle);
  setMeta('keywords', info.pageKeywords);
  setMeta('description', info.pageDescription);

  setFavicon();
};
