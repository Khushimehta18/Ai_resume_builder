import { useState } from "react";

export default function PortfolioForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    projects: "",
    github: "",
    linkedin: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        projects: formData.projects
          .split("\n")
          .filter((p) => p.trim() !== ""),
      };

      const res = await fetch("http://127.0.0.1:8000/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data.portfolio_text);
    } catch {
      alert("Failed to generate portfolio");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">

      {/* ---------- FORM (HIDDEN IN PDF) ---------- */}
      <div className="print-hidden w-full max-w-2xl">
        <h1 className="text-2xl mb-6 text-center">Portfolio Generator</h1>

        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black"
        />

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black h-20"
        />

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black"
        />

        <textarea
          name="projects"
          placeholder="Projects (one per line)"
          value={formData.projects}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black h-24"
        />

        <input
          name="github"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded text-black"
        />

        <input
          name="linkedin"
          placeholder="LinkedIn URL"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded text-black"
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
            id="portfolio-preview"
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
