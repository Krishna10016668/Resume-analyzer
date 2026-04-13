// 1. Import all the necessary tools 
const express = require('express'); //The server itself.
const cors = require('cors'); //A security bouncer that allows your HTML page to legally talk to your new server.
const multer = require('multer'); //Tool to catch uploaded files 
const path = require('path');

const pdf = require('pdf-parse');   // Tool to extract text from PDFs (v1.1.1)

// 2. Initialize the server
const app = express();
const PORT = 3000;

// 3. Set up Milddlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 4. Configure Multer to store the uploaded PDF temorarily in the computer's memory
const upload = multer({ storage: multer.memoryStorage() });

// 5. Create the exact route where the frontend will send the data
// 'upload.single('resume')' tells the server to expect a file labeled 'resume'
app.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        //Grab the text of the Job description from the request
        const jobDescription = req.body.jobDescription;

        //Grab the actual uploaded PDF file
        const pdfFile = req.file;

        //Validation: if either is missing , send an error back
        if (!pdfFile || !jobDescription) {
            return res.status(400).send("Error: Missing resume or job description.");
        }

        // 6.Use  pdf-parse to read the raw data of the pdf and turn it into text
        const pdfData = await pdf(pdfFile.buffer);
        const resumeText = pdfData.text;

        // 7. Send a success message back to the webpage proving we read it!
        res.json({
            message: "Success! The backend recieved and read your PDF.",
            extractedResumeLength: resumeText.length,
            extractedJdLength: jobDescription.length
        });
    }
    catch (error) {
        console.error("Oops, error reading PDF:", error);
        res.status(500).json({ message: "Internal Server Error. Could not read PDF." });
    }
});

//Turn the server on
app.listen(PORT, () => {
    console.log(`Backend Server is ready to catch file on http://localhost:${PORT}`);
});