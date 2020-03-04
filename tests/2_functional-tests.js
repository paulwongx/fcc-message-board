/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let threadId1, threadId2, threadId3;
  let pass1 = 'pass1';
  let replyId;
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Test POST - /api/threads/[board] - Create New Thread', function(done) {   
      chai.request(server)
        .post('/api/threads/fcc')
        .send({'text': 'hello', 'delete_password': pass1})
        .end(function(err, res){
           assert.equal(res.status, 200);
           /*
           assert.typeOf(res.body, 'Object');
           assert.property(res.body, '_id');
           assert.property(res.body, 'text');
           assert.property(res.body, 'created_on');
           assert.property(res.body, 'bumped_on');
           assert.property(res.body, 'reported');
           assert.property(res.body, 'delete_password');
           assert.property(res.body, 'replies');
           assert.typeOf(res.body._id, 'String');
           assert.equal(res.body.text, 'hello');
           assert.typeOf(res.body.created_on, 'String');
           assert.typeOf(res.body.bumped_on, 'String');
           assert.typeOf(res.body.reported, 'Boolean');
           assert.equal(res.body.delete_password, pass1);
           assert.isArray(res.body.replies);          
           */
           done();
        });
      });
      
      test('Test POST - /api/threads/[board] - Create Second New Thread', function(done) {   
      chai.request(server)
        .post('/api/threads/fcc')
        .send({'text': 'hello', 'delete_password': pass1})
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.typeOf(res.body, 'Object');       
           done();
        });
      });
      
    });
    
    suite('GET', function() {
      test('Test GET - /api/threads/[board] - Get 10 Threads, 3 Replies Each', function(done) {  
      chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body);
           assert.isBelow(res.body.length, 11);
           assert.property(res.body[0], '_id');
           assert.property(res.body[0], 'text');
           assert.property(res.body[0], 'created_on');
           assert.property(res.body[0], 'bumped_on');
           assert.notProperty(res.body[0], 'reported');
           assert.notProperty(res.body[0], 'delete_password');
           assert.property(res.body[0], 'replies');
           assert.typeOf(res.body[0]._id, 'String');
           assert.typeOf(res.body[0].text, 'String');
           assert.typeOf(res.body[0].created_on, 'String');
           assert.typeOf(res.body[0].bumped_on, 'String');
           assert.isArray(res.body[0].replies); 
           assert.isBelow(res.body[0].replies.length, 4);
           threadId1 = res.body[0]._id;
           threadId2 = res.body[1]._id;
           done();
        });
      });
    });
    
    suite('DELETE', function() {
      
      test('Test DELETE - /api/threads/[board] - Incorrect Password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({'thread_id': threadId1, 'delete_password': 'abc123'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Incorrect password.');
          done();
        });  
      });
     
       test('Test DELETE - /api/threads/[board] - Successful Deletion', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({'thread_id': threadId1, 'delete_password': pass1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Success.');
          done();
        });  
      });
      
    });
    
    suite('PUT', function() {
      test('Test PUT - /api/thread/[board] - Report a Thread', function(done) { 
        chai.request(server)
        .put('/api/threads/fcc')
        .send({'report_id': threadId2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Success.');
          done();
        });  
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Test POST - /api/replies/[board] - Create New Thread Reply', function(done) {    
      chai.request(server)
        .post('/api/replies/fcc')
        .send({'text': 'test reply', 'delete_password': pass1, 'thread_id': threadId2})
        .end(function(err, res){
           assert.equal(res.status, 200);
           /*
           assert.typeOf(res.body, 'Object');
           assert.property(res.body.replies, '_id');
           assert.property(res.body.replies, 'text');
           assert.property(res.body.replies, 'created_on');
           assert.property(res.body.replies, 'bumped_on');
           assert.property(res.body.replies, 'reported');
           assert.property(res.body.replies, 'delete_password');
           assert.equal(res.body.replies._id, 'testThreadId');
           assert.equal(res.body.replies.text, 'test reply');
           assert.typeOf(res.body.replies.reported, 'Boolean');
           assert.equal(res.body.replies.delete_password, pass1);
           assert.isArray(res.body.replies);     
           */
           done();
        });
      });
    });
    
    suite('GET', function() {
      test('Test GET - /api/replies/[board] - Get All Thread Replies', function(done) {    
      chai.request(server)
        .get('/api/replies/fcc')
        .query({'thread_id': threadId2})
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.typeOf(res.body, 'Object');
           assert.property(res.body, '_id');
           assert.property(res.body, 'text');
           assert.property(res.body, 'created_on');
           assert.property(res.body, 'bumped_on');
           assert.notProperty(res.body, 'reported');
           assert.notProperty(res.body, 'delete_password');
           assert.property(res.body, 'replies');
           assert.isArray(res.body.replies);   
           assert.equal(res.body.replies[res.body.replies.length-1].text, 'test reply');
           replyId = res.body.replies[res.body.replies.length-1]._id;
           done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Test PUT - /api/replies/[board] - Report a Reply', function(done) { 
        chai.request(server)
        .put('/api/replies/fcc')
        .send({'thread_id': threadId2, 'reply_id': replyId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Success.');
          done();
        });  
      });
    });
    
    suite('DELETE', function() {
      
    test('Test DELETE - /api/replies/[board] - Incorrect Password when deleting post', function(done) { 
      chai.request(server)
        .delete('/api/replies/fcc')
        .send({'delete_password': 'wrongPassword', 'thread_id': threadId2, 'reply_id': replyId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Incorrect password.');
          done();
        });    
      });
    
    
      test('Test DELETE - /api/replies/[board] - Successfully delete a post ', function(done) { 
        chai.request(server)
        .delete('/api/replies/fcc')
        .send({'delete_password': pass1, 'thread_id': threadId2, 'reply_id': replyId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Success.');
          done();
        });  
      });

      
      
      
    }); // Delete Suite
    
  }); // Replies Routing

});