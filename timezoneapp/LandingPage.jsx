import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { getSelectedConfigurations } from "../services/dynamoService";
import spookfishLogo from "../assets/spookfish@2x.png";
import { useNavigate } from "react-router-dom";
// Import icons
import { RiDashboardLine, RiFlightTakeoffLine, 
         RiLineChartLine, RiRoadMapLine } from 'react-icons/ri';
import { GiGolfFlag } from 'react-icons/gi';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { FaFlagCheckered } from 'react-icons/fa';

const LandingPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleDisplaySelect = async (displayType, displayName) => {
    setMessage(""); // Clear previous messages
    setActiveButton(displayType);
    
    try {
      const displayExt = `${displayType}-display`;
      console.log(`Navigating to /${displayExt}`);
      
      // Direct navigation to the display URL
      navigate(`/${displayExt}`);
      
      setMessage(`✅ Opening ${displayName} display...`);
    } catch (error) {
      console.error("Error navigating to display:", error);
      setMessage("❌ Error opening display.");
      setActiveButton(null);
    }
  };

  const displayOptions = [
    { type: "primary", name: "Primary", icon: <RiDashboardLine /> },
    { type: "flights", name: "Flights", icon: <RiFlightTakeoffLine /> },
    { type: "golf", name: "Golf", icon: <GiGolfFlag /> },
    { type: "f1", name: "F1", icon: <FaFlagCheckered /> },
    { type: "finance", name: "Finance", icon: <RiLineChartLine /> },
    { type: "traffic", name: "Traffic", icon: <RiRoadMapLine /> },

  ];

  return (
    <div className="landing-container">
      {/* Spookfish Logo */}
      <img
        src={spookfishLogo}
        alt="Spookfish Logo"
        className="logo"
      />

      <h2 className="welcome-title">Select your display</h2>
      
      {/* Display Buttons */}
      <div className="display-buttons">
        {displayOptions.map((option) => (
          <button
            key={option.type}
            className={`display-button ${activeButton === option.type ? 'active' : ''}`}
            onClick={() => handleDisplaySelect(option.type, option.name)}
          >
            <span className="button-icon">{option.icon}</span>
            <span className="button-text">{option.name}</span>
            <div className="button-glow"></div>
          </button>
        ))}
      </div>

      {/* Status Message */}
      {message && (
        <p className={`status-message ${message.includes("❌") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      {/* Add CSS styles */}
      <style jsx>{`
        .landing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          height: 480px;
          max-height: 100vh;
          padding: 1.5rem 1rem;
          width: 100%;
          background-color: white;
          color: #333;
          overflow-y: auto;
        }

        .logo {
          width: 350px;
          height: auto;
          margin-bottom: 0.0rem;
          filter: drop-shadow(0 0 10px rgba(10, 186, 181, 0.2));
        }

        .welcome-title {
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0 0 1rem 0;
          color: #333;
          letter-spacing: 0.5px;
        }

        .display-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 900px;
        }

        .display-button {
          position: relative;
          background: linear-gradient(135deg, #0abab5 0%, #08918d 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.7rem 0.8rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 
            0 4px 12px rgba(10, 186, 181, 0.2),
            0 1px 3px rgba(0, 0, 0, 0.1);
          width: 135px;
          height: 85px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          z-index: 1;
        }

        .display-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
          border-radius: 10px;
          z-index: -1;
        }

        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 0.4rem;
          color: white;
          transition: all 0.3s ease;
        }

        .button-text {
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 0.95rem;
        }

        .display-button:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 10px 20px rgba(10, 186, 181, 0.3),
            0 4px 10px rgba(0, 0, 0, 0.05);
          background: linear-gradient(135deg, #0fceca 0%, #0abab5 100%);
        }

        .display-button:hover .button-icon {
          transform: translateY(-3px) scale(1.1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .display-button:active {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 15px rgba(10, 186, 181, 0.3),
            0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .display-button.active {
          background: linear-gradient(135deg, #14e8e2 0%, #0cd4cf 100%);
          box-shadow: 
            0 0 20px rgba(10, 186, 181, 0.4),
            0 0 40px rgba(10, 186, 181, 0.2);
          animation: pulse 1.5s infinite;
        }

        .display-button:disabled {
          background: linear-gradient(135deg, #cccccc 0%, #aaaaaa 100%);
          cursor: not-allowed;
          transform: none;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .button-glow {
          position: absolute;
          width: 150%;
          height: 200%;
          top: -50%;
          left: -25%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          transform: rotateZ(30deg);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .display-button:hover .button-glow {
          opacity: 1;
          animation: rotateGlow 2s infinite linear;
        }

        .status-message {
          margin-top: 1rem;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          animation: fadeIn 0.4s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .success {
          background-color: rgba(10, 186, 181, 0.1);
          border: 1px solid rgba(10, 186, 181, 0.2);
          color: #08918d;
        }

        .error {
          background-color: rgba(255, 76, 76, 0.1);
          border: 1px solid rgba(255, 76, 76, 0.2);
          color: #e63946;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 15px rgba(10, 186, 181, 0.4), 0 0 30px rgba(10, 186, 181, 0.2); }
          50% { box-shadow: 0 0 20px rgba(10, 186, 181, 0.6), 0 0 40px rgba(10, 186, 181, 0.3); }
          100% { box-shadow: 0 0 15px rgba(10, 186, 181, 0.4), 0 0 30px rgba(10, 186, 181, 0.2); }
        }

        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .logo {
            width: 250px;
          }
          
          .display-buttons {
            gap: 0.8rem;
          }
          
          .display-button {
            width: 120px;
            height: 75px;
            padding: 0.6rem;
          }
          
          .button-icon {
            font-size: 1.5rem;
          }
          
          .button-text {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 600px) {
          .landing-container {
            padding: 1rem 0.5rem;
          }
          
          .logo {
            width: 200px;
          }
          
          .welcome-title {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
          }
          
          .display-buttons {
            gap: 0.6rem;
          }
          
          .display-button {
            width: 100px;
            height: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
