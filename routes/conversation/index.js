import watson from 'watson-developer-cloud'
import express from 'express'

const router = express.Router({mergeParams: true});
const config = require('../../config/settings.json');

const conversation = new watson.conversation({
	...config.watson.credentials,
	version: 'v1',
	version_date: '2016-07-11'
});

let context = {};

const texts = [
	"Shall I email the notes",
	"Create a JIRA ticket",
	"Send the agenda"
];
let index = 0;

router.use('/', (req, res) => {
	conversation.message({
		workspace_id: '3ab3f1c9-922b-4b7f-9e42-9fa6a7986195',
		input: {'text': texts[index]},
		context: context
	},  function(err, response) {
		if (err) {
			res.json(err);
		}
		else {
			context = {
				...response.context
			};
			res.json(response);
			index++;
			index = index >= texts.length ? 0 : index;
		}
	});
});

export {router};