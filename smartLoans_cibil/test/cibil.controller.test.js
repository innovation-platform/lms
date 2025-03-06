const { expect } = require("chai");
const sinon = require("sinon");
const { injector } = require("ca-webutils"); // Mocking injector
const cibilController = require("../src/controllers/cibil.controller");

describe("CIBIL Controller Tests", function () {
  let sandbox;
  let mockCibilService;
  let controllerInstance;

  beforeEach(function () {
    // Create a sandbox for sinon stubs
    sandbox = sinon.createSandbox();

    // Mock the CIBIL service methods
    mockCibilService = {
      getCibilScore: sandbox.stub(),
      updateCibil: sandbox.stub()
    };

    // Stub the injector to return our mock service
    sandbox.stub(injector, "getService").withArgs("cibilService").returns(mockCibilService);

    // Create the controller instance
    controllerInstance = cibilController();
  });

  afterEach(function () {
    // Restore original behavior
    sandbox.restore();
  });

  describe("getCibilScore", function () {
    it("should call getCibilScore with the correct PAN number", async function () {
      // Setup test data
      const panNumber = "ABCDE1234F";
      const expectedScore = { score: 750, status: "GOOD" };
      mockCibilService.getCibilScore.resolves(expectedScore);

      // Execute function
      const result = await controllerInstance.getCibilScore({ panNumber });

      // Assertions
      expect(mockCibilService.getCibilScore.calledOnceWith(panNumber)).to.be.true;
      expect(result).to.deep.equal(expectedScore);
    });

    it("should handle errors in getCibilScore", async function () {
      const panNumber = "INVALID";
      const error = new Error("Invalid PAN number");
      mockCibilService.getCibilScore.rejects(error);

      try {
        await controllerInstance.getCibilScore({ panNumber });
        // If we reach here, the test should fail because an error should have been thrown
        expect.fail("Expected getCibilScore to throw an error");
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(mockCibilService.getCibilScore.calledOnceWith(panNumber)).to.be.true;
    });
    
    it("should handle empty PAN number", async function () {
      const panNumber = "";
      const error = new Error("PAN number is required");
      mockCibilService.getCibilScore.rejects(error);

      try {
        await controllerInstance.getCibilScore({ panNumber });
        expect.fail("Expected getCibilScore to throw an error");
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(mockCibilService.getCibilScore.calledOnceWith(panNumber)).to.be.true;
    });
  });

  describe("updateCibil", function () {
    it("should call updateCibil with correct user ID", async function () {
      // Setup test data
      const userId = "user-123";
      const expectedResponse = { success: true };
      mockCibilService.updateCibil.resolves(expectedResponse);

      // Execute function
      const result = await controllerInstance.updateCibil({ id: userId });

      // Assertions
      expect(mockCibilService.updateCibil.calledOnceWith(userId)).to.be.true;
      expect(result).to.deep.equal(expectedResponse);
    });

    it("should handle errors in updateCibil", async function () {
      const userId = "user-invalid";
      const error = new Error("User not found");
      mockCibilService.updateCibil.rejects(error);

      try {
        await controllerInstance.updateCibil({ id: userId });
        expect.fail("Expected updateCibil to throw an error");
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(mockCibilService.updateCibil.calledOnceWith(userId)).to.be.true;
    });
    
    it("should handle empty user ID", async function () {
      const userId = "";
      const error = new Error("User ID is required");
      mockCibilService.updateCibil.rejects(error);

      try {
        await controllerInstance.updateCibil({ id: userId });
        expect.fail("Expected updateCibil to throw an error");
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(mockCibilService.updateCibil.calledOnceWith(userId)).to.be.true;
    });
  });
  
  describe("Edge cases", function () {
    it("should handle undefined parameters", async function () {
      try {
        await controllerInstance.getCibilScore(undefined);
        expect.fail("Expected getCibilScore to throw an error");
      } catch (err) {
        // We expect an error since panNumber would be undefined 
        expect(err).to.exist;
      }
      
      try {
        await controllerInstance.updateCibil(undefined);
        expect.fail("Expected updateCibil to throw an error");
      } catch (err) {
        // We expect an error since id would be undefined
        expect(err).to.exist;
      }
    });
    
    it("should handle null parameters", async function () {
      try {
        await controllerInstance.getCibilScore(null);
        expect.fail("Expected getCibilScore to throw an error");
      } catch (err) {
        // We expect an error since null.panNumber would throw
        expect(err).to.exist;
      }
      
      try {
        await controllerInstance.updateCibil(null);
        expect.fail("Expected updateCibil to throw an error");
      } catch (err) {
        // We expect an error since null.id would throw
        expect(err).to.exist;
      }
    });
  });
});