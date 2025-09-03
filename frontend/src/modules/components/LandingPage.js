import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/LandingPage.css';
import FlyingLogos from './FlyingLogos';
// To access the logo from the public folder, you don't need to import it. 
// Instead, you can use it directly in your JSX as follows:
// <img src={`${process.env.PUBLIC_URL}/stimpyper_logo.png`} alt="StimPyPer Logo" />

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/parameter-input');
  };

  return (
    <div className="landing-page-container">
      <h1 className="landing-page-title">StimPyPer</h1>
      {/* <div className="logo-container">
        <img 
          src={`${process.env.PUBLIC_URL}/stimpyper_logo.png`} 
          alt="StimPyPer Logo" 
          className="rotating-logo"
        />
      </div> */}
      <FlyingLogos />
      <button className="landing-page-button" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
}

export default LandingPage;
