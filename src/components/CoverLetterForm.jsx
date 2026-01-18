import { useState } from "react";

export default function CoverLetterForm({ onBack }) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data.cover_letter_text);
    } catch {
      alert("Failed to generate cover letter");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">

      {/* ---------- FORM (HIDDEN IN PDF) ---------- */}
      <div className="print-hidden w-full max-w-2xl">
        <h1 className="text-2xl mb-6 text-center">Cover Letter Generator</h1>

        <input
          name="jobTitle"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black"
        />

        <input
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black"
        />

        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded text-black h-32"
        />

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-white text-black rounded"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={onBack}
            className="px-6 py-2 bg-white text-black rounded"
          >
            Back
          </button>
        </div>
      </div>

      {/* ---------- PDF CONTENT ---------- */}
      {result && (
        <>
          <div
            id="cover-letter-preview"
            className="print-only bg-white text-black p-8 mt-8 max-w-2xl whitespace-pre-wrap"
          >
            {result}
          </div>

          <div className="print-hidden mt-6">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-white text-black rounded"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
