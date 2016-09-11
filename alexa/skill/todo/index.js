'use strict';

var Alexa = require('alexa-sdk');

var APP_NAME = 'Meazy Tasks';
var TASKS = '_TASKSMODE';

exports.handler = function (event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(startHandlers, taskHandler);
	alexa.execute();
};

function initializeState() {
	if (!this.attributes.tasks) {
		var speechOutput = 'Hey, Welcome to ' + APP_NAME + '. You can add new tasks, complete them, and list them.';
		var repromptText = 'Would you like to add a new task, complete a task, or list tasks?';
		this.attributes.tasks = ['Hello world'];
		this.attributes.completed = [];
		this.attributes.endedSessionCount = 0;
		this.handler.state = TASKS;
		this.emit(':ask', speechOutput, repromptText);
	}
	this.handler.state = TASKS;
	this.emit(':ask', 'lets go!', 'lets go!');
}

var taskHandler = Alexa.CreateStateHandler(TASKS, {
	'AddTaskIntent': function () {
		var intent = this.event.request.intent;
		var taskValid = intent && intent.slots && intent.slots.TaskDesc && intent.slots.TaskDesc.value;
		if (!taskValid) {
			this.emit(':ask', 'Can you say that again?');
		} else {
			var task = intent.slots.TaskDesc.value;
			this.attributes.tasks.push(task);
			var speech = 'Adding a new task: ' + task;
			this.emit(':ask', speech, speech);
		}
	},
	'CompleteTaskIntent': function () {
		var intent = this.event.request.intent;
		var taskNumberValid = intent && intent.slots && intent.slots.TaskNumber && intent.slots.TaskNumber.value;
		if (!taskNumberValid) {
			var invalidSpeech = 'Can you say that again?';
			this.emit(':ask', invalidSpeech, invalidSpeech);
			return;
		}
		var taskNumber = intent.slots.TaskNumber.value;
		var speech = 'Completing task: ' + taskNumber + ' ' + this.attributes.tasks[taskNumber - 1];
		var completed = this.attributes.tasks.splice(taskNumber - 1, 1);
		this.attributes.completed = this.attributes.completed.concat(completed);
		this.emit(':ask', speech, speech);
	},
	'ListTasksIntent': function () {
		var tasks = this.attributes.tasks;
		var taskList = tasks.map(function (task, index) {
			return (index + 1) + ' ' + task;
		}).join(', ');
		this.emit(':ask', 'The tasks are: ' + taskList);
	},
	'ListCompletedTasksIntent': function () {
		var tasks = this.attributes.completed;
		this.emit(':ask', 'The completed tasks are: ' + tasks.map(function (task, index) {
				return (index + 1) + ' ' + task;
			}).join(', '));
	},
	'AMAZON.RepeatIntent': function () {
		this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptText']);
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':ask', 'Ok, lets get shit done!', 'Ok, lets get shit done!');
	},
	'AMAZON.StartOverIntent': function () {
		this.emit(':saveState', true);
	},
	'SessionEndedRequest': function () {
		console.log('session ended!');
		this.attributes['endedSessionCount'] += 1;
		this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
	},
	'Unhandled': function () {
		var speechOutput = 'Try saying "add task", "complete task", or "list"';
		this.emit(':ask', speechOutput, speechOutput);
	},
});

var startHandlers = {
	'LaunchRequest': function () {
		this.emit('HelloWorldIntent');
	},
	'AMAZON.StartOverIntent': function () {
		initializeState.call(this);
	},
	'NewSession': function () {
		initializeState.call(this);
	},
	'Unhandled': function () {
		var speechOutput = 'Lets start over';
		this.emit(':ask', speechOutput, speechOutput);
	},
	'SessionEndedRequest': function () {
		console.log('session ended!');
		this.attributes['endedSessionCount'] += 1;
		this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
	}
};

