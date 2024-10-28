import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'

const TrackerPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  const handleGenerateScript = async () => {
    if (!websiteUrl.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5001/generate-script?websiteUrl=${encodeURIComponent(websiteUrl)}`);
      setGeneratedScript(response.data);
    } catch (error) {
      console.error('Error generating script:', error);
    }
  };

  return (
    <div className='tracker-container'>
      <div className='form'>
        <h2>Enter URL</h2>
        <div className="input-container">
          <input
            className='input'
            type="text"
            placeholder="Enter website URL"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <button className='generate-btn' onClick={handleGenerateScript}>Generate Script</button>
        </div>
      </div>

      {generatedScript && (
        <div className='script-container'>
          <h3>Inject this script into your website's HTML:</h3>
          <textarea
            rows="10"
            cols="80"
            value={generatedScript}
            readOnly
            className='script-text'
          />
        </div>
      )}
    </div>
  );
};

export default TrackerPage;
