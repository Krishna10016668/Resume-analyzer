"use client";
import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import BottomNav from "./components/BottomNav";
import HomeTab from "./components/HomeTab";
import ScanTab from "./components/ScanTab";
import HistoryTab from "./components/HistoryTab";
import ProfileTab from "./components/ProfileTab";
import ResultsView from "./components/ResultsView";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [result, setResult] = useState(null);

  const TopBar = () => (
    <div className="top-bar">
      <div className="top-bar-title">
        {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <span style={{width:28,height:28,borderRadius:'50%',background:'var(--bg-card)',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>}
        <span>Expert Analyzer</span>
      </div>
    </div>
  );

  const showResults = (data) => { setResult(data); setActiveTab("results"); };
  const userId = user?.id || "";

  return (
    <div className="app-shell" style={{minHeight:'100vh',paddingBottom:'var(--nav-height)',position:'relative'}}>
      <div style={{padding:'0 20px'}}>
        <TopBar />
        {activeTab === "home" && <HomeTab isSignedIn={isSignedIn} onNavigate={setActiveTab} />}
        {activeTab === "scan" && <ScanTab userId={userId} onResult={showResults} />}
        {activeTab === "results" && <ResultsView result={result} onBack={() => setActiveTab("scan")} onSave={() => setActiveTab("history")} />}
        {activeTab === "history" && <HistoryTab userId={userId} />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}