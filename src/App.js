import {useState} from "react";
import { motion } from "framer-motion";
import ResumeForm from "./components/ResumeForm";
import CoverLetterForm from "./components/CoverLetterForm";
import PortfolioForm from "./components/PortfolioForm";

function App() {
  const [step, setStep] = useState("landing");
  const [mode, setMode] = useState("resume");

  if (step === "form" && mode === "resume") {
    return <ResumeForm onBack={() => setStep("landing")} />;
  }

  if (step === "form" && mode === "cover") {
    return <CoverLetterForm onBack={() => setStep("landing")} />;
  }

  if (step === "form" && mode === "portfolio") {
    return <PortfolioForm onBack={() => setStep("landing")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 max-w-md text-center"
      >
        <h1 className="text-4xl font-bold mb-4">AI Resume Builder</h1>
        <p className="text-gray-300 mb-8">
          Generate professional resumes & portfolios using Generative AI
        </p>

        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMode("resume");
                setStep("form");
              }}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMode("cover");
                setStep("form");
              }}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Cover Letter
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setMode("portfolio");
              setStep("form");
            }}
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Portfolio
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;

