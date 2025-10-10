import { useState, useEffect } from "react";

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
    honeypot: "",
  });

  const [status, setStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus("Submitting...");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz3jMYwNNSvYv2QNgU-E1rNeTw7AjzKUHy1VCpcDMQbNOBn3watw2Zr1gNrqqOicJKMdA/exec",
        {
          method: "POST",
          body: new FormData(e.target),
        }
      );

      if (response.ok) {
        setShowSuccess(true);
        setStatus("Form submitted successfully!");
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
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Error submitting form.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen bg-gray-900 text-white py-10 px-4 transition-opacity duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Contact Us
        </h1>

        {/* AdSense Top */}
        <div className="mb-6 text-center bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Ad Space - Top (728x90)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="honeypot" style={{ display: "none" }} />

          {[
            { name: "name", label: "Full Name" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "phone", label: "Phone Number", type: "tel" },
            { name: "dob", label: "Date of Birth", type: "date" },
            { name: "gender", label: "Gender" },
            { name: "address", label: "Address" },
            { name: "education", label: "Education" },
            { name: "skills", label: "Skills" },
            { name: "experience", label: "Experience" },
            { name: "languages", label: "Languages Known" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-1 text-sm font-semibold">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-yellow-400 outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 text-sm font-semibold">Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-yellow-400 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition"
          >
            Submit
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-400">{status}</p>
        )}

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-800 p-8 rounded-2xl text-center shadow-xl animate-fadeIn scale-95">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-400 rounded-full flex items-center justify-center animate-bounce">
                ✅
              </div>
              <h2 className="text-2xl font-semibold text-green-400 mb-2">
                Form Submitted Successfully!
              </h2>
              <p className="text-gray-300 mb-4">
                Thank you for reaching out. We'll get back to you soon.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* AdSense Bottom */}
        <div className="mt-8 text-center bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Ad Space - Bottom (728x90)</p>
        </div>

        {/* WhatsApp Contact */}
        <div className="fixed bottom-6 right-6">
          <a
            href="https://wa.me/919594455328"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-400 transition transform hover:scale-105"
          >
            💬
          </a>
        </div>

        {/* Scroll to Top Button */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition transform hover:scale-110"
            title="Back to Top"
          >
            ⬆️
          </button>
        )}
      </div>
    </div>
  );
}
