"use client";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import BottomNav from "./components/BottomNav";
import HomeTab from "./components/HomeTab";
import ScanTab from "./components/ScanTab";
import HistoryTab from "./components/HistoryTab";
import ProfileTab from "./components/ProfileTab";
import ResultsView from "./components/ResultsView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [activeTab, setActiveTab] = useState("home");
  const [result, setResult] = useState(null);

  // If user signs out while on a protected tab, redirect to home
  useEffect(() => {
    if (isLoaded && !isSignedIn && activeTab !== "home") {
      setActiveTab("home");
    }
  }, [isLoaded, isSignedIn, activeTab]);

  const handleNavigate = (tab) => {
    const protectedTabs = ["scan", "history", "profile", "results"];
    if (protectedTabs.includes(tab) && !isSignedIn) {
      if (openSignIn) {
        openSignIn();
      }
      return;
    }
    setActiveTab(tab);
  };

  const handleRequireAuth = (tabName) => {
    if (openSignIn) {
      openSignIn();
    }
  };

  const showResults = (data) => {
    setResult(data);
    setActiveTab("results");
  };

  const userId = user?.id || "";

  const TopBar = () => (
    <div className="top-bar">
      <div className="top-bar-title" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveTab("home")}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070b14',
          fontWeight: 800,
          fontSize: 14,
        }}>
          EA
        </div>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Expert Analyzer</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isLoaded ? (
          isSignedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'none', smDisplay: 'inline' }}>
                {user.firstName || user.fullName || "Account"}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SignInButton mode="modal">
                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>
                  Log In
                </button>
              </SignInButton>
            </div>
          )
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-card)', animation: 'pulse 1.5s infinite' }} />
        )}
      </div>
    </div>
  );

  return (
    <div className="app-shell" style={{ minHeight: '100vh', paddingBottom: 'var(--nav-height)', position: 'relative' }}>
      <div style={{ padding: '0 20px' }}>
        <TopBar />

        {/* Loading state before Clerk is ready */}
        {!isLoaded && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <svg width="24" height="24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin-slow 1.5s linear infinite', marginBottom: 12 }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
            <p style={{ fontSize: 14 }}>Authenticating...</p>
          </div>
        )}

        {/* Loaded State */}
        {isLoaded && (
          <>
            {activeTab === "home" && (
              <HomeTab isSignedIn={isSignedIn} onNavigate={handleNavigate} />
            )}

            {/* Protected: Scan Tab */}
            {activeTab === "scan" && (
              isSignedIn ? (
                <ScanTab userId={userId} onResult={showResults} />
              ) : (
                <AuthRequiredGate onLogin={() => openSignIn && openSignIn()} tabName="Resume Assessment" />
              )
            )}

            {/* Protected: Results View */}
            {activeTab === "results" && (
              isSignedIn ? (
                <ResultsView result={result} onBack={() => setActiveTab("scan")} onSave={() => setActiveTab("history")} />
              ) : (
                <AuthRequiredGate onLogin={() => openSignIn && openSignIn()} tabName="Assessment Results" />
              )
            )}

            {/* Protected: History Tab */}
            {activeTab === "history" && (
              isSignedIn ? (
                <HistoryTab userId={userId} />
              ) : (
                <AuthRequiredGate onLogin={() => openSignIn && openSignIn()} tabName="Scan History" />
              )
            )}

            {/* Protected: Profile Tab */}
            {activeTab === "profile" && (
              isSignedIn ? (
                <ProfileTab />
              ) : (
                <AuthRequiredGate onLogin={() => openSignIn && openSignIn()} tabName="User Profile" />
              )
            )}
          </>
        )}
      </div>

      <BottomNav
        active={activeTab}
        onChange={handleNavigate}
        isSignedIn={isSignedIn}
        onRequireAuth={handleRequireAuth}
      />
    </div>
  );
}

// Fallback visual card if directly on a protected tab while unauthenticated
function AuthRequiredGate({ onLogin, tabName }) {
  return (
    <div className="glass-card animate-fade-in-up" style={{ padding: '36px 24px', textAlign: 'center', marginTop: 40, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(6, 182, 212, 0.12)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-cyan)',
        marginBottom: 16
      }}>
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Login Required</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
        You must be signed in to access <strong>{tabName}</strong> and unlock dual-engine AI assessment features.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
        <SignInButton mode="modal">
          <button className="btn-primary" style={{ width: '100%', padding: '12px 20px', fontSize: 14 }}>
            Sign In to Continue
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn-secondary" style={{ width: '100%', padding: '12px 20px', fontSize: 14, justifyContent: 'center' }}>
            Create Account
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}