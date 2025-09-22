import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function ResumeForm() {
  const formRef = useRef();

  const generatePDF = (e) => {
    e.preventDefault();
    html2pdf().from(formRef.current).save("Resume.pdf");
  };

  return (
    <form ref={formRef} onSubmit={generatePDF} className="space-y-4">
      <input type="text" placeholder="Full Name" className="border p-2 w-full"/>
      <input type="text" placeholder="Email" className="border p-2 w-full"/>
      <input type="text" placeholder="Phone" className="border p-2 w-full"/>
      <input type="text" placeholder="Education" className="border p-2 w-full"/>
      <input type="text" placeholder="Experience" className="border p-2 w-full"/>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Download PDF</button>
    </form>
  );
}