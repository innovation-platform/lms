// src/Home/components/ChatbotComponent.jsx
import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaRobot } from "react-icons/fa";
import { CHATBOT_THEME, CHATBOT_STEPS } from '../../constants/chatbotConstants';
import '../../styles/ChatbotComponent.css';

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = ({ value }) => {
    navigate(value);
  };

  const steps = CHATBOT_STEPS(handleNavigation);

  return (
    <div>
      {showChatbot && (
        <ThemeProvider theme={CHATBOT_THEME}>
          <ChatBot 
            steps={steps} 
            floating={true} 
            opened={true} 
            headerTitle="Loan Assistant" 
          />
        </ThemeProvider>
      )}

      <Button
        variant="primary"
        className="chatbot-button"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <FaRobot size={25} />
      </Button>
    </div>
  );
};

export default ChatbotComponent;
