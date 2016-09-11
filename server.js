import path from 'path';
import express from 'express';
import {router} from './routes/conversation';

let app = express();

let staticPath = path.join(__dirname, '/dist');
app.use(express.static(staticPath));

app.use('/conversation', router);

app.listen(3000, () => {
	
	console.log('laser is listening');
});
