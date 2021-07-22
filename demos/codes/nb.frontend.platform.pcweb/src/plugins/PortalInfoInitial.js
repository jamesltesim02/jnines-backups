import { finddomaininfo } from '@/api/pull';
import { getSettingAttr } from '@/utils/PortalUtils';

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

const setFavicon = () => {
  const faviconUrl = getSettingAttr('FAVICON_URL');
  if (!faviconUrl) {
    return;
  }

  const oldIcons = header.querySelectorAll('link[rel="icon"]');
  if (oldIcons && oldIcons.length) {
    oldIcons.forEach(icon => header.removeChild(icon));
  }

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = faviconUrl;

  header.appendChild(favicon);
};

export default {
  async install() {
    setFavicon();

    const [
      {
        pageTitle,
        pageKeywords,
        pageDescription,
      },
    ] = await finddomaininfo();
    setTitle(pageTitle);
    setMeta('keywords', pageKeywords);
    setMeta('description', pageDescription);
  },
};
