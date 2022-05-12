const apiRouter = require('express').Router();
const articleRouter = require('./article-router');
const topicRouter = require('./topic-router');
const usersRouter = require('./user-router');
const commentRouter = require('./comment-router');

const { getApi } = require('../controllers/api.controller');

apiRouter.get('/endpoints', getApi);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
