"use client";
import { SignInButton } from "@clerk/nextjs";

export default function HomeTab({ isSignedIn, onNavigate }) {
  return (
    <div className="animate-fade-in-up stagger-children" style={{paddingTop:8}}>
      {/* Badge */}
      <div style={{marginBottom:32}}>
        <span className="badge badge-cyan">
          <span style={{width:8,height:8,borderRadius:'50%',background:'var(--accent-cyan)',display:'inline-block'}}></span>
          Dual-Engine Core Active
        </span>
      </div>

      {/* Hero */}
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:40,fontWeight:800,lineHeight:1.1,letterSpacing:'-0.02em',margin:0}}>
          Land Your Dream Job with{" "}
          <span className="text-gradient-cyan">Dual-Engine AI.</span>
        </h1>
        <p style={{color:'var(--text-secondary)',fontSize:15,lineHeight:1.7,marginTop:16,maxWidth:380}}>
          Personalized 30-60-90 day technical roadmaps generated in seconds.
          Elevate your profile with mathematical precision and expert-level gap analysis.
        </p>
      </div>

      {/* Auth Button */}
      <div style={{marginBottom:12}}>
        {isSignedIn ? (
          <button className="btn-google" onClick={() => onNavigate("scan")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Start New Scan →
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="btn-google">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google →
            </button>
          </SignInButton>
        )}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,color:'var(--text-muted)',fontSize:12,marginBottom:40}}>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Secure Clerk Auth
      </div>

      {/* Preview Card */}
      <div className="glass-card" style={{padding:24,marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <h3 style={{fontSize:22,fontWeight:700,margin:'0 0 4px'}}>Role Match Analysis</h3>
            <p style={{color:'var(--text-muted)',fontSize:13,margin:0}}>Target: Sr. Data Engineer</p>
          </div>
          {/* Mini Score Ring */}
          <div className="score-ring-container" style={{width:52,height:52}}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none"/>
              <circle cx="26" cy="26" r="22" stroke="var(--accent-cyan)" strokeWidth="4" fill="none" strokeDasharray="138" strokeDashoffset={138 - (138 * 92) / 100} strokeLinecap="round"/>
            </svg>
            <span className="score-ring-text" style={{fontSize:13,fontWeight:800}}>92%</span>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="timeline" style={{marginTop:20}}>
          <div className="timeline-item">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:14}}>Day 0-30: Foundation Gap</span>
              <span className="badge badge-red" style={{padding:'2px 8px',fontSize:10}}>Critical</span>
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:13,margin:0}}>Master distributed systems architecture patterns.</p>
          </div>
          <div className="timeline-item">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:14}}>Day 30-60: Implementation</span>
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:13,margin:0}}>Build custom Spark pipelines focusing on fault tolerance.</p>
          </div>
        </div>
      </div>

      {/* Speed Badge */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:32}}>
        <span className="badge badge-green" style={{fontSize:10}}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Processing Speed: 1.2s per resume
        </span>
      </div>
    </div>
  );
}
