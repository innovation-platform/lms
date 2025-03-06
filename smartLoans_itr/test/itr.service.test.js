
const chai = require('chai');
const sinon = require('sinon');
const { ValidationError } = require("ca-webutils/errors");
const ITRService = require('../src/services/itr.service');
const expect = chai.expect;

describe('ITRService', () => {
    let itrRepositoryMock, itrService;

    beforeEach(() => {
        itrRepositoryMock = {
            findOne: sinon.stub()
        };
        itrService = new ITRService(itrRepositoryMock);
    });

    describe('getITR', () => {
        it('should throw ValidationError if panNumber is not provided', async () => {
            try {
                await itrService.getITR();
            } catch (error) {
                expect(error).to.be.instanceOf(ValidationError);
                expect(error.message).to.equal('Pan Number is required');
            }
        });

        it('should call itrRepository.findOne with the correct panNumber', async () => {
            const panNumber = 'ABCDE1234F';
            itrRepositoryMock.findOne.resolves({ panNumber });

            const result = await itrService.getITR(panNumber);

            expect(itrRepositoryMock.findOne.calledOnceWith({ panNumber })).to.be.true;
            expect(result).to.deep.equal({ panNumber });
        });

        it('should return the correct data from itrRepository', async () => {
            const panNumber = 'ABCDE1234F';
            const itrData = { panNumber, data: 'some data' };
            itrRepositoryMock.findOne.resolves(itrData);

            const result = await itrService.getITR(panNumber);

            expect(result).to.deep.equal(itrData);
        });
    });
});