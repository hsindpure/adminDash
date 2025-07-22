// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/style.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className="landing-container">
      <div className="animated-image">📊</div>


            <section class="hero-section">
              <div class="container">
                  <div class="row align-items-center">
                      <div class="col-lg-6">
                          <div class="hero-content">
                              <h1 class="hero-title">
                                  Transform Your Excel Data Into
                                  <span >Intelligent Dashboards</span>
                              </h1>
                              <p class="hero-subtitle">AI-Powered Analytics at Your Fingertips</p>
                              <p class="hero-description">
                                  Upload your Excel files and let our AI automatically generate beautiful, 
                                  interactive dashboards with intelligent insights and recommendations. No coding required.
                              </p>
                           
                              <button className="myButton" onClick={handleGetStarted}>Get Started</button>
                          </div>
                      </div>
                      <div class="col-lg-6">
                          <div class="chart-container animated-chart">
                              <div id="heroChart"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
    
    </div>
  );
}

export default LandingPage;
