import React, { useEffect, useState } from 'react';

const TrackerPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [viewers, setViewers] = useState(0);

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    try {
      console.log("Sending request to", `${API_URL}/track`);
      const response = await fetch(`${API_URL}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl }),
      });

      console.log("Received response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK. Status:", response.status, "Text:", errorText);
        throw new Error(`Failed to track viewers: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Parsed response data:", data);
      setViewers(data.liveViewers);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };




  useEffect(() => {
    const interval = setInterval(async () => {
      if (!websiteUrl.trim()) return;

      try {
        const response = await fetch(`/api/viewers?websiteUrl=${websiteUrl}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch viewers");
        }

        const data = await response.json();
        setViewers(data.liveViewers);
      } catch (error) {
        console.error("Error fetching viewers:", error);
        clearInterval(interval);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [websiteUrl]);

  return (
    <div>
      <h1>Live Viewer Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <button type="submit">Track Viewers</button>
      </form>
      <h2>Live Viewers: {viewers}</h2>
    </div>
  );
};

export default TrackerPage;
