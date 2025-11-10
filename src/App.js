import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("hyghman");
  const [typedUsername, setTypedUsername] = useState("hyghman");
  const [font, setFont] = useState("Poppins");
  const [color, setColor] = useState("#00ffaa");
  const [goalColor, setGoalColor] = useState("#ffffff");
  const [useGoal, setUseGoal] = useState(false);
  const [goal, setGoal] = useState(10000);
  const [showPfp, setShowPfp] = useState(true);
  const [followers, setFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");

  const presetUsers = ["hyghman", "anduu14", "ket_14", "godeanu"];

  // 🧩 Fix: memorăm funcția pentru ESLint + Vercel CI
  const fetchKickUser = useCallback(
    async (userToFetch = username) => {
      try {
        const res = await fetch(`https://kick.com/api/v1/channels/${userToFetch}`);
        const data = await res.json();
        setFollowers(data.followersCount);
        setProfilePic(data.user?.profile_pic || "");
      } catch (err) {
        console.error("User not found", err);
        setFollowers(0);
        setProfilePic("");
      }
    },
    [username]
  );

  // 🧩 useEffect cu dependența corectă
  useEffect(() => {
    fetchKickUser();
  }, [fetchKickUser]);

  const handleOverlayOpen = () => {
    const overlayUrl = `https://highstatsss-overlay.vercel.app/?user=${encodeURIComponent(
      username
    )}&color=${encodeURIComponent(color)}&font=${encodeURIComponent(
      font
    )}&useGoal=${useGoal}&goal=${goal}&showProfilePicture=${showPfp}&goalColor=${encodeURIComponent(
      goalColor
    )}`;
    window.open(overlayUrl, "_blank");
  };

  return (
    <div className="App">
      <header className="header">
        HIGHSTATS <span className="beta-tag">beta</span>
      </header>

      <div className="content-3col">
        {/* ==== LEFT CARD ==== */}
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

          <div className="presets">
            {presetUsers.map((user) => (
              <button
                key={user}
                className={`preset-btn ${username === user ? "active" : ""}`}
                onClick={() => {
                  setUsername(user);
                  setTypedUsername(user);
                  fetchKickUser(user);
                }}
              >
                {user}
              </button>
            ))}
          </div>

          {showPfp && profilePic && (
            <img src={profilePic} alt="pfp" className="profile-pic" />
          )}

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
                fontWeight: 700,
                color: color,
                textShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            >
              {followers.toLocaleString()}
            </div>
            <div className="preview-sub">followers</div>

            {useGoal && (
              <div className="goal-preview-container">
                <div
                  className="goal-bar"
                  style={{
                    height: "18px",
                    width: "80%",
                    margin: "8px auto",
                    background: "#1a1a1a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="goal-progress"
                    style={{
                      height: "100%",
                      width: `${Math.min(
                        (followers / goal) * 100,
                        100
                      ).toFixed(1)}%`,
                      backgroundColor: goalColor,
                      borderRadius: "12px 0 0 12px",
                      transition: "width 0.5s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#fff",
                      textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }}
                  >
                    {followers.toLocaleString()} / {goal.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==== MIDDLE CARD ==== */}
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

              <label>Goal color</label>
              <input
                type="color"
                value={goalColor}
                onChange={(e) => setGoalColor(e.target.value)}
                className="color-picker"
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

        {/* ==== RIGHT PREVIEW CARD ==== */}
        <div className="card same-size preview-card">
          <h2>Overlay Preview</h2>
          <div
            className="overlay-preview-box"
            style={{
              background: "#0f0f0f",
              borderRadius: "14px",
              padding: "25px",
              textAlign: "center",
              fontFamily: font,
              color: color,
              boxShadow: "0 0 25px rgba(0,0,0,0.3)",
              marginTop: "15px",
            }}
          >
            {showPfp && profilePic && (
              <img
                src={profilePic}
                alt="pfp"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginBottom: "15px",
                  boxShadow: `0 6px 18px rgba(0,0,0,0.6)`,
                }}
              />
            )}
            <div
              style={{
                fontSize: "38px",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              {followers.toLocaleString()}
            </div>
            {useGoal && (
              <div
                style={{
                  height: "14px",
                  width: "100%",
                  background: "#222",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      (followers / goal) * 100,
                      100
                    ).toFixed(1)}%`,
                    background: goalColor,
                    height: "100%",
                    borderRadius: "10px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            )}
          </div>
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
