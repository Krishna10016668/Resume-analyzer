"use client";
import { useState, useRef } from "react";

export default function ScanTab({ userId, onResult }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf") || f.name.endsWith(".docx"))) setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a PDF resume first."); return; }
    if (!jobDescription.trim()) { setError("Please paste a job description."); return; }
    setError(""); setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("userId", userId);
    try {
      const response = await fetch("http://localhost:3000/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (data.error) { setError(`SERVER ERROR: ${data.error}`); }
      else {
        const t = data.analysis;
        const scoreMatch = t.match(/GAP SCORE:\s*(\d+)/i);
        const skillsMatch = t.match(/MISSING SKILLS:\s*([\s\S]*?)(?=SUMMARY:|$)/i);
        const summaryMatch = t.match(/SUMMARY:\s*([\s\S]*?)(?=ROADMAP_30:|$)/i);
        const rm30 = t.match(/ROADMAP_30:\s*([\s\S]*?)(?=ROADMAP_60:|$)/i);
        const rm60 = t.match(/ROADMAP_60:\s*([\s\S]*?)(?=ROADMAP_90:|$)/i);
        const rm90 = t.match(/ROADMAP_90:\s*([\s\S]*)/i);
        onResult({
          score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
          skills: skillsMatch ? skillsMatch[1].trim() : "No missing skills listed.",
          summary: summaryMatch ? summaryMatch[1].trim() : t,
          roadmap30: rm30 ? rm30[1].trim() : "Review job fundamentals.",
          roadmap60: rm60 ? rm60[1].trim() : "Build a project using missing skills.",
          roadmap90: rm90 ? rm90[1].trim() : "Prepare for interviews.",
          jobDescription: jobDescription.substring(0, 60),
        });
      }
    } catch { setError("Could not connect to backend. Is the server running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in-up stagger-children" style={{paddingTop:8}}>
      <h1 style={{fontSize:32,fontWeight:800,margin:'0 0 8px'}}>New Assessment</h1>
      <p style={{color:'var(--text-secondary)',fontSize:14,margin:'0 0 28px',lineHeight:1.6}}>
        Upload candidate documents and target profile for match analysis.
      </p>

      {/* Source Document */}
      <div style={{marginBottom:24}}>
        <h3 className="section-label">Source Document</h3>
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files[0])} style={{display:'none'}} />
          {file ? (
            <>
              <svg width="32" height="32" fill="none" stroke="var(--accent-green)" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{fontWeight:600,marginTop:8,marginBottom:4,color:'var(--accent-green)'}}>{file.name}</p>
              <p style={{color:'var(--text-muted)',fontSize:12,margin:0}}>Tap to change file</p>
            </>
          ) : (
            <>
              <svg width="32" height="32" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p style={{fontWeight:600,marginTop:12,marginBottom:4}}>Drag & drop resume here</p>
              <p style={{color:'var(--text-muted)',fontSize:13,margin:'0 0 8px'}}>or tap to browse local files</p>
              <span className="badge badge-cyan" style={{fontSize:10}}>PDF, DOCX (Max 10MB)</span>
            </>
          )}
        </div>
      </div>

      {/* Progress indicator when loading */}
      {loading && (
        <div className="progress-container" style={{marginBottom:24}}>
          <svg width="20" height="20" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" viewBox="0 0 24 24" style={{animation:'spin-slow 2s linear infinite',flexShrink:0}}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:600}}>Analyzing resume...</span>
              <span style={{fontSize:13,color:'var(--text-muted)'}}>Processing</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{width:'100%',animation:'shimmer 1.5s infinite',background:'linear-gradient(90deg,var(--accent-cyan),var(--accent-purple),var(--accent-cyan))',backgroundSize:'200% 100%'}}/>
            </div>
          </div>
        </div>
      )}

      {/* Target Requisition */}
      <div style={{marginBottom:28}}>
        <h3 className="section-label">Target Requisition</h3>
        <div className="glass-card-static" style={{padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)'}}>Job Description</span>
            <button className="btn-secondary" style={{padding:'4px 10px',fontSize:11}} onClick={() => navigator.clipboard.readText().then(t => setJobDescription(t)).catch(() => {})}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Paste text
            </button>
          </div>
          <textarea
            className="input-dark"
            rows="8"
            placeholder="Paste the complete job description, requirements, and responsibilities here. Our AI will extract key parameters automatically..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            style={{background:'var(--bg-primary)',border:'1px solid var(--border-subtle)'}}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:12,padding:14,marginBottom:20}}>
          <p style={{color:'var(--accent-red)',fontSize:13,fontWeight:600,margin:0}}>{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <button className="btn-primary" onClick={handleAnalyze} disabled={loading} style={{width:'100%',padding:'16px 24px',fontSize:16,marginBottom:32}}>
        {loading ? (
          <>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{animation:'spin-slow 1s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
            Analyzing Match...
          </>
        ) : (
          <>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
            Analyze Match
          </>
        )}
      </button>
    </div>
  );
}
