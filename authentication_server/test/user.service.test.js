const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } = require('ca-webutils/errors');
const UserService = require('../src/services/user.service');

describe('UserService Tests', () => {
    let userService;
    let userRepositoryMock;
    let mockUser;
    let transporter;

    beforeEach(() => {
        // Create mock user repository
        userRepositoryMock = {
            getAll: sinon.stub(),
            findOne: sinon.stub(),
            create: sinon.stub(),
            getById: sinon.stub(),
            update: sinon.stub()
        };

        // Create mock user
        mockUser = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword123',
            roles: ['user'],
            active: true,
            accountNumber: '1234567890',
            phone: '9876543210',
            address: '123 Test St',
            save: sinon.stub().resolves()
        };

        // Mock bcrypt
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword123');
        sinon.stub(bcrypt, 'compare');

        // Mock nodemailer
        transporter = {
            sendMail: sinon.stub().resolves()
        };
        sinon.stub(nodemailer, 'createTransport').returns(transporter);

        userService = new UserService(userRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [mockUser];
            userRepositoryMock.getAll.resolves(mockUsers);

            const result = await userService.getAllUsers();
            expect(result).to.be.an('array');
            expect(result[0]).to.have.property('name', mockUser.name);
        });
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Test@123'
            };

            userRepositoryMock.findOne.resolves(null); // No existing user
            userRepositoryMock.create.resolves(mockUser);

            const result = await userService.register(userData);
            expect(result).to.have.property('name', userData.name);
            expect(bcrypt.hash.calledOnce).to.be.true;
        });

        it('should generate unique account number', async () => {
            userRepositoryMock.findOne
                .onFirstCall().resolves(mockUser)
                .onSecondCall().resolves(null);

            const accountNumber = await userService._generateUniqueAccountNumber();
            expect(accountNumber).to.be.a('string');
            expect(accountNumber).to.have.lengthOf(10);
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            userRepositoryMock.findOne.resolves(mockUser);
            bcrypt.compare.resolves(true);

            const result = await userService.login({
                email: 'john@example.com',
                password: 'Test@123'
            });

            expect(result).to.have.property('name', mockUser.name);
        });

        it('should throw AuthenticationError for invalid email', async () => {
            userRepositoryMock.findOne.resolves(null);

            try {
                await userService.login({
                    email: 'wrong@example.com',
                    password: 'Test@123'
                });
                expect.fail('Should throw AuthenticationError');
            } catch (error) {
                expect(error).to.be.instanceOf(AuthenticationError);
            }
        });

        it('should throw AuthenticationError for invalid password', async () => {
            userRepositoryMock.findOne.resolves(mockUser);
            bcrypt.compare.resolves(false);

            try {
                await userService.login({
                    email: 'john@example.com',
                    password: 'WrongPassword'
                });
                expect.fail('Should throw AuthenticationError');
            } catch (error) {
                expect(error).to.be.instanceOf(AuthenticationError);
            }
        });

        it('should throw AuthorizationError for inactive user', async () => {
            const inactiveUser = { ...mockUser, active: false };
            userRepositoryMock.findOne.resolves(inactiveUser);
            bcrypt.compare.resolves(true);

            try {
                await userService.login({
                    email: 'john@example.com',
                    password: 'Test@123'
                });
                expect.fail('Should throw AuthorizationError');
            } catch (error) {
                expect(error).to.be.instanceOf(AuthorizationError);
            }
        });
    });

    describe('Password Management', () => {
        describe('changePassword', () => {
            it('should change password successfully', async () => {
                userRepositoryMock.getById.resolves(mockUser);
                bcrypt.compare.resolves(true);

                await userService.changePassword({
                    email: 'john@example.com',
                    currentPassword: 'OldPass@123',
                    newPassword: 'NewPass@123'
                });

                expect(userRepositoryMock.update.calledOnce).to.be.true;
            });

            it('should throw ValidationError for invalid current password', async () => {
                userRepositoryMock.getById.resolves(mockUser);
                bcrypt.compare.resolves(false);

                try {
                    await userService.changePassword({
                        email: 'john@example.com',
                        currentPassword: 'WrongPass',
                        newPassword: 'NewPass@123'
                    });
                    expect.fail('Should throw ValidationError');
                } catch (error) {
                    expect(error).to.be.instanceOf(ValidationError);
                }
            });
        });

        describe('forgotPassword', () => {
            it('should handle forgot password request successfully', async () => {
                userRepositoryMock.findOne.resolves(mockUser);

                const result = await userService.forgotPassword({
                    email: 'john@example.com'
                });

                expect(result).to.have.property('message').that.includes('OTP sent successfully');
                expect(mockUser.save.calledOnce).to.be.true;
            });

            it('should throw error for non-existent email', async () => {
                userRepositoryMock.findOne.resolves(null);

                try {
                    await userService.forgotPassword({
                        email: 'nonexistent@example.com'
                    });
                    expect.fail('Should throw error');
                } catch (error) {
                    expect(error.message).to.include('Email not found');
                }
            });
        });

        describe('validateOtp', () => {
            it('should validate OTP successfully', async () => {
                const user = {
                    ...mockUser,
                    otp: 'hashedOtp',
                    otpExpiry: new Date(Date.now() + 900000) // 15 minutes from now
                };
                userRepositoryMock.findOne.resolves(user);
                bcrypt.compare.resolves(true);

                const result = await userService.validateOtp({
                    email: 'john@example.com',
                    enteredOtp: '123456'
                });

                expect(result.message).to.include('OTP verified successfully');
            });

            it('should throw error for expired OTP', async () => {
                const user = {
                    ...mockUser,
                    otp: 'hashedOtp',
                    otpExpiry: new Date(Date.now() - 900000) // 15 minutes ago
                };
                userRepositoryMock.findOne.resolves(user);

                try {
                    await userService.validateOtp({
                        email: 'john@example.com',
                        enteredOtp: '123456'
                    });
                    expect.fail('Should throw error');
                } catch (error) {
                    expect(error.message).to.include('OTP has expired');
                }
            });
        });
    });

    describe('Profile Management', () => {
        it('should update profile successfully', async () => {
            userRepositoryMock.findOne.resolves(mockUser);

            const result = await userService.updateProfile({
                name: 'John Updated',
                email: 'john@example.com',
                accountNumber: '1234567890',
                phone: '9876543211',
                address: '456 New St'
            });

            expect(result).to.have.property('name', 'John Updated');
            expect(mockUser.save.calledOnce).to.be.true;
        });

        it('should throw NotFoundError for non-existent user', async () => {
            userRepositoryMock.findOne.resolves(null);

            try {
                await userService.updateProfile({
                    name: 'John Updated',
                    email: 'nonexistent@example.com',
                    accountNumber: '1234567890'
                });
                expect.fail('Should throw NotFoundError');
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
