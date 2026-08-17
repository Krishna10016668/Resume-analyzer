"use client";
export default function BottomNav({ active, onChange, isSignedIn, onRequireAuth }) {
  const tabs = [
    { id: "home", label: "HOME", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>, requiresAuth: false },
    { id: "scan", label: "NEW SCAN", icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></>, requiresAuth: true },
    { id: "history", label: "HISTORY", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, requiresAuth: true },
    { id: "profile", label: "PROFILE", icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>, requiresAuth: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.requiresAuth && !isSignedIn) {
      if (onRequireAuth) {
        onRequireAuth(tab.id);
      }
      return;
    }
    onChange(tab.id);
  };

  return (
    <nav className="bottom-nav">
      {tabs.map(t => {
        const isLocked = t.requiresAuth && !isSignedIn;
        const isActive = active === t.id || (active === "results" && t.id === "scan");

        return (
          <button
            key={t.id}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => handleTabClick(t)}
            style={{ background: 'none', border: 'none', position: 'relative' }}
            title={isLocked ? "Sign in to access " + t.label : t.label}
          >
            <div className="nav-icon-wrap" style={{ position: 'relative' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {t.icon}
              </svg>
              {isLocked && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 13,
                  height: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                }}>
                  <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a4 4 0 00-4 4v4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v4h-4V6z"/>
                  </svg>
                </span>
              )}
            </div>
            <span className="nav-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
