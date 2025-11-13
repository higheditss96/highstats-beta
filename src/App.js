import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  // ========================= STATES =========================
  const [username, setUsername] = useState("hyghman");
  const [typedUsername, setTypedUsername] = useState("hyghman");

  const [font, setFont] = useState("Poppins");
  const [color, setColor] = useState("#00ffaa");
  const [goalColor, setGoalColor] = useState("#ffffff");

  const [useGoal, setUseGoal] = useState(false);
  const [goal, setGoal] = useState(10000);

  const [showPfp, setShowPfp] = useState(true);
  const [shadow, setShadow] = useState(true);
  const [theme, setTheme] = useState("dark");

  const [followers, setFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [verified, setVerified] = useState(false);

  const [lastFollower, setLastFollower] = useState(null);

  const presetUsers = ["hyghman", "anduu14", "ket_14", "godeanu"];

  // ========================= FETCH USER =========================
  const fetchKickUser = useCallback(
    async (userToFetch = username) => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${userToFetch}`);
        const data = await res.json();

        setFollowers(data.followers_count || 0);
        setProfilePic(data.user?.profile_pic || "");
        setVerified(data.user?.is_verified || false);
      } catch (err) {
        console.error("User fetch error:", err);
        setFollowers(0);
        setProfilePic("");
        setVerified(false);
      }
    },
    [username]
  );

  // ========================= LAST FOLLOWER =========================
  const fetchLastFollower = useCallback(async () => {
    try {
      const res = await fetch(
        `https://kickapi.su/api/v2/channels/${username}/followers?limit=1`
      );
      const data = await res.json();

      const f = data?.data?.[0]?.follower;
      setLastFollower(f ? f.username : null);
    } catch (err) {
      console.error("Last follower error:", err);
      setLastFollower(null);
    }
  }, [username]);

  // ========================= LOAD ALL =========================
  useEffect(() => {
    fetchKickUser();
    fetchLastFollower();
  }, [fetchKickUser, fetchLastFollower]);

  // ========================= GENERATE URL =========================
  const generateURL = () =>
    `https://highstatsss-overlay.vercel.app/?user=${encodeURIComponent(
      username
    )}&font=${encodeURIComponent(font)}&color=${encodeURIComponent(
      color
    )}&goalColor=${encodeURIComponent(goalColor)}&useGoal=${useGoal}&goal=${goal}&theme=${theme}&shadow=${shadow}&showProfilePic=${showPfp}`;

  // ------------------------------
  const handleOverlayOpen = () => window.open(generateURL(), "_blank");
  const handleCopyURL = () => {
    navigator.clipboard.writeText(generateURL());
    alert("OBS URL copied!");
  };

  // ========================= UI =========================
  return (
    <div className="App">
      <header className="header">
        HIGHSTATS <span className="beta-tag">beta</span>
      </header>

      <div className="content-3col">

        {/* ================= LEFT CARD ================= */}
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
                fetchLastFollower();
              }}
            >
              Search
            </button>
          </div>

          {/* PRESETS */}
          <div className="presets">
            {presetUsers.map((user) => (
              <button
                key={user}
                className={`preset-btn ${username === user ? "active" : ""}`}
                onClick={() => {
                  setUsername(user);
                  setTypedUsername(user);
                  fetchKickUser(user);
                  fetchLastFollower();
                }}
              >
                {user}
              </button>
            ))}
          </div>

          {/* PROFILE PICTURE */}
          {showPfp && profilePic && (
            <img src={profilePic} alt="pfp" className="profile-pic" />
          )}

          {/* PREVIEW */}
          <div className="preview-box" style={{ fontFamily: font, color }}>
            <div className="preview-username">
              @{username}
              {verified && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7595/7595571.png"
                  alt="verified"
                  className="verified-badge"
                  style={{
                    width: "18px",
                    height: "18px",
                    marginLeft: "6px",
                    filter: `drop-shadow(0 0 5px ${color})`
                  }}
                />
              )}
            </div>

            <div className="preview-followers">
              {followers.toLocaleString()}
            </div>
            <div className="preview-sub">followers</div>

            {lastFollower && (
              <div className="preview-sub">Last follower: {lastFollower}</div>
            )}

            {useGoal && (
              <div className="goal-preview-container">
                <div className="goal-bar">
                  <div
                    className="goal-progress"
                    style={{
                      width: `${Math.min(
                        (followers / goal) * 100,
                        100
                      )}%`,
                      backgroundColor: goalColor,
                    }}
                  >
                    {followers.toLocaleString()} / {goal.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= MIDDLE SETTINGS ================= */}
        <div className="card same-size compact-card">

          <h2>Generate OBS Overlay</h2>

          <label>Font</label>
          <select className="dropdown" value={font} onChange={(e) => setFont(e.target.value)}>
            <option>Poppins</option>
            <option>Inter</option>
            <option>Orbitron</option>
            <option>Montserrat</option>
            <option>Outfit</option>
            <option>Lilita One</option>
            <option>Bebas Neue</option>
            <option>Oswald</option>
          </select>

          <label>Counter color</label>
          <input type="color" className="color-picker" value={color} onChange={(e) => setColor(e.target.value)} />

          <label>Use Goal?</label>
          <select className="dropdown" value={useGoal ? "true" : "false"} onChange={(e) => setUseGoal(e.target.value === "true")}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          {useGoal && (
            <>
              <label>Goal</label>
              <input type="number" className="input" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />

              <label>Goal Color</label>
              <input type="color" className="color-picker" value={goalColor} onChange={(e) => setGoalColor(e.target.value)} />
            </>
          )}

          <label>Show Profile Picture?</label>
          <select className="dropdown" value={showPfp ? "true" : "false"} onChange={(e) => setShowPfp(e.target.value === "true")}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label>Theme</label>
          <select className="dropdown" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>

          <button onClick={handleOverlayOpen} className="generate-btn">
            Open OBS Overlay
          </button>

          <button onClick={handleCopyURL} className="generate-btn">
            Copy OBS URL
          </button>
        </div>

        {/* ================= RIGHT PREVIEW ================= */}
        <div className="card same-size preview-card">
          <h2>Overlay Preview</h2>

          <div className="overlay-preview-box" style={{ fontFamily: font, color }}>
            {showPfp && profilePic && (
              <img
                src={profilePic}
                alt="pfp"
                className="preview-pfp"
                style={{
                  width: "85px",
                  height: "85px",
                  borderRadius: "50%",
                  boxShadow: shadow ? "0 6px 18px rgba(0,0,0,0.5)" : "none",
                }}
              />
            )}

            <div className="preview-username">
              @{username}
              {verified && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7595/7595571.png"
                  alt="verified"
                  className="verified-badge"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginLeft: "6px",
                    filter: `drop-shadow(0 0 5px ${color})`
                  }}
                />
              )}
            </div>

            <div className="preview-followers">{followers.toLocaleString()}</div>

            {lastFollower && (
              <div className="preview-sub">Last follower: {lastFollower}</div>
            )}

          </div>
        </div>
      </div>

      <footer className="footer">
        made by{" "}
        <a href="https://kick.com/highman-edits" target="_blank" className="footer-link">
          highman_edits
        </a>
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
