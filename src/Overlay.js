import React from "react";
import "./App.css";

function Overlay() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ff88";
  const font = params.get("font") || "Poppins";
  const useGoal = params.get("useGoal") === "true";
  const goal = parseInt(params.get("goal")) || 10000;
  const showPfp = params.get("showPfp") === "true";

  // Poți lega la API Kick sau altul ulterior
  const followers = 29444; // exemplu

  const progress = useGoal ? Math.min((followers / goal) * 100, 100) : 0;

  return (
    <div
      className="overlay-container"
      style={{
        backgroundColor: "transparent",
        color: color,
        fontFamily: font,
      }}
    >
      {showPfp && (
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          alt="pfp"
          className="overlay-pfp"
        />
      )}

      {useGoal && (
        <div className="overlay-goal-bar">
          <div
            className="overlay-progress"
            style={{ width: `${progress}%`, backgroundColor: color }}
          ></div>
        </div>
      )}

      <h1>{followers.toLocaleString()}</h1>
      {useGoal && (
        <p>
          {followers >= goal
            ? "🎉 Congrats! Goal reached!"
            : `${goal - followers} more to reach your goal`}
        </p>
      )}
    </div>
  );
}

export default Overlay;
