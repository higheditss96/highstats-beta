// src/FollowerStats.js
import React from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function FollowerStats({ followersHistory = [], currentFollowers = 0 }) {
  // Generăm datele pentru grafic
  const chartData = {
    labels: followersHistory.map((item) => item.date),
    datasets: [
      {
        label: "Followers",
        data: followersHistory.map((item) => item.count),
        fill: false,
        borderColor: "#00ffaa",
        backgroundColor: "#00ffaa",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="card same-size">
      <h2 className="stats-title">Channel Growth</h2>

      <div className="follower-web-current">
        <h1 className="follower-big">{currentFollowers.toLocaleString()}</h1>
        <p className="follower-sub">Followers</p>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <p className="follower-sub-text">
        Growth over time (last 30 days)
      </p>
    </div>
  );
}

export default FollowerStats;
