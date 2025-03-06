const {ValidationError, AuthenticationError,AuthorizationError, NotFoundError } = require("ca-webutils/errors");
const bcrypt = require("bcrypt");
const nodemailer=require('nodemailer');

class UserService{
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async getAllUsers(){
        const users = await this.userRepository.getAll();
        return users.map(this._userInfo);
    }

    _userInfo(user){
        return {name:user.name, email:user.email, photo:user.photo, roles:user.roles,active:user.active,accountNumber:user.accountNumber,phone:user.phone,address:user.address};
    }

    // async register(user){
    //     const admin = user.roles.find(role=>role.toLowerCase() === "admin");
    //     if(admin)
    //         throw new AuthorizationError(`Admin user cannot be created manually`);
    //     user.password = await bcrypt.hash(user.password,10);
    //     let dbUser= await this.userRepository.create(user);
    //     return this._userInfo(dbUser);
    // }
    async register(user) {
        user.password = await bcrypt.hash(user.password, 10);
    
        // Generate unique 8-digit account number
        user.accountNumber = await this._generateUniqueAccountNumber();
    
        let dbUser = await this.userRepository.create(user);
        return this._userInfo(dbUser);
    }
    
    async _generateUniqueAccountNumber() {
        let accountNumber;
        let exists = true;
    
        while (exists) {
            accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number
            const existingUser = await this.userRepository.findOne({ accountNumber });
            if (!existingUser) exists = false; // Ensure uniqueness
        }
    
        return accountNumber;
    }
    
    

    async login({email, password}){
        let user = await this.userRepository.findOne({email})
        if(!user) throw new AuthenticationError(`Invalid credentials:${email}`,{email});
        const match = await bcrypt.compare(password,user.password);        
        if(!match) 
            throw new AuthenticationError(`Invalid credentials: ${email}`,{email});
        if(!user.active) 
            throw new AuthorizationError(`User is Inactive.`,{email});
        console.log("roles",user.roles);
        // return {name:user.name, email:user.email, photo:user.photo, roles:user.roles};
    
        return this._userInfo(user);
    }

    async getUserById(id){
        const user = await this.userRepository.getById(id);
        return user;
    }

    async activateUser({email}){
        let user = await this.userRepository.getById(email);
        user.active=true;
        return await user.save();
    }

    async deactivateUser({email}){
        let user=await this.userRepository.getById(email);
        user.active=false;
        return await user.save();
    }

    async addUserToRole({email, role}) {
        
        return await this.userRepository.update(
            { email }, 
            { $set: { roles: [role] } }
        );
    }
    
    async removeUserFromRole(email) {
        // Reset role to default "user"
        return await this.userRepository.update(
            { email }, 
            { $set: { role: ["user"] } }
        );
    }
    

    async changePassword({email, currentPassword , newPassword}){

        //verify if oldPssword matches password or otp of user
        let user = await this.userRepository.getById(email);
        
        let match = await bcrypt.compare(currentPassword,user.password);
        if(!match)
            match = await bcrypt.compare(currentPassword,user.otp);
        if(!match) throw new ValidationError(`Invalid old password or OTP`);

        newPassword = await bcrypt.hash(newPassword,10);

        return await this.userRepository.update({email}, {$set:{password: newPassword}});
    }

    async forgotPassword({ email }) {
        try {
            // Check if email exists in the database
            const user = await this.userRepository.findOne({ email });
            if (!user) {
                throw new Error("Email not found");
            }

            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash the OTP before storing
            const hashedOtp = await bcrypt.hash(otp, 10);

            // Store hashed OTP and expiry in the user's record
            user.otp = hashedOtp;
            user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
            await user.save();

            // Send OTP via email
            setTimeout(() => this.sendEmail(email, otp), 0);
            // await this.sendEmail(email, otp);

            return { message: "OTP sent successfully to your email." };
        } catch (error) {
            throw new Error(error.message || "An error occurred while processing your request.");
        }
    }

    async validateOtp({ email, enteredOtp }) {
        try {
            // Find user by email
            const user = await this.userRepository.findOne({ email });
            console.log("user",user);
            console.log("otp",enteredOtp);
            if (!user) {
                throw new NotFoundError("Email not found.");
            }

            // Check if OTP is expired
            if (Date.now() > user.otpExpiry) {
                throw new ValidationError("OTP has expired. Please request a new one.");
            }

            // Compare entered OTP with stored hashed OTP
            const isMatch = await bcrypt.compare(enteredOtp, user.otp);
            if (!isMatch) {
                throw new ValidationError("Invalid OTP. Please try again.");
            }

            // OTP is valid, allow user to proceed to reset password
            return { message: "OTP verified successfully. Proceed to reset your password." };
        } catch (error) {
            throw new Error(error.message || "Failed to validate OTP.");
        }
    }

    async resetPassword({ email, otp, newPassword }) {
        try {
            // Validate OTP first
            await this.validateOtp({ email, enteredOtp: otp });

            // Find user by email
            const user = await this.userRepository.findOne({ email });

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password and clear OTP fields
            user.password = hashedPassword;
            user.resetOtp = null;
            user.otpExpiry = null;
            await user.save();

            return { message: "Password reset successfully. You can now log in with your new password." };
        } catch (error) {
            throw new Error(error.message || "Failed to reset password.");
        }
    }
    async resetOtp({ email }) {
        return await this.forgotPassword({ email });
    }    

    async sendEmail(to, otp) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, // Use environment variables
                    pass: process.env.EMAIL_PASS, // Use app password for security
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${otp}. It expires in 15 minutes.`,
            });

        } catch (error) {
            console.error("Email sending failed:", error);
            throw new ValidationError("Failed to send OTP. Please try again.");
        }
    }
    async updateProfile({ name, email, accountNumber,phone,address }) {
        const user = await this.userRepository.findOne({ accountNumber });
        console.log("user",user);
        if (!user) {
            throw new NotFoundError("User not found");
        }
    
        user.name = name;
        user.email = email;
        user.phone=phone;
        user.address=address;

        await user.save();
        return this._userInfo(user);
    }
    
}

UserService._dependencies =[ 'userRepository' ];

module.exports = UserService;

