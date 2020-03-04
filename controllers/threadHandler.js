'use strict';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = process.env.DB;

function ThreadHandler() {
  
  this.threadList = async (req, res) => {
    try{
      const board = req.params.board;
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const db = await client.db('message_board');
      const col = await db.collection(board);  
      //console.log('Successfully connected to database');
      let result = await col.find({}, {'projection': {
        'reported': 0, 
        'delete_password': 0, 
        'replies.reported': 0, 
        'replies.delete_password': 0
      }}).sort({'bumped_on': -1}).limit(10).toArray();
      result.forEach(thread=> {if (thread.replies.length > 3) thread.replies.length.slice(0,3)});
      res.json(result);
    } catch {
      return res.status(400).send("Error retrieving thread list.");
    }
  }

  this.newThread = async (req, res) => {
    try{      
      const board = req.params.board;     
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});         
      const db = await client.db('message_board');
      const col = await db.createCollection(board);  
      //console.log('Successfully connected to database');
      const thread = {
        'text': req.body.text,
        'delete_password': req.body.delete_password,
        'created_on': new Date(),
        'bumped_on': new Date(),
        'reported': false,
        'replies': []
      }
      let result = await col.insertOne(thread);
      res.redirect(`/b/${board}/`);
    } catch {
      return res.status(400).send("Error creating new thread.");
    }
  }
  
  this.reportThread = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.body.report_id;
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const db = await client.db('message_board');
      const col = await db.collection(board);  
      //console.log('Successfully connected to database');
      let result = await col.updateOne({'_id': ObjectId(threadId)}, {'$set': {'reported': true}});
      return (result.value === null) ? res.send('Error reporting thread.') : res.send('Success.');
    } catch {
      return res.status(400).send("Error reporting thread.");
    }
  }
  
  this.deleteThread = async (req, res) => {
    try{
      const board = req.params.board;
      const threadId = req.body.thread_id;
      const pass = req.body.delete_password;
      const client = await MongoClient.connect(url, {useUnifiedTopology: true});     
      const db = await client.db('message_board');
      const col = await db.collection(board);  
      //console.log('Successfully connected to database');
      
      let result = await col.findOneAndDelete({'_id': ObjectId(threadId), 'delete_password': pass});
      //console.log(result);
      return (result.value === null) ? res.send('Incorrect password.') : res.send('Success.');
    } catch {
      return res.status(400).send("Error deleting thread.");
    }
  }
  
  
  
}

module.exports = ThreadHandler;