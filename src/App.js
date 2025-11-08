import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("hyghman");
  const [typedUsername, setTypedUsername] = useState("hyghman"); // pentru input separat
  const [font, setFont] = useState("Poppins");
  const [color, setColor] = useState("#00ffaa");
  const [useGoal, setUseGoal] = useState(false);
  const [goal, setGoal] = useState(10000);
  const [showPfp, setShowPfp] = useState(true);
  const [followers, setFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");

  const presetUsers = ["hyghman", "anduu14", "ket_14", "godeanuu"];

  // Fetch Kick user data
  const fetchKickUser = async (user = username) => {
    try {
      const res = await fetch(`https://kick.com/api/v1/channels/${user}`);
      const data = await res.json();
      setFollowers(data.followersCount);
      setProfilePic(data.user.profile_pic);
    } catch (err) {
      console.error("User not found", err);
      setFollowers(0);
      setProfilePic("");
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchKickUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open overlay on Vercel
  const handleOverlayOpen = () => {
    const overlayUrl = `https://highstatsss-overlay.vercel.app/?user=${username}&color=${encodeURIComponent(
      color
    )}&font=${encodeURIComponent(
      font
    )}&useGoal=${useGoal}&goal=${goal}&showPfp=${showPfp}`;
    window.open(overlayUrl, "_blank");
  };

  return (
    <div className="App">
      <header className="header">
        HIGHSTATS <span className="beta-tag">beta</span>
      </header>

      <div className="content">
        {/* ======= LEFT CARD ======= */}
        <div className="card same-size">
          <div className="search-container">
            <input
              type="text"
              value={typedUsername}
              onChange={(e) => setTypedUsername(e.target.value)}
              className="input small"
              placeholder="Enter Kick username"
            />
            <button
              className="search-btn small"
              onClick={() => {
                setUsername(typedUsername);
                fetchKickUser(typedUsername);
              }}
            >
              Search
            </button>
          </div>

          {/* ======= PRESET BUTTONS ======= */}
          <div className="presets">
            {presetUsers.map((user) => (
              <button
                key={user}
                className={`preset-btn ${username === user ? "active" : ""}`}
                onClick={() => {
                  setUsername(user);
                  setTypedUsername(user);
                  fetchKickUser(user); // ✅ instant load on preset
                }}
              >
                {user}
              </button>
            ))}
          </div>

          {showPfp && profilePic && (
            <img src={profilePic} alt="pfp" className="profile-pic" />
          )}

          {/* ======= LIVE FONT PREVIEW ======= */}
          <div
            className="preview-box"
            style={{
              fontFamily: font,
              color: color,
              transition: "all 0.3s ease",
            }}
          >
            <div className="preview-username">@{username}</div>
            <div
              className="preview-followers"
              style={{
                fontFamily: font,
                fontWeight: 600,
                color: color,
              }}
            >
              {followers.toLocaleString()}
            </div>
            <div className="preview-sub">followers</div>
          </div>
        </div>

        {/* ======= RIGHT CARD ======= */}
        <div className="card same-size">
          <h2>Generate OBS Overlay</h2>

          <label>Font</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="dropdown"
          >
            <option>Poppins</option>
            <option>Inter</option>
            <option>Roboto</option>
            <option>Outfit</option>
            <option>Montserrat</option>
            <option>Bebas Neue</option>
            <option>Orbitron</option>
            <option>Russo One</option>
            <option>Lilita One</option>
            <option>Oswald</option>
          </select>

          <label>Counter color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />

          <label>Use Goal?</label>
          <select
            value={useGoal ? "true" : "false"}
            onChange={(e) => setUseGoal(e.target.value === "true")}
            className="dropdown"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          {useGoal && (
            <>
              <label>Goal</label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="input"
                min="1"
              />
            </>
          )}

          <label>Show Profile Picture?</label>
          <select
            value={showPfp ? "true" : "false"}
            onChange={(e) => setShowPfp(e.target.value === "true")}
            className="dropdown"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <button onClick={handleOverlayOpen} className="generate-btn">
            Open OBS Overlay
          </button>
        </div>
      </div>

      <footer className="footer">
        made by{" "}
        <a
          href="https://kick.com/highman-edits"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          highman_edits
        </a>{" "}
        <img
          src="https://cdn.7tv.app/emote/01G9WSWQBG0002DD3H035HJD5C/4x.avif"
          alt="cat"
          className="footer-emoji"
        />
      </footer>
    </div>
  );
}

export default App;
