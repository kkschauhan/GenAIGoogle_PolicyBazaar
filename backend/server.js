// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept only PDF, JPEG, and PNG formats
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extName = fileTypes.test(file.mimetype);
        const extNameFile = fileTypes.test(file.originalname.split('.').pop().toLowerCase());

        if (extName && extNameFile) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file format. Only PDF, JPEG, and PNG are accepted.'));
        }
    }
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// API route for content generation
app.post('/api/query', async (req, res) => {
    const { prompt_0 } = req.body;

    const prompt = prompt_0 + " Don't add any extra formatting. Answer in plain text. Also answer precisely, preferably in 1 to 3 sentences.";

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const response = await model.generateContent(prompt);

        const botResponse = response.response.text(); // Adjust based on the actual response structure
        return res.json({ response: botResponse });
    } catch (error) {
        console.error('Error generating content:', error);
        const errorMessage = error.response?.data?.error?.message || 'Error generating response';
        return res.status(500).json({ error: errorMessage });
    }
});

// API route to handle claim submission
app.post('/api/claims', upload.single('uploadDocs'), (req, res) => {
    const { policyNumber, claimAmount, incidentDate, description } = req.body;
    const uploadDocs = req.file;  // Access the uploaded document

    if (!uploadDocs) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    console.log('Received claim data:', {
        policyNumber,
        claimAmount,
        incidentDate,
        description,
        uploadDocs: uploadDocs.originalname,
    });

    // Implement your own logic to store/process form data and files
    // For example, you can save files to disk or process form inputs.

    // Send a success response after processing the claim submission
    res.json({ success: true, message: 'Claim submitted successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
