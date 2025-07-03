import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { validateSerial, registerWarranty } from "../services/api"; // Ensure these are correctly imported

export default function EWarranty() {
  const [step, setStep] = useState(1);
  const [serial, setSerial] = useState("");
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // Renamed from setSuccess for clarity
  const [loading, setLoading] = useState(false); // Added loading state
  const [searchParams] = useSearchParams();

  // Prefill serial if passed in query string
  useEffect(() => {
    const pre = searchParams.get("serial");
    if (pre) setSerial(pre.trim().toUpperCase());
  }, [searchParams]);

  // Step 1: Validate the serial number
  const handleValidate = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const data = await validateSerial(serial);
      setInfo(data);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Register the warranty
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await registerWarranty({
        serial,
        product_id: info.product_id,
        user_name: form.user_name,
        user_email: form.user_email,
        user_phone: form.user_phone,
      });
      setSuccessMsg("Warranty registered successfully!");
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const commonInputClasses =
    "w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400";
  const commonButtonClasses =
    "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out";

  return (
    // Main container with dark background and Inter font
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          Product <span className="text-orange-500">E-Warranty</span>
        </h1>

        {/* Step 1: Enter Serial Number */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Please enter your product's serial number to validate its
              eligibility for warranty registration.
            </p>
            <input
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value.trim().toUpperCase())}
              placeholder="e.g. WH1001"
              className={commonInputClasses}
              disabled={loading}
            />
            <button
              onClick={handleValidate}
              className={commonButtonClasses}
              disabled={loading || !serial}
            >
              {loading ? "Validating..." : "Validate Serial Number"}
            </button>
            {error && (
              <p className="text-red-500 text-center mt-4 animate-fade-in">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Register Warranty Form */}
        {step === 2 && info && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-gray-300 text-center text-lg">
              Product:{" "}
              <strong className="text-orange-400">{info.product_name}</strong>
            </p>
            <input
              type="text"
              placeholder="Your Full Name"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              className={commonInputClasses}
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Your Email Address"
              value={form.user_email}
              onChange={(e) => setForm({ ...form, user_email: e.target.value })}
              className={commonInputClasses}
              disabled={loading}
            />
            <input
              type="tel"
              placeholder="Your Phone Number (Optional)"
              value={form.user_phone}
              onChange={(e) => setForm({ ...form, user_phone: e.target.value })}
              className={commonInputClasses}
              disabled={loading}
            />
            <button
              onClick={handleRegister}
              className={commonButtonClasses}
              disabled={loading || !form.user_name || !form.user_email} // Basic validation
            >
              {loading ? "Registering..." : "Submit Registration"}
            </button>
            {error && (
              <p className="text-red-500 text-center mt-4 animate-fade-in">
                {error}
              </p>
            )}
            <button
              onClick={() => {
                setStep(1);
                setError("");
                setInfo(null);
                setSerial("");
                setLoading(false);
              }}
              className="w-full text-gray-400 hover:text-orange-400 mt-4 transition-colors duration-300 text-sm"
              disabled={loading}
            >
              Go Back
            </button>
          </div>
        )}

        {/* Step 3: Success Message */}
        {step === 3 && (
          <div className="text-center space-y-4 animate-fade-in">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-green-400">{successMsg}</h2>
            <p className="text-gray-300">
              Thank you for registering your warranty with MasterSound. You're
              all set!
            </p>
            <button
              onClick={() => {
                setStep(1);
                setError("");
                setSuccessMsg("");
                setInfo(null);
                setSerial("");
                setForm({ user_name: "", user_email: "", user_phone: "" });
                setLoading(false);
              }}
              className={commonButtonClasses}
            >
              Register Another Product
            </button>
          </div>
        )}
      </div>

      {/* Tailwind CSS custom animations and font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
