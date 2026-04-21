"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Next.js built-in router for fast page switching

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // This runs automatically as soon as the page loads!
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch("http://localhost:3000/history");
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                setHistory(data);
            } catch (err) {
                setError("Could not connect to the database. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []); // The empty array means "only run this once when the page loads"

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
        if (score >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-200";
        return "text-red-600 bg-red-100 border-red-200";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Navigation & Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Analysis History</h1>
                        <p className="mt-2 text-sm text-gray-500">Review your past resumes, scores, and 90-day roadmaps.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        &larr; Back to Analyzer
                    </Link>
                </div>

                {/* Loading / Error States */}
                {loading && <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Fetching your history from the database...</div>}

                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {!loading && !error && history.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 font-medium">You haven't analyzed any resumes yet!</p>
                    </div>
                )}

                {/* --- THE HISTORY GRID --- */}
                <div className="grid grid-cols-1 gap-6">
                    {history.map((record) => (
                        <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">

                            {/* Left Column: Score */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 bg-gray-50">
                                <div className={`text-4xl font-black ${getScoreColor(record.gapScore).split(' ')[0]}`}>
                                    {record.gapScore}%
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Match</div>
                            </div>

                            {/* Right Column: Data */}
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                        {/* We take the first 60 characters of the JD to act as a title */}
                                        Target Role: {record.jobDescription.substring(0, 60)}...
                                    </h3>
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <span className="block text-xs font-bold text-blue-800 uppercase mb-1">Missing Skills</span>
                                        <p className="text-sm text-blue-900 line-clamp-2">{record.missingSkills}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1">AI Summary</span>
                                        <p className="text-sm text-gray-600 line-clamp-2">{record.summary}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}