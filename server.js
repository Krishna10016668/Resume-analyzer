// 1. Modern Imports
// UPDATE 1: Migrated from old 'require()' syntax to modern ES Modules ('import').
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';

// UPDATE 2: Fixed the notorious Windows crash bug by explicitly targeting the library's root function file
import pdf from 'pdf-parse/lib/pdf-parse.js';

// UPDATE 3: Imported path tools to rebuild '__dirname', which doesn't exist natively in modern ESM.
import path from 'path';
import { fileURLToPath } from 'url';

// 2. Import the Vercel AI SDK (Removed 'fallback' since we are building our own!)
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { PrismaClient } from '@prisma/client';

// ESM equivalent of __dirname
// UPDATE 4: Reconstructed __dirname to allow the server to locate your frontend files.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the server
const app = express();
const PORT = 3000;

// Turn on the database connection
const prisma = new PrismaClient({ url: process.env.DATABASE_URL });

// UPDATE 5: Instructed the server to actually host your HTML, CSS, and JS files to the browser.
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const upload = multer({ storage: multer.memoryStorage() });

// 3. Setup Groq
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        const jobDescription = req.body.jobDescription;
        const userId = req.body.userId || '';
        const pdfFile = req.file;

        if (!pdfFile || !jobDescription) {
            return res.status(400).json({ error: "Missing resume or job description." });
        }

        // Extract PDF Text
        let resumeText = "";
        try {
            const pdfData = await pdf(pdfFile.buffer);
            resumeText = pdfData.text;
        } catch (error) {
            return res.status(500).json({ error: "Could not read PDF." });
        }

        const prompt = `
           You are an expert technical recruiter and Applicant Tracking System (ATS).
            Review the following Resume against the provided Job Description.
            
            Provide your response in this strict format:
            GAP SCORE: [Give a percentage from 0 to 100]
            MISSING SKILLS: [List 3 to 5 key skills missing from the resume but required by the JD]
            SUMMARY: [A 2-sentence explanation of why you gave this score]
            ROADMAP_30: [1-2 sentences on what to learn or do in the first 30 days to bridge the gap]
            ROADMAP_60: [1-2 sentences on what to build or practice in days 31-60]
            ROADMAP_90: [1-2 sentences on how to prepare for interviews for this role by day 90]

            RESUME TEXT: 
            ${resumeText}

            JOB DESCRIPTION:
            ${jobDescription}
        `;

        let finalAnalysis = "";

        // 4. MANUAL FAILOVER ENGINE
        // UPDATE 6: Built a custom 'try...catch' failover engine.
        try {
            console.log(" Attempting primary AI (Google Gemini)...");
            const { text } = await generateText({
                model: google('gemini-2.0-flash'), // Primary Brain
                prompt: prompt,
            });
            finalAnalysis = text;
            console.log(" Gemini succeeded!");

        } catch (geminiError) {
            console.warn(" Gemini failed! Switching to backup AI (Groq Llama 3)...");

            // If Gemini crashes, it jumps straight here and Groq takes over instantly
            const { text } = await generateText({
                model: groq('llama-3.3-70b-versatile'), // Backup Brain
                prompt: prompt,
            });
            finalAnalysis = text;
            console.log(" Groq succeeded!");
        }

        // Extract the data and save it to our SQlite database!
        try {
            const scoreMatch = finalAnalysis.match(/GAP SCORE:\s*(\d+)/i);
            const skillsMatch = finalAnalysis.match(/MISSING SKILLS:\s*([\s\S]*?)(?=SUMMARY:|$)/i);
            const summaryMatch = finalAnalysis.match(/SUMMARY:\s*([\s\S]*?)(?=ROADMAP_30:|$)/i);
            const rm30Match = finalAnalysis.match(/ROADMAP_30:\s*([\s\S]*?)(?=ROADMAP_60:|$)/i);
            const rm60Match = finalAnalysis.match(/ROADMAP_60:\s*([\s\S]*?)(?=ROADMAP_90:|$)/i);
            const rm90Match = finalAnalysis.match(/ROADMAP_90:\s*([\s\S]*)/i);

            await prisma.analysis.create({
                data: {
                    userId: userId,
                    jobDescription: jobDescription,
                    gapScore: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                    missingSkills: skillsMatch ? skillsMatch[1].trim() : "None listed.",
                    summary: summaryMatch ? summaryMatch[1].trim() : "No summary",
                    roadmap30: rm30Match ? rm30Match[1].trim() : "Pending",
                    roadmap60: rm60Match ? rm60Match[1].trim() : "Pending",
                    roadmap90: rm90Match ? rm90Match[1].trim() : "Pending",
                }
            });
            console.log("Successfully saved analysis to database!");
        }
        catch (dbError) {
            console.error("Failed to save to database , but returning AI results anyway:", dbError);
        }

        // 5. Send the winning analysis back to the webpage
        res.json({
            message: "Success",
            analysis: finalAnalysis
        });

    } catch (error) {
        console.error("Total AI Failure:", error);
        res.status(500).json({ error: `Both primary and backup AIs failed: ${error.message}` });
    }
});

// NEW: Fetch past analyses from the database
app.get('/history', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }
        const pastAnalyses = await prisma.analysis.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        res.json(pastAnalyses);
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({ error: "Failed to fetch history." });
    }
});

// Global error handlers — prevent silent crashes
// Added global crash protections to prevent the server from dying silently in production.
process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error(' Uncaught Exception:', err);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(` High-Availability AI Server running on http://localhost:${PORT}`);
});

// UPDATE 10: Added a specific check for "Port Already in Use" errors to guide you if the server is stuck.
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(` Port ${PORT} is already in use! Kill the old process or use a different port.`);
    } else {
        console.error(' Server error:', err);
    }
    process.exit(1);
});