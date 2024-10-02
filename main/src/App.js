import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chatbot from './Chatbot'; // Adjust the path according to your project structure
import ClaimForm from './ClaimForm'; // Adjust the path according to your project structure
import mainBg from './main_bg.png'; // Import the background image

const App = () => {
  return (
    <Router>
      <div style={{ 
        backgroundImage: `url(${mainBg})`, // Set the background image
        backgroundSize: 'contain', // Keep the background image smaller
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        minHeight: '100vh', // Ensure the minimum height covers the viewport
        display: 'flex', // Use flex to align items
        flexDirection: 'column', // Align items in a column
        alignItems: 'center', // Center horizontally
        justifyContent: 'flex-start', // Align items to the top
        padding: '50px', // Add some padding
        marginRight: '50px', // Increase the right margin
        color: 'white' // Set text color for better visibility
      }}>
        <nav>
          <Link to="/" style={{ margin: '10px', color: 'white' }}>Chatbot</Link>
          <Link to="/claim" style={{ margin: '10px', color: 'white' }}>File a Claim</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/claim" element={<ClaimForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
