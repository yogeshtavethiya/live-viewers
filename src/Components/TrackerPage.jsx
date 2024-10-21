import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Enter your website to generate the live viewers tracking script</h2>
      <input
        type="text"
        placeholder="Enter website URL"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
      />
      <button onClick={handleGenerateScript}>Generate Script</button>

      {generatedScript && (
        <div>
          <h3>Copy and paste this script into your website's HTML:</h3>
          <textarea
            rows="10"
            cols="80"
            value={generatedScript}
            readOnly
            style={{ whiteSpace: 'pre', fontFamily: 'monospace', margin: '20px 0', padding: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default TrackerPage;
