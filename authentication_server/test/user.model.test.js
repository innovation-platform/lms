const mongoose = require('mongoose');
const { expect } = require('chai');
const User = require('../src/repositories/mongoose/models/user.model');

describe('User Model Test', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    const validUserData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Test@123",
        roles: ["user"],
        accountNumber: "1234567890",
        phone: "9876543210",
        address: "123 Test Street, City"
    };

    describe('Field Validations', () => {
        describe('Name Validation', () => {
            it('should validate valid name', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject name less than 3 characters', async () => {
                const user = new User({
                    ...validUserData,
                    name: "Jo"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.name).to.exist;
            });

            it('should reject name with numbers', async () => {
                const user = new User({
                    ...validUserData,
                    name: "John123"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.name).to.exist;
            });

            it('should reject name exceeding 50 characters', async () => {
                const user = new User({
                    ...validUserData,
                    name: "a".repeat(51)
                });
                const validationError = user.validateSync();
                expect(validationError.errors.name).to.exist;
            });
        });

        describe('Email Validation', () => {
            it('should validate correct email format', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject invalid email format', async () => {
                const user = new User({
                    ...validUserData,
                    email: "invalid-email"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.email).to.exist;
            });

            it('should convert email to lowercase', async () => {
                const user = new User({
                    ...validUserData,
                    email: "JOHN@EXAMPLE.COM"
                });
                expect(user.email).to.equal("john@example.com");
            });
        });

        describe('Password Validation', () => {
            it('should validate correct password format', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject password without uppercase letter', async () => {
                const user = new User({
                    ...validUserData,
                    password: "test@123"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.password).to.exist;
            });

            it('should reject password without special character', async () => {
                const user = new User({
                    ...validUserData,
                    password: "Test1234"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.password).to.exist;
            });

            it('should reject password less than 8 characters', async () => {
                const user = new User({
                    ...validUserData,
                    password: "Test@12"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.password).to.exist;
            });
        });

        describe('Roles Validation', () => {
            it('should set default role as user', async () => {
                const user = new User({
                    ...validUserData,
                    roles: undefined
                });
                expect(user.roles).to.include("user");
            });

            it('should reject invalid role', async () => {
                const user = new User({
                    ...validUserData,
                    roles: ["invalid"]
                });
                const validationError = user.validateSync();
                expect(validationError.errors['roles.0']).to.exist;
            });

            it('should accept multiple valid roles', async () => {
                const user = new User({
                    ...validUserData,
                    roles: ["user", "banker"]
                });
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });
        });

        describe('OTP Validation', () => {
            it('should allow null OTP', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should validate future OTP expiry', async () => {
                const user = new User({
                    ...validUserData,
                    otpExpiry: new Date(Date.now() + 900000) // 15 minutes from now
                });
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject past OTP expiry', async () => {
                const user = new User({
                    ...validUserData,
                    otpExpiry: new Date(Date.now() - 900000) // 15 minutes ago
                });
                const validationError = user.validateSync();
                expect(validationError.errors.otpExpiry).to.exist;
            });
        });

        describe('Phone Validation', () => {
            it('should validate correct phone number', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject phone number not starting with 6-9', async () => {
                const user = new User({
                    ...validUserData,
                    phone: "1234567890"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.phone).to.exist;
            });

            it('should reject phone number with incorrect length', async () => {
                const user = new User({
                    ...validUserData,
                    phone: "98765"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.phone).to.exist;
            });
        });

        describe('Address Validation', () => {
            it('should validate correct address', async () => {
                const user = new User(validUserData);
                const validationError = user.validateSync();
                expect(validationError).to.be.undefined;
            });

            it('should reject address less than 5 characters', async () => {
                const user = new User({
                    ...validUserData,
                    address: "123"
                });
                const validationError = user.validateSync();
                expect(validationError.errors.address).to.exist;
            });

            it('should reject address exceeding 200 characters', async () => {
                const user = new User({
                    ...validUserData,
                    address: "a".repeat(201)
                });
                const validationError = user.validateSync();
                expect(validationError.errors.address).to.exist;
            });
        });
    });

    describe('Document Creation', () => {
        it('should create & save user successfully', async () => {
            const validUser = new User(validUserData);
            const savedUser = await validUser.save();
            expect(savedUser._id).to.exist;
            expect(savedUser.name).to.equal(validUserData.name);
            expect(savedUser.email).to.equal(validUserData.email);
        });

        it('should fail to save duplicate email', async () => {
            const firstUser = new User(validUserData);
            await firstUser.save();

            const duplicateUser = new User(validUserData);
            try {
                await duplicateUser.save();
                expect.fail('Should not save duplicate email');
            } catch (error) {
                expect(error.code).to.equal(11000); // MongoDB duplicate key error code
            }
        });
    });
});
