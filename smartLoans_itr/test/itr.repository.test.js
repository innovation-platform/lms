const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const MongooseITRRepository = require('../src/repositories/mongoose/itr.repository');
const { expect } = chai;

// Define NotFoundError directly in the test file
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

describe('MongooseITRRepository', () => {
    let modelMock;
    let repository;

    beforeEach(() => {
        modelMock = {
            findOne: sinon.stub()
        };
        repository = new MongooseITRRepository(modelMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getById', () => {
        it('should return user when found', async () => {
            const email = 'test@example.com';
            const user = { email };
            modelMock.findOne.resolves(user);

            const result = await repository.getById(email);

            expect(result).to.equal(user);
            expect(modelMock.findOne.calledOnceWith({ email })).to.be.true;
        });

        it('should throw NotFoundError when user not found', async () => {
            const email = 'test@example.com';
            modelMock.findOne.resolves(null);

            try {
                await repository.getById(email);
                throw new Error('Expected getById to throw NotFoundError');
            } catch (error) {
                console.log("🔥 Error caught in test:", error);  // ✅ Debugging step

                expect(error).to.be.instanceOf(NotFoundError);
                expect(error.message).to.equal(`User with email ${email} not found`);
            }

            expect(modelMock.findOne.calledOnceWith({ email })).to.be.true;
        });
    });
});
