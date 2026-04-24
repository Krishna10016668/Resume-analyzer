"use client";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function ProfileTab() {
  return (
    <div className="animate-fade-in-up" style={{paddingTop:8}}>
      <h1 style={{fontSize:32,fontWeight:800,margin:'0 0 8px'}}>Profile</h1>
      <p style={{color:'var(--text-secondary)',fontSize:14,margin:'0 0 24px',lineHeight:1.6}}>
        Manage your account settings and preferences.
      </p>
      <div style={{borderRadius:16,overflow:'hidden'}}>
        <UserProfile
          routing="hash"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#06b6d4',
              colorBackground: '#111827',
              colorText: '#f1f5f9',
              colorTextSecondary: '#94a3b8',
              colorInputBackground: '#0d1221',
              colorInputText: '#f1f5f9',
              borderRadius: '12px',
            },
            elements: {
              rootBox: { width: '100%' },
              card: { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' },
              navbar: { background: '#0d1221', borderRight: '1px solid rgba(255,255,255,0.08)' },
              navbarButton: { color: '#94a3b8' },
              headerTitle: { color: '#f1f5f9' },
              headerSubtitle: { color: '#94a3b8' },
              profileSectionTitle: { color: '#f1f5f9' },
              profileSectionTitleText: { color: '#f1f5f9' },
              profileSectionContent: { color: '#94a3b8' },
              profileSectionPrimaryButton: { color: '#06b6d4' },
              formFieldLabel: { color: '#f1f5f9' },
              formFieldInput: { background: '#0d1221', color: '#f1f5f9', borderColor: 'rgba(255,255,255,0.08)' },
              formButtonPrimary: { background: '#06b6d4', color: '#070b14' },
              breadcrumbsItem: { color: '#94a3b8' },
              breadcrumbsItemDivider: { color: '#64748b' },
              accordionTriggerButton: { color: '#94a3b8' },
              badge: { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' },
              userPreviewMainIdentifier: { color: '#f1f5f9' },
              userPreviewSecondaryIdentifier: { color: '#94a3b8' },
            }
          }}
        />
      </div>
    </div>
  );
}
