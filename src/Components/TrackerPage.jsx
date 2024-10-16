import React, { useEffect, useState } from 'react';

const TrackerPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [viewers, setViewers] = useState(0);

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    try {
      const response = await fetch(`${API_URL}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl }),
      });

      const data = await response.json();
      console.log(data);
      setViewers(data.liveViewers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!websiteUrl.trim()) return;

    setInterval(async () => {
      try {
        const response = await fetch(`/api/viewers?websiteUrl=${encodeURIComponent(websiteUrl)}`)
        const data = await response.json();
        setViewers(data.liveViewers);
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    // return () => clearInterval(interval);
  }, [websiteUrl]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <button type="submit">Track</button>
      </form>
      <h2>Live Viewers: {viewers}</h2>
    </div>
  );
};

export default TrackerPage;
