import React, { useEffect, useState } from "react";
import "./App.css";

function Overlay() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";
  const useGoal = params.get("useGoal") === "true";
  const goal = parseInt(params.get("goal")) || 10000;
  const showPfp = params.get("showPfp") === "true";

  const [followers, setFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Kick data
  useEffect(() => {
    async function fetchKickData() {
      try {
        const res = await fetch(`https://kick.com/api/v1/channels/${username}`);
        const data = await res.json();
        setFollowers(data.followersCount);
        setProfilePic(data.user.profile_pic);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKickData();
    const interval = setInterval(fetchKickData, 10000); // refresh la 10s
    return () => clearInterval(interval);
  }, [username]);

  const progress = useGoal ? Math.min((followers / goal) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="overlay-container" style={{ color: color, fontFamily: font }}>
        <p>Loading Kick data...</p>
      </div>
    );
  }

  return (
    <div
      className="overlay-container"
      style={{
        backgroundColor: "transparent",
        color: color,
        fontFamily: font,
      }}
    >
      {useGoal && (
        <div className="goal-bar">
          <div
            className="goal-progress"
            style={{ width: `${progress}%`, backgroundColor: color }}
          ></div>
          <div className="goal-text">
            {followers.toLocaleString()} / {goal.toLocaleString()}
          </div>
        </div>
      )}

      <div className="overlay-content">
        {showPfp && profilePic && (
          <img src={profilePic} alt="profile" className="overlay-pfp" />
        )}
        {!useGoal && (
          <h1 className="overlay-followers">{followers.toLocaleString()}</h1>
        )}
        {useGoal && (
          <p className="followers-left">
            {followers >= goal
              ? "🎉 Goal reached!"
              : `${(goal - followers).toLocaleString()} followers left`}
          </p>
        )}
      </div>
    </div>
  );
}

export default Overlay;
