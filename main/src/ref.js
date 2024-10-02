import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Set to true to make the chatbot window visible by default for testing

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const prompt = userInput.trim();

    if (!prompt) {
      return; // Don't submit if input is empty
    }

    await sendQuery(prompt);
  };

  const sendQuery = async (prompt) => {
    try {
      const response = await axios.post('http://localhost:5000/api/query', {
        prompt: prompt,
      });

      // First display the user's message, then the bot's response
      setResponses((prevResponses) => [
        ...prevResponses,
        { user: prompt, bot: response.data.response },
      ]);
      setUserInput('');
    } catch (error) {
      console.error('Error communicating with the AI:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong, try again.';
      setResponses((prevResponses) => [
        ...prevResponses,
        { user: prompt, bot: errorMessage },
      ]);
    }
  };

  const handleButtonClick = (query) => {
    const prompts = {
      'Get a Quote': 'I would like to get a quote.',
      'Check Policy Details': 'I want to check my policy details.',
      'Renew Policy': 'I would like to renew my policy.',
      'File a Claim': 'I want to file a claim.',
      'Talk to a Human Agent': 'I would like to talk to a human agent.',
    };

    const prompt = prompts[query];
    if (prompt) {
      sendQuery(prompt);
    }
  };

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  const styles = {
    chatbotWrapper: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
    },
    chatbotIcon: {
      cursor: 'pointer',
      fontSize: '2rem',
      backgroundColor: '#4CAF50', // Reverted background color for the emoji icon
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50px',
      height: '50px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    chatbotContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      width: '350px', // Original width
      height: '600px', // Increased height
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      marginTop: '10px',
    },
    chatbotHeader: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold',
      borderRadius: '8px 8px 0 0',
    },
    greetingMessage: {
      margin: '10px',
      fontSize: '14px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      marginTop: '10px',
      width: '100%', // Full width of the message
    },
    commonQueryButton: {
      backgroundColor: '#008CBA',
      color: 'white',
      border: 'none',
      padding: '8px',
      borderRadius: '20px', // Increased border radius for more rounded corners
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      width: '100%', // Set width to full
    },
    commonQueryButtonHover: {
      backgroundColor: '#005f6b',
    },
    chatbotBody: {
      flexGrow: 1,
      padding: '10px',
      overflowY: 'auto',
      height: '450px', // Increased height for more scrollable area
    },
    chatMessage: {
      marginBottom: '10px',
    },
    userMessage: {
      backgroundColor: '#C1E1C1', // Updated background color for user messages
      borderRadius: '10px',
      padding: '10px',
      marginLeft: '40px',
      textAlign: 'right',
      fontSize: '14px',
      marginBottom: '10px',
    },
    botMessage: {
      backgroundColor: '#dffaff', // Updated background color for bot messages
      borderRadius: '10px',
      padding: '10px',
      marginRight: '40px',
      textAlign: 'left',
      fontSize: '14px',
      marginBottom: '10px',
    },
    chatbotForm: {
      display: 'flex',
      borderTop: '1px solid #ddd',
    },
    chatbotInput: {
      flexGrow: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '4px 0 0 4px',
      outline: 'none',
    },
    chatbotSubmit: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.chatbotWrapper}>
      {/* Chat Icon */}
      <div style={styles.chatbotIcon} onClick={toggleChatWindow}>
        <span role="img" aria-label="Chatbot" className="emoji-icon">
          🤖
        </span>
      </div>

      {isOpen && (
        <div style={styles.chatbotContainer}>
          <div style={styles.chatbotHeader}>Chat with Our AI</div>

          {/* Greeting Message with Buttons */}
          <div style={styles.greetingMessage}>
            <div style={styles.botMessage}>
              Hi! I am ILA, your Interactive Live Assistant. How may I help you today?
            </div>
            <div style={styles.buttonsContainer}>
              {['Get a Quote', 'Check Policy Details', 'Renew Policy', 'File a Claim', 'Talk to a Human Agent'].map((query) => (
                <button
                  key={query}
                  style={styles.commonQueryButton}
                  onClick={() => handleButtonClick(query)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.commonQueryButtonHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.commonQueryButton.backgroundColor}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Body */}
          <div style={styles.chatbotBody}>
            {responses.map((response, index) => (
              <div key={index} style={styles.chatMessage}>
                <div style={styles.userMessage}>{response.user}</div>
                <div style={styles.botMessage}>{response.bot}</div>
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form style={styles.chatbotForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              style={styles.chatbotInput}
              placeholder="Type your message..."
            />
            <button type="submit" style={styles.chatbotSubmit}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
