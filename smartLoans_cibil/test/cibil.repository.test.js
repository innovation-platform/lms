const { expect } = require("chai");
const sinon = require("sinon");
const { MongooseRepository } = require("ca-webutils");
const MongooseCibilRepository = require("../src/repositories/mongoose/cibil.repository");

describe("MongooseCibilRepository Tests", function () {
    let sandbox;
    let mockModel;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        mockModel = { constructor: { name: "MockModel" } };
        sandbox.spy(console, "log");
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("should extend MongooseRepository", function () {
        const repository = new MongooseCibilRepository(mockModel);
        expect(repository).to.be.instanceOf(MongooseRepository);
    });

    it("should log the model name on instantiation", function () {
        new MongooseCibilRepository(mockModel);
        expect(console.log.calledOnceWith("model", "MockModel")).to.be.true;
    });

    it("should define _dependencies with 'cibil'", function () {
        expect(MongooseCibilRepository._dependencies).to.deep.equal(["cibil"]);
    });
});
