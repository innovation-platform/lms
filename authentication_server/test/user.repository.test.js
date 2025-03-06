const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { NotFoundError } = require('ca-webutils/errors');
const MongooseUserRepository = require('../src/repositories/mongoose/user.repository');
const User = require('../src/repositories/mongoose/models/user.model');

describe('MongooseUserRepository Tests', () => {
    let userRepository;
    let mockUser;

    before(async () => {
        // Connect to test database
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

        mockUser = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            roles: ['user'],
            accountNumber: '1234567890',
            phone: '9876543210',
            address: '123 Test Street'
        };

        userRepository = new MongooseUserRepository(User);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Constructor', () => {
        it('should create repository instance with model', () => {
            expect(userRepository.model).to.equal(User);
        });
    });

    describe('getById', () => {
        it('should get user by email successfully', async () => {
            const user = new User(mockUser);
            await user.save();

            const result = await userRepository.getById(mockUser.email);
            expect(result.email).to.equal(mockUser.email);
        });

        it('should throw NotFoundError for non-existent email', async () => {
            try {
                await userRepository.getById('nonexistent@example.com');
                expect.fail('Should throw NotFoundError');
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
                expect(error.message).to.include('not found');
            }
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            const user = new User(mockUser);
            await user.save();

            const updateResult = await userRepository.update(
                { email: mockUser.email },
                { $set: { name: 'Jane Doe' } }
            );

            expect(updateResult.modifiedCount).to.equal(1);
        });

        it('should handle update with no matching documents', async () => {
            const updateResult = await userRepository.update(
                { email: 'nonexistent@example.com' },
                { $set: { name: 'Jane Doe' } }
            );

            expect(updateResult.modifiedCount).to.equal(0);
        });
    });

    // Testing inherited methods from MongooseRepository
    

        describe('findOne', () => {
            it('should find one user successfully', async () => {
                await User.create(mockUser);

                const result = await userRepository.findOne({ email: mockUser.email });
                expect(result.email).to.equal(mockUser.email);
            });

            it('should return null for non-existent user', async () => {
                const result = await userRepository.findOne({ email: 'nonexistent@example.com' });
                expect(result).to.be.null;
            });
        });

        describe('create', () => {
            it('should create user successfully', async () => {
                const result = await userRepository.create(mockUser);
                expect(result.email).to.equal(mockUser.email);
                expect(result._id).to.exist;
            });

            it('should fail to create user with invalid data', async () => {
                const invalidUser = { email: 'invalid' };
                try {
                    await userRepository.create(invalidUser);
                    expect.fail('Should throw validation error');
                } catch (error) {
                    expect(error).to.be.instanceOf(mongoose.Error.ValidationError);
                }
            });
        });


       
    });
