/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const ThreadHandler = require('../controllers/threadHandler.js');
const ReplyHandler = require('../controllers/replyHandler.js');

module.exports = function (app) {
  
  const threadHandler = new ThreadHandler();
  const replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board')
    .post(threadHandler.newThread)
    .get(threadHandler.threadList)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread);
  
  app.route('/api/replies/:board')
    .post(replyHandler.newReply)
    .get(replyHandler.replyList)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply);

};
