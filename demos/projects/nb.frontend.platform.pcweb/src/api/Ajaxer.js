import queryString from 'query-string';

class Ajaxer {
  conf = {
    baseURL: null,
    headers: {
      'x-requested-with': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    withCredentials: false,
    async: true,
    validateStatus: status => status === 200,
    transformResponse: result => result,
    error(...e) {
      console.log(...e);
    },
    dataType: 'json',
  };

  constructor(conf) {
    this.setConf(conf);
  }

  mergeConf(conf1 = {}, conf2 = {}) { // eslint-disable-line class-methods-use-this
    if (conf2.baseURL && !conf2.baseURL.endsWith('/')) {
      conf2.baseURL = `${conf2.baseURL}/`;
    }

    return {
      ...conf1,
      ...conf2,
      headers: {
        ...conf1.headers,
        ...conf2.headers,
      },
    };
  }

  setConf(conf = {}) {
    this.conf = this.mergeConf(this.conf, conf);
  }

  fillUrl(url = '') {
    if (!this.conf.baseURL) {
      return url || window.location.href;
    }

    if (url.startsWith('/')) {
      url = url.substring(1);
    }

    return `${this.conf.baseURL}${url}`;
  }

  invoke(
    method = 'GET',
    url = '',
    data = null,
    conf = {},
  ) {
    if (this.conf && this.conf.requestInterceptor) {
      conf = this.conf.requestInterceptor({ ...conf });
    }

    method = method.toUpperCase();
    url = this.fillUrl(url);
    conf = this.mergeConf(this.conf, conf);

    const xhr = new XMLHttpRequest();
    const sendRequest = () => {
      try {
        if (method === 'GET') {
          xhr.send();
          return;
        }

        if (conf.headers['Content-Type'].startsWith('application/json')) {
          xhr.send(data ? JSON.stringify(data) : '');
          return;
        }

        xhr.send(data ? queryString.stringify(data) : '');
      } catch (e) {
        conf.error(e);
      }
    };

    const getData = () => {
      const resType = xhr.getResponseHeader('Content-Type');
      const result = conf.transformResponse(xhr.responseText);
      let resData = null;
      if (resType === 'application/json' || conf.dataType.toLowerCase() === 'json') {
        try {
          resData = typeof result === 'string' ? JSON.parse(result) : result;
        } catch (e) {
          resData = result;
        }
      } else {
        resData = result;
      }

      if (conf.responseInterceptor) {
        return conf.responseInterceptor({
          data: resData,
          status: xhr.status,
        });
      }

      return resData;
    };

    if (method === 'GET' && data) {
      url = `${url}?${queryString.stringify(data)}`;
    }

    xhr.open(method, url, conf.async);
    xhr.withCredentials = conf.withCredentials;
    // 设置header
    Object.entries(conf.headers).forEach(pair => xhr.setRequestHeader(pair[0], pair[1]));

    if (!conf.async) {
      sendRequest();
      // 成功
      if (conf.validateStatus(xhr.status)) {
        return getData();
      }

      throw { // eslint-disable-line no-throw-literal
        status: xhr.status,
        data: getData(),
      };
    }

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        // 成功
        if (conf.validateStatus(xhr.status)) {
          resolve({
            status: xhr.status,
            data: getData(),
          });
          return;
        }

        reject({ // eslint-disable-line prefer-promise-reject-errors
          xhr,
          error: xhr.responseText,
        });
      };

      try {
        sendRequest();
      } catch (error) {
        reject({ // eslint-disable-line prefer-promise-reject-errors
          xhr,
          error,
        });
      }
    });
  }
}

Ajaxer.create = conf => new Ajaxer(conf);

['get', 'post', 'put', 'head', 'delete'].forEach((method) => {
  Ajaxer.prototype[method] = function (...args) { // eslint-disable-line func-names
    return this.invoke(method.toUpperCase(), ...args);
  };
});

export default Ajaxer;
