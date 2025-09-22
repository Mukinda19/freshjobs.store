// pages/resume-builder.js
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ResumeBuilderPage() {
  const [form, setForm] = useState({
    name: "Your Name",
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
  });

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function downloadPDF() {
    const el = document.getElementById("resume-root");
    if (!el) return;
    // make sure background is white for PDF
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const fileName = (form.name || "resume").replace(/\s+/g, "_") + ".pdf";
    pdf.save(fileName);
  }

  // Inline styles to ensure html2canvas captures everything correctly
  const containerStyle = {
    width: "794px", // ~A4 width at 96dpi
    minHeight: "1123px",
    background: "#ffffff",
    color: "#263238",
    padding: "36px",
    boxSizing: "border-box",
    fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    margin: "0 auto",
  };

  const accent = { background: "#0b64d0" }; // nice blue accent

  const nameStyle = {
    fontSize: "36px",
    fontWeight: 700,
    color: "#0b3b85",
    margin: 0,
  };

  const smallLabel = { color: "#374151", fontSize: "13px", margin: 0 };

  const sectionTitle = {
    color: "#0b64d0",
    fontSize: "16px",
    margin: "12px 0 6px 0",
    fontWeight: 700,
  };

  // Small helper to display a labeled row (Label - Value)
  const Labeled = ({ label, value }) => {
    if (!value) return null;
    return (
      <p style={{ margin: "3px 0", fontSize: 13 }}>
        <strong style={{ color: "#0b64d0", width: 120, display: "inline-block" }}>{label}</strong>
        <span style={{ color: "#334155" }}> {value}</span>
      </p>
    );
  };

  return (
    <div style={{ padding: 20, background: "#f3f4f6", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto 24px" }}>
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>Stylish Resume Builder</h1>
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Fill details below and click <strong>Download PDF</strong>.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 1100, margin: "0 auto 28px", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px", background: "#fff", padding: 18, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginTop: 0 }}>Enter details</h3>
          {/* Render inputs */}
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Date of Birth (eg: 19th April 1991)" name="dob" value={form.dob} onChange={handleChange} />
          <Input label="Gender" name="gender" value={form.gender} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Textarea label="Education" name="education" value={form.education} onChange={handleChange} />
          <Textarea label="Skills (comma separated or bullet lines)" name="skills" value={form.skills} onChange={handleChange} />
          <Textarea label="Experience" name="experience" value={form.experience} onChange={handleChange} />
          <Textarea label="Languages Known" name="languages" value={form.languages} onChange={handleChange} />
          <Textarea label="Professional Summary" name="summary" value={form.summary} onChange={handleChange} rows={3} />
        </div>

        {/* Buttons + preview container instructions */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", padding: 14, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 6px 0", fontWeight: 700 }}>Actions</p>
            <button onClick={downloadPDF} style={{ width: "100%", padding: "10px 12px", background: "#0b64d0", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
              Download PDF
            </button>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              Tip: fill the form on left then click Download PDF. The layout is sized for A4 portrait.
            </p>
          </div>
          <div style={{ background: "#fff", padding: 14, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Preview area</p>
            <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>The PDF generator will capture this preview and create an A4 PDF.</p>
          </div>
        </div>
      </div>

      {/* ===== Resume preview (this is captured into PDF) ===== */}
      <div style={{ maxWidth: 1100, margin: "0 auto 60px", display: "flex", justifyContent: "center" }}>
        <div id="resume-root" style={containerStyle}>
          {/* A thin accent bar on left */}
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 8, borderRadius: 4, background: "#0b64d0", marginRight: 12 }} />
            <div style={{ flex: 1 }}>
              {/* Header: big name + contact under it */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h2 style={nameStyle}>{form.name || "Your Name"}</h2>
                <div style={{ textAlign: "right", minWidth: 220 }}>
                  {form.email && <div style={smallLabel}>Email - <span style={{ color: "#334155" }}>{form.email}</span></div>}
                  {form.phone && <div style={smallLabel}>Phone - <span style={{ color: "#334155" }}>{form.phone}</span></div>}
                </div>
              </div>

              {/* Personal rows: DOB, Gender, Address (these appear below header) */}
              <div style={{ margin: "8px 0 14px 0", paddingTop: 6 }}>
                <Labeled label="Date of Birth:" value={form.dob} />
                <Labeled label="Gender:" value={form.gender} />
                <Labeled label="Address:" value={form.address} />
              </div>

              <hr style={{ border: 0, borderTop: "1px solid #e6eef9", margin: "8px 0 14px 0" }} />

              {/* Sections */}
              {form.education && (
                <div>
                  <div style={sectionTitle}>Education</div>
                  <div style={{ color: "#334155", fontSize: 14 }}>{form.education}</div>
                </div>
              )}

              {form.skills && (
                <div>
                  <div style={sectionTitle}>Skills</div>
                  <div style={{ color: "#334155", fontSize: 14, whiteSpace: "pre-wrap" }}>{formatAsBullets(form.skills)}</div>
                </div>
              )}

              {form.experience && (
                <div>
                  <div style={sectionTitle}>Experience</div>
                  <div style={{ color: "#334155", fontSize: 14 }}>{form.experience}</div>
                </div>
              )}

              {form.languages && (
                <div>
                  <div style={sectionTitle}>Languages Known</div>
                  <div style={{ color: "#334155", fontSize: 14 }}>{form.languages}</div>
                </div>
              )}

              {form.summary && (
                <div>
                  <div style={sectionTitle}>Professional Summary</div>
                  <div style={{ color: "#334155", fontSize: 14 }}>{form.summary}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small presentational input components */
function Input({ label, name, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6eef9", boxSizing: "border-box" }}
      />
    </div>
  );
}
function Textarea({ label, name, value, onChange, rows = 4 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={rows} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6eef9", boxSizing: "border-box" }} />
    </div>
  );
}

/* helpers */
function formatAsBullets(text) {
  // if comma-separated -> show as line breaks or bullets
  if (!text) return "";
  // replace commas with new lines while preserving existing newlines
  return text
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `• ${s}`)
    .join("\n");
}
