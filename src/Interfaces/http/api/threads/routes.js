const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.createThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
