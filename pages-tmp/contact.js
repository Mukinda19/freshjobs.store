// pages/contact.js
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 my-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          Have questions or suggestions? Reach out to us using the form below.
        </p>
        <form className="space-y-3">
          <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <textarea placeholder="Message" className="w-full p-2 border rounded"></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}