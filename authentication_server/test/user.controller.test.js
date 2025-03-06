const { expect } = require('chai');
const sinon = require('sinon');
const { injector } = require('ca-webutils');
const { AuthenticationError } = require('ca-webutils/errors');
const fs = require('fs');
const path = require('path');
const userController = require('../src/controllers/user.controller');

describe('User Controller Tests', () => {
    let controller;
    let userServiceMock;
    let jwtServiceMock;
    let mockUser;

    beforeEach(() => {
        // Create mock user
        mockUser = {
            name: 'John Doe',
            email: 'john@example.com',
            roles: ['user'],
            active: true,
            accountNumber: '1234567890',
            phone: '9876543210',
            address: '123 Test St'
        };

        // Create mock services
        userServiceMock = {
            getAllUsers: sinon.stub(),
            register: sinon.stub(),
            login: sinon.stub(),
            activateUser: sinon.stub(),
            deactivateUser: sinon.stub(),
            addUserToRole: sinon.stub(),
            validateOtp: sinon.stub(),
            resetPassword: sinon.stub(),
            resetOtp: sinon.stub(),
            updateProfile: sinon.stub(),
            changePassword: sinon.stub(),
            forgotPassword: sinon.stub()
        };

        jwtServiceMock = {
            createToken: sinon.stub()
        };

        // Setup injector
        sinon.stub(injector, 'getService');
        injector.getService.withArgs('userService').returns(userServiceMock);
        injector.getService.withArgs('jwt').returns(jwtServiceMock);

        controller = userController();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [mockUser];
            userServiceMock.getAllUsers.returns(mockUsers);

            const result = await controller.getAllUsers();
            expect(result).to.deep.equal(mockUsers);
            expect(userServiceMock.getAllUsers.calledOnce).to.be.true;
        });
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Test@123'
            };
            userServiceMock.register.resolves(mockUser);

            const result = await controller.registerUser({ body: userData });
            expect(result).to.deep.equal(mockUser);
            expect(userServiceMock.register.calledWith(userData)).to.be.true;
        });
    });

    describe('login', () => {
        it('should login successfully and return token', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'Test@123'
            };
            userServiceMock.login.resolves(mockUser);
            jwtServiceMock.createToken.resolves('mock-token');

            const result = await controller.login({ body: loginData });
            expect(result).to.have.property('token', 'mock-token');
            expect(result).to.have.property('user').deep.equal(mockUser);
        });

        it('should handle login failure', async () => {
            const loginData = {
                email: 'wrong@example.com',
                password: 'WrongPass'
            };
            userServiceMock.login.rejects(new AuthenticationError('Invalid credentials'));

            try {
                await controller.login({ body: loginData });
                expect.fail('Should throw error');
            } catch (error) {
                expect(error).to.be.instanceOf(AuthenticationError);
            }
        });
    });

    describe('User Status Management', () => {
        it('should activate user successfully', async () => {
            const userData = { email: 'john@example.com' };
            userServiceMock.activateUser.resolves({ ...mockUser, active: true });

            const result = await controller.activateUser({ body: userData });
            expect(userServiceMock.activateUser.calledWith(userData)).to.be.true;
        });

        it('should deactivate user successfully', async () => {
            const userData = { email: 'john@example.com' };
            userServiceMock.deactivateUser.resolves({ ...mockUser, active: false });

            const result = await controller.deactivateUser({ body: userData });
            expect(userServiceMock.deactivateUser.calledWith(userData)).to.be.true;
        });
    });

    describe('Role Management', () => {
        it('should add role to user successfully', async () => {
            const roleData = { email: 'john@example.com', role: 'banker' };
            userServiceMock.addUserToRole.resolves({ success: true });

            const result = await controller.addRole({ body: roleData });
            expect(userServiceMock.addUserToRole.calledWith(roleData)).to.be.true;
        });
    });

    describe('Password Management', () => {
        it('should handle forgot password request', async () => {
            const forgotData = { email: 'john@example.com' };
            userServiceMock.forgotPassword.resolves({ message: 'OTP sent' });

            const result = await controller.forgotPassword({ body: forgotData });
            expect(userServiceMock.forgotPassword.calledWith(forgotData)).to.be.true;
        });

        it('should validate OTP successfully', async () => {
            const otpData = { email: 'john@example.com', enteredOtp: '123456' };
            userServiceMock.validateOtp.resolves({ message: 'Valid OTP' });

            const result = await controller.validateOtp({ body: otpData });
            expect(userServiceMock.validateOtp.calledWith(otpData)).to.be.true;
        });

        it('should reset password successfully', async () => {
            const resetData = {
                email: 'john@example.com',
                otp: '123456',
                newPassword: 'NewTest@123'
            };
            userServiceMock.resetPassword.resolves({ message: 'Password reset successful' });

            const result = await controller.resetPassword({ body: resetData });
            expect(userServiceMock.resetPassword.calledWith(resetData)).to.be.true;
        });

        it('should reset OTP successfully', async () => {
            const resetOtpData = { email: 'john@example.com' };
            userServiceMock.resetOtp.resolves({ message: 'New OTP sent' });

            const result = await controller.resetOtp({ body: resetOtpData });
            expect(userServiceMock.resetOtp.calledWith(resetOtpData)).to.be.true;
        });

        it('should change password successfully', async () => {
            const changePasswordData = {
                email: 'john@example.com',
                currentPassword: 'Test@123',
                newPassword: 'NewTest@123'
            };
            userServiceMock.changePassword.resolves({ success: true });

            const result = await controller.changePassword({ body: changePasswordData });
            expect(userServiceMock.changePassword.calledWith(changePasswordData)).to.be.true;
        });
    });

    describe('Profile Management', () => {
        it('should update profile successfully', async () => {
            const profileData = {
                name: 'John Updated',
                email: 'john@example.com',
                accountNumber: '1234567890',
                phone: '9876543210',
                address: '456 New St'
            };
            userServiceMock.updateProfile.resolves(mockUser);
            jwtServiceMock.createToken.resolves('new-token');

            const result = await controller.updateProfile({ body: profileData });
            expect(result).to.have.property('token', 'new-token');
            expect(result).to.have.property('user').deep.equal(mockUser);
        });
    });

    describe('Current User Info', () => {
        it('should return current user token info', async () => {
            const mockToken = { user: mockUser };
            const result = await controller.currentUserInfo({ request: { token: mockToken } });
            expect(result).to.deep.equal(mockToken);
        });
    });
});
