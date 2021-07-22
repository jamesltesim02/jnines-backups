'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.security = {
    domainWhiteList: ['http://localhost:8080'],
    methodnoallow: {
      enable: false,
    },
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
      headerName: 'x-csrf-token',
      ignoreJSON: false,
    },
  },

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1518857372592_1005';

  // add your config here
  config.middleware = [];

  config.mongoose = {
    url: 'mongodb://127.0.0.1/kuaisaoa',
    options: {}
  };

  return config;
};

