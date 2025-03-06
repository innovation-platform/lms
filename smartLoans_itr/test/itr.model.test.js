const chai = require('chai');
const mongoose = require('mongoose');
const ITR = require('../src/repositories/mongoose/models/itr.model');

const { expect } = chai;

describe('ITR Model', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await ITR.deleteMany({});
    });

    it('should be invalid if customer_id is empty', (done) => {
        const itr = new ITR();

        itr.validate((err) => {
            expect(err.errors.customer_id).to.exist;
            done();
        });
        done();
    });

    it('should be invalid if annualIncome is empty', (done) => {
        const itr = new ITR({ customer_id: '12345' });

        itr.validate((err) => {
            expect(err.errors.annualIncome).to.exist;
            done();
        });
        done();
    });

    it('should have default status as verified', () => {
        const itr = new ITR({ customer_id: '12345', annualIncome: 50000 });

        expect(itr.status).to.equal('verified');
    });

    it('should save an ITR document', async () => {
        const itr = new ITR({ customer_id: '12345', annualIncome: 50000 });

        const savedItr = await itr.save();
        expect(savedItr).to.have.property('_id');
        expect(savedItr.customer_id).to.equal('12345');
        expect(savedItr.annualIncome).to.equal(50000);
    });

    it('should not allow duplicate customer_id', async () => {
        await new ITR({ customer_id: '12345', annualIncome: 50000 }).save();

        try {
            await new ITR({ customer_id: '12345', annualIncome: 60000 }).save();
            throw new Error('Should not allow duplicate customer_id');
        } catch (error) {
            expect(error).to.exist;
            expect(error.code).to.equal(11000); // MongoDB duplicate key error
        }
    });
});
