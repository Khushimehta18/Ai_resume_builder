import { useState } from "react";
import { motion } from "framer-motion";

export default function ResumeForm({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");
  const [template, setTemplate] = useState(1);
  const [error, setError] = useState("");



  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",

    // Education
    degree: "",
    field: "",
    university: "",
    startYear: "",
    endYear: "",

    // Skills
    skills: "",
    tools: "",

    // Dynamic sections
    projects: [{ title: "", tech: "", desc: "" }],
    experience: [{ role: "", company: "", duration: "", desc: "" }],
    certifications: [""],
    extracurriculars: [""],
  });

  /* ---------- GENERIC HANDLERS ---------- */

  function handleChange(e) {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleListChange(section, index, field, value) {
    const updated = [...formData[section]];
    if (typeof updated[index] === "string") {
      updated[index] = value;
    } else {
      updated[index][field] = value;
    }
    setFormData({ ...formData, [section]: updated });
  }

  function addItem(section, emptyItem) {
    setFormData({
      ...formData,
      [section]: [...formData[section], emptyItem],
    });
  }

  function removeItem(section, index) {
    setFormData({
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index),
    });
  }
/* ---------- STEP VALIDATION ---------- */
function isStepValid() {
  if (step === 1 && (!formData.fullName || !formData.email)) {
    return false;
  }
  if (step === 2 && (!formData.degree || !formData.university)) {
    return false;
  }
  if (step === 3 && !formData.skills) {
    return false;
  }
  return true;
}


  /* ---------- SUBMIT TO BACKEND ---------- */

  async function handleSubmit() {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setGeneratedResume(data.resume_text);
    } catch (err) {
      console.error(err);
      alert("Error generating resume");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-full max-w-4xl shadow-2xl"
      >
      <div className="print-hidden">
        {/* STEP TABS */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["Personal", "Education", "Skills", "Projects", "Experience", "Certifications", "Activities"].map(
            (label, i) => (
              <button
                key={i}
                onClick={() => setStep(i + 1)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  step === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
              <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="input" />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="input" />
              <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} className="input" />
              <input name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} className="input" />
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} className="input" />
              <input name="field" placeholder="Field of Study" value={formData.field} onChange={handleChange} className="input" />
              <input name="university" placeholder="University" value={formData.university} onChange={handleChange} className="input md:col-span-2" />
              <input name="startYear" placeholder="Start Year" value={formData.startYear} onChange={handleChange} className="input" />
              <input name="endYear" placeholder="End Year" value={formData.endYear} onChange={handleChange} className="input" />
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Skills</h2>
            <div className="space-y-4">
              <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} className="input" />
              <input name="tools" placeholder="Tools & Frameworks" value={formData.tools} onChange={handleChange} className="input" />
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            {formData.projects.map((p, i) => (
              <div key={i} className="mb-4 p-4 rounded-xl bg-black/30 border border-white/10">
                <input className="input mb-2" placeholder="Project Title" value={p.title}
                  onChange={(e) => handleListChange("projects", i, "title", e.target.value)} />
                <input className="input mb-2" placeholder="Tech Stack" value={p.tech}
                  onChange={(e) => handleListChange("projects", i, "tech", e.target.value)} />
                <textarea className="input h-24 resize-none" placeholder="Description" value={p.desc}
                  onChange={(e) => handleListChange("projects", i, "desc", e.target.value)} />
                {formData.projects.length > 1 && (
                  <button onClick={() => removeItem("projects", i)} className="text-red-400 text-sm mt-2">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addItem("projects", { title: "", tech: "", desc: "" })} className="text-indigo-400">
              + Add Project
            </button>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Experience</h2>
            {formData.experience.map((e, i) => (
              <div key={i} className="mb-4 p-4 rounded-xl bg-black/30 border border-white/10">
                <input className="input mb-2" placeholder="Role" value={e.role}
                  onChange={(ev) => handleListChange("experience", i, "role", ev.target.value)} />
                <input className="input mb-2" placeholder="Company" value={e.company}
                  onChange={(ev) => handleListChange("experience", i, "company", ev.target.value)} />
                <input className="input mb-2" placeholder="Duration" value={e.duration}
                  onChange={(ev) => handleListChange("experience", i, "duration", ev.target.value)} />
                <textarea className="input h-24 resize-none" placeholder="Description" value={e.desc}
                  onChange={(ev) => handleListChange("experience", i, "desc", ev.target.value)} />
              </div>
            ))}
            <button onClick={() => addItem("experience", { role: "", company: "", duration: "", desc: "" })} className="text-indigo-400">
              + Add Experience
            </button>
          </>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Certifications</h2>
            {formData.certifications.map((c, i) => (
  <input
    key={i}
    className="input mb-2"
    placeholder="Certification"
    value={c}
    onChange={(e) =>
      handleListChange("certifications", i, null, e.target.value)
    }
  />
))}
    <button
      onClick={() => addItem("certifications", "")}
      className="text-indigo-400"
    >
      + Add Certification
    </button>
  </>
)}


        {/* STEP 7 */}
        {step === 7 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Extracurricular Activities</h2>
            {formData.extracurriculars.map((x, i) => (
              <input key={i} className="input mb-2" placeholder="Activity"
              value = {x}
                onChange={(e) => handleListChange("extracurriculars", i, null, e.target.value)} />
            ))}
            <button onClick={() => addItem("extracurriculars", "")} className="text-indigo-400">
              + Add Activity
            </button>
          </>
        )}
       {error && (
  <p className="text-red-400 text-sm text-center mt-4">
    {error}
  </p>
)}

       <div className="flex justify-between mt-10">
  {step !== 1 && (
    <button
      onClick={() => setStep(step - 1)}
      className="btn-secondary"
    >
      Back
    </button>
  )}

  {step < 7 && (
    <button
      onClick={() => {
        if (!isStepValid()) {
          setError("Please fill mandatory fields");
          return;
        }
        setError("");
        setStep(step + 1);
      }}
      className="btn-primary"
    >
      Next
    </button>
  )}

  {step === 7 && (
    <button
      onClick={handleSubmit}
      className="btn-primary"
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate Resume ✨"}
    </button>
  )}
</div>
</div>
 
        {generatedResume && (
  <>
    <div className="print-hidden mt-6 mb-4">
      <h3 className="text-sm mb-2 text-gray-300">Select ATS Template</h3>
      <div className="flex gap-3">
        {[1, 2, 3].map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={`px-4 py-2 rounded-full text-sm ${
              template === t
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Template {t}
          </button>
        ))}
      </div>
    </div>

    <div
      id="resume-preview"
      className="print-only mt-4 bg-white text-black p-6 rounded-xl text-sm"
    >
      {template === 1 && <TemplateOne text={generatedResume} />}
      {template === 2 && <TemplateTwo text={generatedResume} />}
      {template === 3 && <TemplateThree text={generatedResume} />}
    </div>
  </>
)}

  {generatedResume && (
  <div className="print-hidden flex flex-wrap gap-4 justify-center mt-8">
    
    <button
      onClick={() => window.print()}
      className="btn-primary"
    >
      Download PDF
    </button>

    <button
      onClick={() => {
        setGeneratedResume("");
        setStep(1);
      }}
      className="btn-secondary"
    >
      Edit Resume
    </button>

    <button
      onClick={() => {
        setGeneratedResume("");
        setTemplate(1);
        setStep(1);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          degree: "",
          field: "",
          university: "",
          startYear: "",
          endYear: "",
          skills: "",
          tools: "",
          projects: [{ title: "", tech: "", desc: "" }],
          experience: [{ role: "", company: "", duration: "", desc: "" }],
          certifications: [""],
          extracurriculars: [""],
        });
      }}
      className="btn-secondary"
    >
      Generate New
    </button>

    <button
      onClick={onBack}
      className="btn-secondary"
    >
      Exit
    </button>

  </div>
)}

      </motion.div>
    </div>
  );
}

function TemplateOne({ text }) {
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {text}
    </div>
  );
}

function TemplateTwo({ text }) {
  return (
    <div className="whitespace-pre-wrap leading-loose tracking-wide">
      {text}
    </div>
  );
}

function TemplateThree({ text }) {
  return (
    <div className="whitespace-pre-wrap leading-normal">
      {text}
    </div>
  );
}
