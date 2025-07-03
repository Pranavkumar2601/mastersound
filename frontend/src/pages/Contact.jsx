import React, { useState } from "react";

// Mock API function for demonstration
// In a real application, ensure this is imported from your actual API service
const submitContact = (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.name && formData.email && formData.message) {
        console.log("Contact form submitted:", formData);
        resolve({ message: "Message sent successfully!" });
      } else {
        reject(
          new Error(
            "Please fill in all required fields (Name, Email, Message)."
          )
        );
      }
    }, 1000);
  });
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission
    setError("");
    setSuccess("");
    try {
      await submitContact(form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); // Set loading to false after submission (success or error)
    }
  };

  // Common Tailwind CSS classes for inputs and buttons
  const commonInputClasses =
    "w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400";
  const commonButtonClasses =
    "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out";

  return (
    // Main container with dark background and Inter font
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          <span className="text-orange-500">Contact Us</span>
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Have questions or feedback? We'd love to hear from you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className={commonInputClasses}
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className={commonInputClasses}
            disabled={loading}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Your Phone (Optional)"
            value={form.phone}
            onChange={handleChange}
            className={commonInputClasses} // Phone is optional, so required removed here
            disabled={loading}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
            className={`${commonInputClasses} min-h-[100px]`} // Added min-height for textarea
            disabled={loading}
          />
          <button
            type="submit"
            className={commonButtonClasses}
            disabled={loading || !form.name || !form.email || !form.message} // Disable if required fields are empty
          >
            {loading ? "Sending Message..." : "Send Message"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-center animate-fade-in">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-green-400 text-center animate-fade-in">
            {success}
          </p>
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
      `}</style>
    </div>
  );
}
