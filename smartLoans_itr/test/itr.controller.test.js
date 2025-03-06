
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const itrController = require('../src/controllers/itr.controller');
const { injector } = require('ca-webutils');

describe('itrController', () => {
    let itrServiceStub;
    let getITR;

    beforeEach(() => {
        itrServiceStub = {
            getITR: sinon.stub()
        };
        sinon.stub(injector, 'getService').returns(itrServiceStub);
        getITR = itrController().getITR;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call itrService.getITR with the correct panNumber', async () => {
        const panNumber = 'ABCDE1234F';
        itrServiceStub.getITR.resolves({});

        await getITR({ panNumber });

        expect(itrServiceStub.getITR.calledOnceWith(panNumber)).to.be.true;
    });

    it('should return the result from itrService.getITR', async () => {
        const panNumber = 'ABCDE1234F';
        const expectedResult = { data: 'some data' };
        itrServiceStub.getITR.resolves(expectedResult);

        const result = await getITR({ panNumber });

        expect(result).to.equal(expectedResult);
    });

    it('should throw an error if itrService.getITR throws an error', async () => {
        const panNumber = 'ABCDE1234F';
        const error = new Error('Service error');
        itrServiceStub.getITR.rejects(error);

        try {
            await getITR({ panNumber });
            throw new Error('Test failed');
        } catch (err) {
            expect(err).to.equal(error);
        }
    });
});