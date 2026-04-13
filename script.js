// 1. Find the elements on the page using their ID's
const analyzeBtn = document.getElementById('analyzeBtn');
const resumeUpload = document.getElementById('resumeUpload');
const JobDescription = document.getElementById('JobDescription');

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
    analyzeBtn.innerText = "Sending to Server...";
    analyzeBtn.style.backgroundColor = "#e67e22";
    analyzeBtn.disabled = true;

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
            // 4. Show the server's reply in a popup!
            alert(`${data.message}\n\n we successfully extracted ${data.extractedResumeLength} characters from your PDF!`);

            // Reset the button
            analyzeBtn.innerText = "Analyze Gap";
            analyzeBtn.style.backgroundColor = "#3498db";
            analyzeBtn.disabled = false;
        })
        .catch(error => {
            console.error("Network Error:", error);
            alert("Could not connected to the backend server. Is it running?");

            //Reset the button 
            analyzeBtn.innerText = "Analyze Gap";
            analyzeBtn.style.backgroundColor = "#3498db";
            analyzeBtn.disabled = false;
        });
});