// 1. Find the elements on the page using their ID's
const analyzeBtn = document.getElementById('analyzeBtn');
const resumeUpload = document.getElementById('resumeUpload');
const JobDescription = document.getElementById('JobDescription');

// ---> ADDED THIS LINE: We must define resultBox so JavaScript knows what to hide/show! <---
// UPDATE 11: Defined the resultBox variable so JavaScript doesn't crash when trying to manipulate the UI.
const resultBox = document.getElementById('resultBox');

// 2. Tell the button what to do when clicked
analyzeBtn.addEventListener('click', () => {

    //Grab the actual text the user typed into the box
    const jdText = JobDescription.value;

    //Grab the file they uploaded (the [0] gets the first file)
    const file = resumeUpload.files[0];

    //3. Basic Validation: Make sure they actually gave us data
    if (!file) {
        alert("Hold on! Please upload a PDF resume first.");
        return; //stops the code from continuing
    }
    if (!jdText.trim()) {
        alert("Hold on! Please paste a job Description.");
        return; //this stops the code from continuing
    }

    // Change the button state
    analyzeBtn.innerText = "Analyzing Gap...";
    analyzeBtn.style.backgroundColor = "#e67e22";
    analyzeBtn.disabled = true;

    // Hide the box and reset text while thinking
    resultBox.style.display = 'none';
    resultBox.style.color = "black";

    // 1. Create a FormData object (like a digital envelope) to hold our file and text
    const formData = new FormData();
    formData.append('resume', file); // The label 'resume' MUST match what the server expects
    formData.append('jobDescription', jdText);

    // 2. Throw the envelope to our backend server
    fetch('http://localhost:3000/analyze', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json()) // 3. Catch the server's reply
        .then(data => {
            // FIX: Check if the server sent an error!
            // UPDATE 13: Added logic to catch soft 500 errors sent by our backend.
            if (data.error) {
                // If it's an error, print the exact diagnostic message in red text on the screen.
                resultBox.innerText = "SERVER ERROR: " + data.error;
                resultBox.style.color = "red"; // Make errors red
            } else {
                // UPDATE 15: If successful, inject the beautiful AI report dynamically into the page (no more pop-ups).
                resultBox.innerText = data.analysis;
                resultBox.style.color = "black";
            }

            //Make the box visible
            resultBox.style.display = 'block';

            // Reset the button
            analyzeBtn.innerText = "Analyze Gap";
            analyzeBtn.style.backgroundColor = "#3498db";
            analyzeBtn.disabled = false;
        })
        .catch(error => {
            console.error("Network Error:", error);
            // Created a fallback UI state if the server is completely offline or dead.
            resultBox.innerText = "CRITICAL ERROR: Could not connect to backend.";
            resultBox.style.display = 'block';
            resultBox.style.color = "red";

            //Reset the button 
            analyzeBtn.innerText = "Analyze Gap";
            analyzeBtn.style.backgroundColor = "#3498db";
            analyzeBtn.disabled = false;
        });
});