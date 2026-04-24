"use client";
export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "home", label: "HOME", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
    { id: "scan", label: "NEW SCAN", icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></> },
    { id: "history", label: "HISTORY", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
    { id: "profile", label: "PROFILE", icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-item ${active === t.id || (active === "results" && t.id === "scan") ? "active" : ""}`} onClick={() => onChange(t.id)} style={{background:'none',border:'none'}}>
          <div className="nav-icon-wrap">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{t.icon}</svg>
          </div>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
