import React, { useState } from "react";
import "./App.css";

function Main() {
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("#00ff88");
  const [font, setFont] = useState("Poppins");
  const [useGoal, setUseGoal] = useState(false);
  const [goal, setGoal] = useState(10000);
  const [showPfp, setShowPfp] = useState(true);

  const openOverlay = () => {
    const params = new URLSearchParams({
      user: username,
      color,
      font,
      useGoal,
      goal,
      showPfp,
    });

    // deschide overlay-ul pe același domeniu (merge și pe Vercel)
    window.open(`${window.location.origin}/overlay?${params.toString()}`, "_blank");
  };

  return (
    <div className="App">
      <h1>HIGHSTATS <span className="beta-tag">beta</span></h1>

      <div className="main-container">
        <input
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Counter color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label>Use Goal?</label>
        <select onChange={(e) => setUseGoal(e.target.value === "true")}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        {useGoal && (
          <input
            type="number"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        )}

        <label>Show Profile Picture?</label>
        <select onChange={(e) => setShowPfp(e.target.value === "true")}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <button onClick={openOverlay}>Open OBS Overlay</button>
      </div>
    </div>
  );
}

export default Main;
