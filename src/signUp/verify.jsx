import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import "./Verify.css"; // Import the CSS file

export default function Verify() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) {
    return <div className="verify-container">Loading...</div>;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        window.location.href = "/register"; // Redirect after success
      } else {
        console.log("Verification pending:", completeSignUp);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2 className="verify-title">Verify Your Email</h2>
        {error && <p className="verify-error">{error}</p>}

        <form onSubmit={handleVerify} className="verify-form">
          <input
            type="text"
            placeholder="Enter OTP code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="verify-input"
            required
          />
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
