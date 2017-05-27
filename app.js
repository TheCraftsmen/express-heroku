var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var path    = require("path");

var mongoose = require('mongoose');
var model = require('./model');

mongoose.connect('mongodb://kairopy:35961626blasm@ds155191.mlab.com:55191/example-kairopy');
mongoose.Promise = global.Promise;

var db = mongoose.connection;
var User = mongoose.model('User', model.userSchema);
var List = mongoose.model('List', model.listSchema);
var Task = mongoose.model('Task', model.taskSchema);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB connected!");
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.get('/',function (req, res){
    //res.sendFile(path.join(__dirname+'/index.html'));
});

// Ruta
app.get('/lists',function (req, res){
    List.find()
    .populate('tasks')
    .exec(function (err, lists) {
      if (err) return console.error(err);
      console.log(lists);
      res.send(lists);
    });
});


app.get('/lists/:id',function (req, res){
    List
    .findOne({_id: req.params.id})
    .populate('tasks')
    .exec(function (err, list) {
      if (err) return console.error(err);
      console.log(list);
      res.send(list)
    });
});

app.post('/lists',function (req, res) {
    var listDB = new List({ title: req.body.title, tasks: [] });
    listDB.save(function (err, list) {
      if (err) return console.error(err);
        console.log("Lista creada!");
        res.send(list._id.toString());
    });
});

app.post('/lists/:id',function (req, res) {
    List.findOne({_id: req.params.id}, function(err, list) {
        var taskDB = new Task({title: req.body.title, completed: false});
        taskDB.save(function (err, task) {
          if (err) return console.error(err);
            console.log("Task creada!");
            list.tasks.push(task);
            list.save(function(err, lst) {
                if (err) return console.error(err);
                console.log("List save!");
                res.send(lst.toString());
            });  
        });
    });
});

app.put("/task/:id",function (req, res){    
    Task.findOne({ _id: req.params.id }, function(err, task) {
        task.title = (req.body.title === undefined) ? task.title : req.body.title
        task.completed = (req.body.completed === undefined) ? task.completed : req.body.completed
       
        task.save(function(err, task) {
            console.log(`task ${req.params.id} modified`);
            res.send();
        });   
    });
});

app.delete("/task/:id",function (req, res){    
    Task.remove({ _id: req.params.id }, function (err) {
      if (err) return console.log(err);
        console.log(`task ${req.params.id} deleted`);
        res.send();
    });
});


app.delete("/lists/:id",function (req, res){    
    List.remove({ _id: req.params.id }, function (err) {
      if (err) return console.log(err);
        console.log(`list ${req.params.id} deleted`);
        res.send();
    });
});

module.exports = app;
