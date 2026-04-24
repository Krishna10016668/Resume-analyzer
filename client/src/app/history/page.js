"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/history?userId=${encodeURIComponent(user.id)}`);
        if (!res.ok) throw new Error("Network error");
        setHistory(await res.json());
      } catch { setError("Could not connect to the database. Is the backend running?"); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [user?.id]);

  const getScoreColor = (s) => s >= 80 ? "var(--accent-cyan)" : s >= 50 ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',padding:'40px 20px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <div>
            <h1 style={{fontSize:28,fontWeight:800,margin:'0 0 4px'}}>Your Analysis History</h1>
            <p style={{color:'var(--text-secondary)',fontSize:14,margin:0}}>Only showing your personal analyses.</p>
          </div>
          <Link href="/" className="btn-secondary" style={{textDecoration:'none'}}>← Back</Link>
        </div>

        {loading && <div style={{textAlign:'center',padding:60,color:'var(--text-muted)'}}>Loading...</div>}
        {error && <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:12,padding:14,marginBottom:20}}><p style={{color:'var(--accent-red)',margin:0,fontWeight:600}}>{error}</p></div>}
        {!loading && !error && history.length === 0 && <div style={{textAlign:'center',padding:60,color:'var(--text-muted)'}}>No analyses yet.</div>}

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {history.map(r => (
            <div key={r.id} className="glass-card" style={{padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <span style={{fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  {new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </span>
                <span style={{fontSize:28,fontWeight:800,color:getScoreColor(r.gapScore)}}>{r.gapScore}%</span>
              </div>
              <h3 style={{fontSize:16,fontWeight:700,margin:'0 0 8px'}}>{r.jobDescription.substring(0,80)}{r.jobDescription.length > 80 ? '...' : ''}</h3>
              <p style={{color:'var(--text-secondary)',fontSize:13,margin:'0 0 8px',lineHeight:1.6}}>{r.summary?.substring(0,120)}...</p>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>
                <strong>Missing:</strong> {r.missingSkills?.substring(0,100)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}