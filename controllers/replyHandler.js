'use strict';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = process.env.DB;

function ReplyHandler() {
  
  this.replyList = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.query.thread_id;
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const col = await client.db('message_board').collection(board);
      //console.log(`Thread Id: ${threadId}`);
      let result = await col.findOne({'_id': ObjectId(threadId)}, {'projection': {
        'reported': 0, 
        'delete_password': 0//, 
        //'replies.reported': 0, 
        //'replies.delete_password': 0
      }});
      res.json(result);
    } catch {
      return res.status(400).send("Error retrieving reply list.");
    }
  }

  this.newReply = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.body.thread_id;
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const col = await client.db('message_board').collection(board);
      const reply = {
        '_id': new ObjectId(),
        'text': req.body.text,
        'delete_password': req.body.delete_password,
        'created_on': new Date(),
        'reported': false
      }
      let result = await col.findOneAndUpdate({'_id': ObjectId(threadId)}, {'$push': {'replies': reply}, '$set': {'bumped_on': new Date()}}, {'returnOriginal': false});
      res.redirect(`/b/${board}/${threadId}`);
    } catch {
      return res.status(400).send("Error replying to thread.");
    }
  }
  
  this.reportReply = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.body.thread_id;
      const replyId = req.body.reply_id;
      //console.log(`ThreadId: ${threadId}, ReplyId: ${replyId}`);
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const col = await client.db('message_board').collection(board);
      let result = await col.updateOne({'_id': ObjectId(threadId), 'replies._id': ObjectId(replyId)}, {'$set': {'replies.$.reported': true}});
      //console.log("Result nModified: "+result.result.nModified); //Error check doesn't work if wrong Id
      (result.result.nModified === 1) ? res.send('Success.') : res.send('Error reporting reply.');      
    } catch {
      return res.status(400).send("Error reporting thread.");
    }
  }
  
  this.deleteReply = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.body.thread_id;
      const replyId = req.body.reply_id;
      const pass = req.body.delete_password;
      //console.log(`ThreadId: ${threadId}, ReplyId: ${replyId}, Pass: ${pass}`);
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const col = await client.db('message_board').collection(board);
      let result = await col.findOneAndUpdate({'_id': ObjectId(threadId), 'replies._id': ObjectId(replyId), 'replies.delete_password': pass}, {'$set': {'replies.$.text': '[deleted]'}});
      //console.log(result);
      (result.value === null) ? res.send('Incorrect password.') : res.send('Success.');
    } catch {
      return res.status(400).send("Error deleting reply.");
    }
  }  
  
}


module.exports = ReplyHandler;