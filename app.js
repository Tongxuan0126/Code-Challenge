const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/interview_challenge',  { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log(err);
		process.exit();
	}
	const db = client.db('transactions');
	console.log('connected to db');
	client.close();

});

app.get('/transactions', (req, res) => {
	res.send("Hello world");
});


app.post('/transactions', (req, res) => {
	res.send("Hello world");
});


app.listen(1984);
console.log('server listening at port 1984');