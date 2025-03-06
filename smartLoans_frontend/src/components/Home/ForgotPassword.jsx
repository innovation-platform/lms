import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setResendDisabled(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await AuthService.resetPassword.request(email);
            setMessage(result.message);
            setStep(2);
            setResendDisabled(true);
            setCountdown(60);
        } catch (error) {
            setMessage(error);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await AuthService.resetPassword.validate(email, otp);
            setMessage(result.message);
            setStep(3);
        } catch (error) {
            setMessage(error);
        }
    };

    const handleResendOtp = async () => {
        try {
            const result = await AuthService.resetPassword.resend(email);
            setMessage(result.message);
            setResendDisabled(true);
            setCountdown(60);
        } catch (error) {
            setMessage(error);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const result = await AuthService.resetPassword.reset(email, otp, newPassword);
            setMessage(result.message);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff" }}>
                <h2 className="text-center text-dark">Forgot Password</h2>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-dark">Email address</label>
                            <input 
                                id="email"
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: "#41B3A2", color: "white" }}>Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label text-dark">Enter OTP</label>
                            <input 
                                id="otp"
                                type="text" 
                                className="form-control" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100 mb-2" style={{ backgroundColor: "#41B3A2", color: "white" }}>Verify OTP</button>
                        <button 
                            type="button" 
                            className="btn btn-outline-dark w-100"
                            onClick={handleResendOtp} 
                            disabled={resendDisabled}
                        >
                            {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-dark">New Password</label>
                            <input
                                id="password" 
                                type="password" 
                                className="form-control" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: "#41B3A2", color: "white" }}>Reset Password</button>
                    </form>
                )}

                {message && <p className="mt-3 text-center text-dark">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
