"use client"; //This tells Next.js this component needs interactivity (buttons , inputs)

import { useState } from "react"; // useState is a React Hook (from React)
// It lets you store and update data inside a component

// This defines a React component named Home
// export default means this component is the main export of the file
export default function Home() {
  // 1. React 'State' replaces our old document.getElementById variables
  const [file, setFile] = useState(null); //file → stores uploaded file // setFile → updates it // null → initial value
  const [jobDescription, setJobDescription] = useState(""); // Stores text input (job description) // Initially empty string
  const [loading, setLoading] = useState(false); // true → request is processing // false → idle // Used to show spinner / "Loading..."
  const [result, setResult] = useState(""); // Stores output (like AI analysis result)
  const [error, setError] = useState(""); // Stores error messages // Example: "File upload failed"

  // THE PARSER MAGIC
  // This function takes the raw block and cuts it into specific pieces
  const parseAnalysis = (text) => {
    const scoreMatch = text.match(/GAP SCORE:\s*(\d+)/i);
    const skillsMatch = text.match(/MISSING SKILLS:\s*([\s\S]*?)(?=SUMMARY:|$)/i);
    // Added limits so the regex stops matching at the next setJobDescription
    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*)/i); //These regex patterns extract content between roadmap sections (30 → 60 → 90) using non-greedy matching and lookaheads.
    const rm30Match = text.match(/ROADMAP_30:\s*([\s\S]*?)(?=ROADMAP_60:|$)/i);
    const rm60Match = text.match(/ROADMAP_60:\s*([\s\S]*?)(?=ROADMAP_90:|$)/i);
    const rm90Match = text.match(/ROADMAP_90:\s*([\s\S]*)/i);
    // .match() returns an array
    //[0] = full match
    //[1] = captured group (what you actually want)

    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0, //.trim() removes extra spaces/newlines
      skills: skillsMatch ? skillsMatch[1].trim() : "No missing skills listed.",
      summary: summaryMatch ? summaryMatch[1].trim() : text, // Fallback to full text if it fails
      roadmap30: rm30Match ? rm30Match[1].trim() : "Review job fundamentals.", //Each: Uses extracted section if available , Otherwise gives a default plan
      roadmap60: rm60Match ? rm60Match[1].trim() : "Build a project using missing skills.",
      roadmap90: rm90Match ? rm90Match[1].trim() : "Prepare for behavioral and technical interviews.",
    };
  };
  // 2. The function that runs when the button is clicked
  const handleAnalyze = async () => {
    // Basic Validation
    if (!file) {
      setError("Hold on! Please upload a PDF resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Hold on! Please paste a job description.");
      return;
    }

    // Reset UI before thinking
    setError("");
    setResult("");
    setLoading(true);

    // Create the digital envelope
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    //Send to our Node.js backend
    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(`SERVER ERROR: ${data.error}`);
      }
      else {
        // Run the raw text through our parser before saving it to state
        const parsedData = parseAnalysis(data.analysis)
        setResult(parsedData);
      }
    } catch (err) {
      setError("CRITICAL ERROR: Could not connect to backend. Is Node.js running?");
    }
    finally {
      setLoading(false); // Stop the laoding animation 
    }
  };

  // --- HELPER FUNCTION FOR COLORS ---
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // 3. The UI (HTML styled with Tailwind CSS classes)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
            AI Resume & JD Analyzer
          </h2>
          <p className="mt-2 text-md text-gray-600">
            Upload your resume and paste the job description to get your match score and personalized roadmap.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cursor-pointer focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              rows="6"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-md text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "bg-orange-500 cursor-not-allowed animate-pulse" : "bg-blue-600 hover:bg-blue-700"
              } transition-all duration-200`}
          >
            {loading ? "Analyzing Skills & Generating Roadmap..." : "Analyze Gap"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* --- PREMIUM SAAS RESULTS DASHBOARD --- */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

              {/* Circular Progress Ring */}
              <div className="flex-shrink-0 relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle
                    cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                    className={`${getScoreColor(result.score)} transition-all duration-1000 ease-out`}
                    strokeDasharray="502"
                    strokeDashoffset={502 - (502 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-5xl font-extrabold text-gray-900">{result.score}%</span>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Match Score</p>
                </div>
              </div>

              {/* Parsed Text Data */}
              <div className="flex-1 space-y-6 w-full">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Summary</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{result.summary}</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Missing Skills
                  </h3>
                  <div className="whitespace-pre-wrap text-sm text-gray-600 font-medium">
                    {result.skills}
                  </div>
                </div>
              </div>
            </div>

            {/* --- NEW ACTION PLAN ROADMAP --- */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Your 90-Day Action Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 30 Days */}
                <div className="bg-white border-t-4 border-blue-500 shadow-sm p-6 rounded-b-xl hover:shadow-md transition-shadow">
                  <h4 className="text-blue-600 font-black text-xl mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">1</span>
                    30 Days
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.roadmap30}</p>
                </div>

                {/* 60 Days */}
                <div className="bg-white border-t-4 border-indigo-500 shadow-sm p-6 rounded-b-xl hover:shadow-md transition-shadow">
                  <h4 className="text-indigo-600 font-black text-xl mb-3 flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">2</span>
                    60 Days
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.roadmap60}</p>
                </div>

                {/* 90 Days */}
                <div className="bg-white border-t-4 border-purple-500 shadow-sm p-6 rounded-b-xl hover:shadow-md transition-shadow">
                  <h4 className="text-purple-600 font-black text-xl mb-3 flex items-center">
                    <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">3</span>
                    90 Days
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.roadmap90}</p>
                </div>

              </div>
            </div>
            {/* --- END ROADMAP --- */}

          </div>
        )}

      </div>
      {/* --- LINK TO HISTORY --- */}
      <div className="mt-8 text-center">
        <a href="/history" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4 transition-colors">
          View your past analyses &rarr;
        </a>
      </div>
    </div>
  );
}