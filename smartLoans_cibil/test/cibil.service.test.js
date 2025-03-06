const { expect } = require("chai");
const sinon = require("sinon");
const CibilService = require("../src/services/cibil.service");

describe("Cibil Service Tests", function () {
  let sandbox;
  let mockCibilRepository;
  let cibilService;

  beforeEach(function () {
    sandbox = sinon.createSandbox();

    // Mock the Cibil Repository
    mockCibilRepository = {
      findOne: sandbox.stub(),
      update: sandbox.stub(),
    };

    // Initialize the Cibil Service
    cibilService = new CibilService(mockCibilRepository);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("getCibilScore", function () {
    it("should return CIBIL data for a valid PAN number", async function () {
      const panNumber = "ABCDE1234F";
      const expectedCibilData = { panNumber, score: 750 };

      mockCibilRepository.findOne.resolves(expectedCibilData);

      const result = await cibilService.getCibilScore(panNumber);

      expect(mockCibilRepository.findOne.calledOnceWith({ panNumber })).to.be.true;
      expect(result).to.deep.equal(expectedCibilData);
    });

    it("should throw a ValidationError if PAN number is missing", async function () {
      try {
        await cibilService.getCibilScore(null);
      } catch (err) {
        expect(err.message).to.equal("Missing PAN Number");
      }
    });
  });

  describe("updateCibilScore", function () {
    it("should throw a ValidationError if PAN number is missing", async function () {
      try {
        await cibilService.updateCibilScore({ daysLate: 10 });
      } catch (err) {
        expect(err.message).to.equal("Missing PAN Number");
      }
    });

    it("should throw a ValidationError if daysLate is missing", async function () {
      try {
        await cibilService.updateCibilScore({ panNumber: "ABCDE1234F" });
      } catch (err) {
        expect(err.message).to.equal("Missing days late");
      }
    });

    it("should throw a NotFoundError if CIBIL data does not exist", async function () {
      mockCibilRepository.findOne.resolves(null);

      try {
        await cibilService.updateCibilScore({ panNumber: "INVALIDPAN", daysLate: 10 });
      } catch (err) {
        expect(err.message).to.equal("CIBIL data not found");
      }
    });

    it("should deduct 10 points if daysLate is between 1 and 30", async function () {
      const panNumber = "ABCDE1234F";
      const daysLate = 10;
      const cibilData = { panNumber, score: 750 };

      mockCibilRepository.findOne.resolves(cibilData);
      mockCibilRepository.update.resolves();

      const updatedData = await cibilService.updateCibilScore({ panNumber, daysLate });

      expect(mockCibilRepository.findOne.calledOnceWith({ panNumber })).to.be.true;
      expect(mockCibilRepository.update.calledOnceWith({ panNumber }, sinon.match({ score: 740 }))).to.be.true;
      expect(updatedData.score).to.equal(740);
    });

    it("should deduct 20 points if daysLate is between 31 and 60", async function () {
      const panNumber = "ABCDE1234F";
      const daysLate = 45;
      const cibilData = { panNumber, score: 750 };

      mockCibilRepository.findOne.resolves(cibilData);
      mockCibilRepository.update.resolves();

      const updatedData = await cibilService.updateCibilScore({ panNumber, daysLate });

      expect(mockCibilRepository.findOne.calledOnceWith({ panNumber })).to.be.true;
      expect(mockCibilRepository.update.calledOnceWith({ panNumber }, sinon.match({ score: 730 }))).to.be.true;
      expect(updatedData.score).to.equal(730);
    });

    it("should deduct 50 points if daysLate is greater than 60", async function () {
      const panNumber = "ABCDE1234F";
      const daysLate = 70; // Case for > 60 days
      const cibilData = { panNumber, score: 750 };

      mockCibilRepository.findOne.resolves(cibilData);
      mockCibilRepository.update.resolves();

      const updatedData = await cibilService.updateCibilScore({ panNumber, daysLate });

      expect(mockCibilRepository.findOne.calledOnceWith({ panNumber })).to.be.true;
      expect(mockCibilRepository.update.calledOnceWith({ panNumber }, sinon.match({ score: 700 }))).to.be.true;
      expect(updatedData.score).to.equal(700);
    });
  });
});
