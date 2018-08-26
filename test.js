const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Transactions', () => {
	it('it should GET fail with unknown task', (done) => {
		chai
		.request(server)
		.get('/transactions?task=task')
		.end((err, res) => {
			expect(res).to.have.status(404);
			expect(res.body).to.have.property('error');
			done();
		});
	});
		


	it('it should GET all the transactions', (done) => {
		chai
		.request(server)
		.get('/transactions?task=get_recurring_trans')
		.end((err, res) => {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('recurring_trans');
			expect(res.body.recurring_trans).to.be.an('array');
			done();
		});
		

	});

	it('it should insert a transaction', (done) => {
		const testTransaction = {
			transactions: [
			{
				trans_id: 1,
				user_id: 1,
				name: 'T-mobile',
				amount: 50,
				date: new Date('2018-08-24')

			}
		],
		task: 'upsert_transactions'
	};
		
		chai
		.request(server)
		.post('/transactions')
		.send (testTransaction)
		.end((err, res) => {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('recurring_trans');
			expect(res.body.recurring_trans).to.be.an('array');
			done();
		});

	})
});