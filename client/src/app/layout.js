import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Expert Analyzer — AI Resume & JD Match Engine",
  description: "Dual-engine AI resume analyzer with personalized 30-60-90 day technical roadmaps. Elevate your profile with mathematical precision and expert-level gap analysis.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#06b6d4',
          colorBackground: '#111827',
          colorText: '#f1f5f9',
          borderRadius: '12px',
        },
      }}
    >
      <html lang='en' className={inter.variable}>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}