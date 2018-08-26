const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const factor = 0.1;
const bias = 0.05;
app.use(bodyParser.json());

function checkIsRecurring(transaction) {
	//Todo: if is a recurring payment
	//check two names if true check third , if not return false;

	historyTrans = collection.find({name : transaction.name, is_recurring : true });
	lastOne = historyTrans[historyTrans.length - 1];
	if (lastOne.interval  (transaction.date - lastOne.data) *  (1 + factor) &&  lastOne.interval >= (transaction.date - lastOne.data) *  (1 - factor) && lastOne.amount <= transaction.amount * (1 + bias) && lasOne.amount >= transaction.amount * (1 + bias)) {
		return true;
	}else{
		return false;
	}
		
		
	}
	


function calculateInterval(transaction) {
    //assumming all transactions inserted in order
	if(transaction.is_recurring){
		historyTrans = collection.find({ name : transaction.name, is_recurring : true });
		lastOne = historyTrans[historyTrans.length - 1];
			return lastOne.interval;
	}else{
		return null;

			}
		}
	



function calculateNextDate(transaction){
	//Todo: next payment date
	if(transaction.is_recurring){
		return transaction.interval + transaction.date;
	}else{
		return null;
	}
    
}

function calculateNextPayment(transaction){
	if(transaction.is_recurring){
		historyTrans  = collection.find({ name : transaction.name, is_recurring : true });
		lastOne = historyTrans[historyTrans.length - 1];
		return lasOne.next_amt;

	}
}

const GET_RECURRING_TRANS = 'get_recurring_trans';
const UPSERT_TRANSACTIONS = 'upsert_transactions';
app.get('/transactions', (req, res) => {
	const task = req.query.task;
	if(task !== GET_RECURRING_TRANS){
		res.status(404).json({error: 'Unknown task'});
		return;
	}
	MongoClient.connect('mongodb://localhost:27017/interview_challenge',  { useNewUrlParser: true }, (err, client) => {
			const collection = client.db('interview_challenge').collection('transactions');
			collection.find({ is_recurring : true}).toArray((err, results) => {
				//Todo: neet to calculate next payment data
				res.json({ recurring_trans : results });
			});
		}
	);

});



app.post('/transactions', (req, res) => {
	const originalTransaction = req.body;
	if(originalTransaction.task !== UPSERT_TRANSACTIONS) {
		res.status(404).json({error : 'Unknown task'});
		return;
	}
	const transaction = Object.assign({}, originalTransaction, 
	{
	 is_recurring: checkIsRecurring(originalTransaction),
	 interval: calculateInterval(originalTransaction),
	 next_date: calculateNextDate(originalTransaction),
	 next_amt: 0
	 });
	MongoClient.connect('mongodb://localhost:27017/interview_challenge',  { useNewUrlParser: true }, (err, client) => {
		if (err) {
			console.log(err);
			process.exit();
		}
		const collection = client.db('interview_challenge').collection('transactions');
		collection.insert(transaction);
		res.json({ recurring_trans : [transaction]});
		client.close();
	    
	});
});
	

app.listen(1984);
console.log('server listening at port 1984');

module.exports = app;