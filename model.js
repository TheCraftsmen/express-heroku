var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String
});

var listSchema = Schema({
    title: String,
    tasks: [
    		{
    			type: Schema.Types.ObjectId, 
    			ref: 'Task'
    		}
    	]
});

var taskSchema = Schema({
    title: String,
    completed: Boolean
});

module.exports = {userSchema, listSchema, taskSchema};