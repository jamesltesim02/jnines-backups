'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/user/create', controller.user.create);
  router.post('/user/login', controller.user.login);
};
