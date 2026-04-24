"use client";

export default function ResultsView({ result, onBack, onSave }) {
  if (!result) return null;
  const score = result.score;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (circumference * score) / 100;
  const scoreColor = score >= 80 ? "var(--accent-cyan)" : score >= 50 ? "var(--accent-orange)" : "var(--accent-red)";
  const scoreLabel = score >= 80 ? "Highly Compatible" : score >= 50 ? "Moderate Match" : "Needs Improvement";

  // Parse skills into list items
  const skillsList = result.skills.split(/\n|,|•|·|-(?=\s)|\d+\.\s/).map(s => s.trim()).filter(s => s.length > 3);

  return (
    <div className="animate-fade-in-up stagger-children" style={{paddingTop:8}}>
      {/* Header */}
      <div style={{marginBottom:4}}>
        <h1 style={{fontSize:28,fontWeight:800,margin:'0 0 4px'}}>Analysis Complete</h1>
        <p style={{color:'var(--text-muted)',fontSize:13,margin:0}}>{result.jobDescription || "Resume Analysis"}</p>
      </div>

      {/* Action Buttons */}
      <div style={{display:'flex',gap:10,marginBottom:28,marginTop:16}}>
        <button className="btn-secondary" style={{fontSize:12,padding:'8px 14px'}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share
        </button>
        <button className="btn-secondary" onClick={onSave} style={{fontSize:12,padding:'8px 14px',background:'rgba(249,115,22,0.1)',color:'var(--accent-orange)',borderColor:'rgba(249,115,22,0.2)'}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
          Save to History
        </button>
      </div>

      {/* Score Ring */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:32}}>
        <div className="score-ring-container" style={{width:160,height:160,marginBottom:16}}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none"/>
            <circle cx="80" cy="80" r="70" stroke={scoreColor} strokeWidth="8" fill="none"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              style={{transition:'stroke-dashoffset 1.5s ease-out',filter:`drop-shadow(0 0 8px ${scoreColor}40)`}}/>
          </svg>
          <div className="score-ring-text">
            <span style={{fontSize:40,fontWeight:800}}>{score}%</span>
            <p style={{fontSize:11,color:'var(--text-muted)',margin:0,fontWeight:600}}>Match</p>
          </div>
        </div>
        <span style={{fontSize:18,fontWeight:700,color:scoreColor}}>{scoreLabel}</span>
        <p style={{color:'var(--text-secondary)',fontSize:13,textAlign:'center',maxWidth:280,marginTop:4}}>
          Strong alignment in core design systems and strategic leadership.
        </p>
      </div>

      {/* Semantic Match Summary */}
      <div className="glass-card-static" style={{padding:20,marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <h3 style={{fontSize:16,fontWeight:700,margin:0}}>Semantic Match Summary</h3>
        </div>
        <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.7,margin:0}}>{result.summary}</p>
      </div>

      {/* Skill Gaps */}
      <div className="glass-card-static" style={{padding:20,marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <svg width="18" height="18" fill="none" stroke="var(--accent-orange)" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <h3 style={{fontSize:16,fontWeight:700,margin:0}}>Skill Gaps Identified</h3>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {skillsList.slice(0, 5).map((skill, i) => (
            <div key={i} style={{background:'var(--bg-secondary)',border:'1px solid var(--border-subtle)',borderRadius:10,padding:'10px 14px'}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 30-60-90 Roadmap */}
      <div className="glass-card-static" style={{padding:20,marginBottom:32}}>
        <h3 style={{fontSize:16,fontWeight:700,margin:'0 0 16px'}}>30-60-90 Day Technical Roadmap</h3>
        <div className="timeline">
          <div className="timeline-item">
            <span className="badge badge-cyan" style={{fontSize:10,padding:'2px 8px',marginBottom:6}}>First 30 Days: The Foundation</span>
            <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'6px 0 0'}}>{result.roadmap30}</p>
          </div>
          <div className="timeline-item">
            <span className="badge badge-purple" style={{fontSize:10,padding:'2px 8px',marginBottom:6}}>60 Days: Integration</span>
            <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'6px 0 0'}}>{result.roadmap60}</p>
          </div>
          <div className="timeline-item">
            <span className="badge badge-green" style={{fontSize:10,padding:'2px 8px',marginBottom:6}}>90 Days: Strategic Impact</span>
            <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'6px 0 0'}}>{result.roadmap90}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
