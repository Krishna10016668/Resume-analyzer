"use client";
import { useState, useEffect } from "react";

export default function HistoryTab({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetchHistory = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API_URL}/history?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error("Network error");
        setHistory(await res.json());
      } catch { setError("Could not connect to database. Is the backend running?"); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [userId]);

  const filtered = history.filter(r =>
    r.jobDescription.toLowerCase().includes(search.toLowerCase()) ||
    r.summary.toLowerCase().includes(search.toLowerCase())
  );

  const ScoreRing = ({ score, size = 44 }) => {
    const r = (size - 8) / 2;
    const c = 2 * Math.PI * r;
    const color = score >= 80 ? "var(--accent-cyan)" : score >= 50 ? "var(--accent-orange)" : "var(--accent-red)";
    return (
      <div className="score-ring-container" style={{width:size,height:size}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none"/>
          <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="3" fill="none" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} strokeLinecap="round"/>
        </svg>
        <span className="score-ring-text" style={{fontSize:11,fontWeight:800}}>{score}%</span>
      </div>
    );
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in-up stagger-children" style={{paddingTop:8}}>
      <h1 style={{fontSize:32,fontWeight:800,margin:'0 0 8px'}}>Scan History</h1>
      <p style={{color:'var(--text-secondary)',fontSize:14,margin:'0 0 24px',lineHeight:1.6}}>
        Review past curriculum vitae analysis, alignment scores, and expert recommendations.
      </p>

      {/* Search */}
      <div style={{position:'relative',marginBottom:12}}>
        <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="search-bar" placeholder="Search by role or company..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filters button */}
      <button style={{width:'100%',background:'var(--bg-secondary)',border:'1px solid var(--border-card)',borderRadius:12,padding:'10px 16px',color:'var(--text-secondary)',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:24,transition:'all 0.2s'}}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
        FILTERS
      </button>

      {/* States */}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>Loading history...</div>}
      {error && <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:12,padding:14}}><p style={{color:'var(--accent-red)',fontSize:13,fontWeight:600,margin:0}}>{error}</p></div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>
          <svg width="48" height="48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24" style={{marginBottom:12,opacity:0.5}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p style={{fontWeight:600}}>No analysis found</p>
          <p style={{fontSize:13}}>Run your first scan to see results here.</p>
        </div>
      )}

      {/* History Cards */}
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {filtered.map((record, i) => (
          <div key={record.id} className="history-card animate-fade-in-up" style={{animationDelay:`${i * 0.05}s`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',color:'var(--text-muted)'}}>
                  {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </span>
                <h3 style={{fontSize:18,fontWeight:700,margin:'8px 0 4px',lineHeight:1.3}}>
                  {record.jobDescription.substring(0, 45)}{record.jobDescription.length > 45 ? '...' : ''}
                </h3>
                <div style={{display:'flex',alignItems:'center',gap:6,color:'var(--text-muted)',fontSize:12,marginTop:8}}>
                  <span className="badge badge-green" style={{fontSize:10,padding:'2px 8px'}}>● Analyzed</span>
                </div>
              </div>
              <ScoreRing score={record.gapScore} />
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
              <button onClick={() => toggleExpand(record.id)} style={{background:'none',border:'none',color:'var(--accent-cyan)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,padding:0}}>
                {expandedId === record.id ? 'HIDE REPORT' : 'VIEW REPORT'} <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={expandedId === record.id ? "M18 15l-6-6-6 6" : "M5 12h14M12 5l7 7-7 7"}/></svg>
              </button>
            </div>

            {/* Expanded Report */}
            {expandedId === record.id && (
              <div className="animate-fade-in" style={{marginTop:16,paddingTop:16,borderTop:'1px solid var(--border-card)'}}>
                {/* Summary */}
                <div style={{marginBottom:16}}>
                  <h4 style={{fontSize:13,fontWeight:700,color:'var(--accent-cyan)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>AI Summary</h4>
                  <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.7,margin:0}}>{record.summary}</p>
                </div>

                {/* Missing Skills */}
                <div style={{marginBottom:16}}>
                  <h4 style={{fontSize:13,fontWeight:700,color:'var(--accent-orange)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Missing Skills</h4>
                  <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.7,margin:0,whiteSpace:'pre-wrap'}}>{record.missingSkills}</p>
                </div>

                {/* Roadmap */}
                <div>
                  <h4 style={{fontSize:13,fontWeight:700,color:'var(--accent-purple)',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.05em'}}>30-60-90 Day Roadmap</h4>
                  <div className="timeline">
                    <div className="timeline-item">
                      <span style={{fontSize:12,fontWeight:700,color:'var(--accent-cyan)'}}>Days 0-30</span>
                      <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'4px 0 0'}}>{record.roadmap30}</p>
                    </div>
                    <div className="timeline-item">
                      <span style={{fontSize:12,fontWeight:700,color:'var(--accent-purple)'}}>Days 30-60</span>
                      <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'4px 0 0'}}>{record.roadmap60}</p>
                    </div>
                    <div className="timeline-item">
                      <span style={{fontSize:12,fontWeight:700,color:'var(--accent-green)'}}>Days 60-90</span>
                      <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:'4px 0 0'}}>{record.roadmap90}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{height:32}}/>
    </div>
  );
}
