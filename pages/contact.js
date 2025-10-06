import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    education: "",
    skills: "",
    experience: "",
    languages: "",
    summary: "",
    honeypot: "", // spam protection
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Spam protection check
    if (formData.honeypot !== "") {
      console.warn("Spam detected!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbza0ixTZTC3noAW335yrL70QaAnLqafYzDKEiGt2tOooE-_6JKp8R1cO4bpwmiTcW6Z/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      setMessage("✅ Your form has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        education: "",
        skills: "",
        experience: "",
        languages: "",
        summary: "",
        honeypot: "",
      });

      // 💫 Success animation (fade-out after 3 seconds)
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage("❌ Something went wrong. Please try again later.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Contact Us
        </h1>

        {message && (
          <div
            className={`text-center p-3 mb-4 rounded-md transition-all duration-700 ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* hidden honeypot field */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="languages"
            placeholder="Languages Known"
            value={formData.languages}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="summary"
            placeholder="Short Summary About You"
            value={formData.summary}
            onChange={handleChange}
            className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
