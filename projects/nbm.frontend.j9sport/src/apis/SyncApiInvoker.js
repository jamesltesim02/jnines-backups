import queryString from 'query-string';

class SyncApiInvoker {
  conf = {
    baseURL: null,
    headers: {
      'x-requested-with': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    withCredentials: false,
    async: false,
    handleRequest: conf => conf,
    validateStatus: status => status === 200,
    transformResponse: result => result,
    handleResponse: data => data,
    dataType: 'json',
  };

  constructor(conf) {
    this.setConf(conf);
  }

  mergeConf(conf1 = {}, conf2 = {}) { // eslint-disable-line class-methods-use-this
    if (conf2.baseURL && !conf2.baseURL.endsWith('/')) {
      conf2.baseURL = `${conf2.baseURL}/`;
    }

    const newConf = {
      ...conf1,
      ...conf2,
      headers: {
        ...conf1.headers,
        ...conf2.headers,
      },
    };

    return newConf;
  }

  setConf(conf = {}) {
    this.conf = this.mergeConf(this.conf, conf);
  }

  fillUrl(url = '', conf) {
    if (!conf.baseURL) {
      return url || window.location.href;
    }

    if (url.startsWith('/')) {
      url = url.substring(1);
    }

    return `${conf.baseURL}${url}`;
  }

  invoke(
    method = 'GET',
    url = '',
    data = null,
    conf = {},
  ) {
    method = method.toUpperCase();
    url = this.fillUrl(url, conf);
    conf.data = data;
    conf = this.mergeConf(this.conf, conf);

    let newConf = conf.handleRequest(conf);
    if (!newConf) {
      newConf = conf;
    }

    const xhr = new XMLHttpRequest();
    const sendRequest = () => {
      if (method === 'GET') {
        xhr.send();
        return;
      }

      if (newConf.headers['Content-Type'].startsWith('application/json')) {
        xhr.send(conf.data ? JSON.stringify(conf.data) : '');
        return;
      }

      xhr.send(conf.data ? queryString.stringify(conf.data) : '');
    };

    const getData = () => {
      // const resType = xhr.getResponseHeader('Content-Type');
      const result = newConf.transformResponse(xhr.responseText);
      // let resData = null;
      // if (resType === 'application/json' || newConf.dataType.toLowerCase() === 'json') {
      //   resData = typeof result === 'string' ? JSON.parse(result) : result;
      // } else {
      //   resData = result;
      // }
      // return newConf.handleResponse(resData);
      return newConf.handleResponse(result);
    };

    if (method === 'GET' && conf.data) {
      url = `${url}?${queryString.stringify(conf.data)}`;
    }

    xhr.open(method, url, newConf.async);
    xhr.withCredentials = newConf.withCredentials;

    // 设置header
    Object.entries(newConf.headers).forEach(pair => xhr.setRequestHeader(pair[0], pair[1]));

    sendRequest();
    // 成功
    if (newConf.validateStatus(xhr.status)) {
      return getData();
    }

    throw { // eslint-disable-line no-throw-literal
      status: xhr.status,
      data: getData(),
    };
  }
}

SyncApiInvoker.create = conf => new SyncApiInvoker(conf);

['get', 'post', 'put', 'head', 'delete', 'patch'].forEach((method) => {
  SyncApiInvoker.prototype[method] = function (...args) { // eslint-disable-line func-names
    return this.invoke(method.toUpperCase(), ...args);
  };
});

export default SyncApiInvoker;
