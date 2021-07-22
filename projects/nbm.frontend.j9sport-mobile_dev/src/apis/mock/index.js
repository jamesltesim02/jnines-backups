import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// import user from './user';
// import match from './match';
// import right from './right';
// import activity from './activity';

const mock = new MockAdapter(axios, { delayResponse: 1500 });
const records = window.__MOCK_RECORDS__ = {};

function addMock (instance) {
  const keys = Object.getOwnPropertyNames(instance);

  records[instance.name] = instance.records;

  keys.forEach(key => {
    if (typeof instance[key] !== 'function') {
      return
    }

    const spitIndex = key.indexOf('_');
    const [method, subPath] = [
      key.substring(0, spitIndex),
      key.substring(spitIndex + 1)
    ];

    const eventName = `on${method.charAt(0).toUpperCase()}${method.substring(1).toLowerCase()}`;
    const fullPath = [
      '',
      instance.name,
      subPath
    ].map(p => p.replace(/^\//, '')).join('/');

    mock[eventName](fullPath).reply(
      config => {
        const requestUrl = config.baseURL + config.url;
        const urlParams = new URL(requestUrl).searchParams.entries();
        let searchParams = {};
        for (const [key, value] of urlParams) {
          searchParams[key] = value;
        }

        let requestData = {};

        if (
          config.data
          &&
          config.data.constructor === FormData
        ) {
          requestData = config.data;
          Object.assign(
            requestData,
            config.params,
            searchParams
          )
        } else {
          Object.assign(
            requestData,
            (
              typeof config.data === 'string'
              ? JSON.parse(config.data)
              : config.data
            ),
            config.params,
            searchParams
          )
        }

        console.log('');
        console.log(`mock [${method}]:`, requestUrl);
        console.log('headers:', config.headers);
        console.log('request data:', requestData);

        let result = instance[key](requestData, config.headers, config);

        result = (
          (
            Array.isArray(result)
            &&
            [200, 401, 403, 404, 500, 503].includes(result[0])
          ) ? result : [200, result]
        )

        console.log('result:', result);

        return result;
      }
    );
  });
}

function init (...instances) {
  instances.forEach(addMock);
  mock.onAny().passThrough();
}

export default function Mock() {
  init(
    // user,
    // match
    // right,
    // activity
  )
}
