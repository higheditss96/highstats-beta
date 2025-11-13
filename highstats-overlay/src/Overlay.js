// === HIGHSTATS OVERLAY — FINAL FULL VERSION ===

const params = new URLSearchParams(window.location.search);

const username = params.get("user") || "hyghman";
const color = params.get("color") || "#00ffaa";
const font = params.get("font") || "Poppins";
const theme = (params.get("theme") || "dark").toLowerCase();

const showProfilePic =
  (params.get("showProfilePic") || "yes").toLowerCase() === "yes";

const useGoal = params.get("useGoal") === "true";
const goal = parseInt(params.get("goal") || "10000");

document.body.style.setProperty("--main-color", color);
document.body.style.fontFamily = font;

// === HTML ===
document.body.innerHTML = `
  <div class="overlay-wrapper ${theme}">
    
    ${showProfilePic ? `<img id="pfp" class="pfp hidden" />` : ""}

    <div id="followers" class="followers hidden">0</div>

    <div id="lastFollower" class="last-follower hidden">
      <img id="lfPfp" class="lf-pfp" />
      <span id="lfName">Last follower: N/A</span>
    </div>

    ${
      useGoal
        ? `
      <div class="goal-bar hidden">
        <div class="goal-fill"></div>
        <div class="goal-text">0 / ${goal.toLocaleString()}</div>
      </div>
      `
        : ""
    }

    <div id="pulseFx" class="pulse"></div>
  </div>
`;

// === ELEMENTE ===
const followersEl = document.getElementById("followers");
const pfp = document.getElementById("pfp");

const lastFollowerBox = document.getElementById("lastFollower");
const lfName = document.getElementById("lfName");
const lfPfp = document.getElementById("lfPfp");

const goalBar = document.querySelector(".goal-bar");
const goalFill = document.querySelector(".goal-fill");
const goalText = document.querySelector(".goal-text");

const pulseFx = document.getElementById("pulseFx");

let lastFollowers = 0;

// === COUNTUP ===
function countUp(el, from, to, duration = 900) {
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(from + (to - from) * progress);
    el.textContent = value.toLocaleString();

    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// === FETCH FOLLOWERS ===
async function fetchFollowers() {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${username}`);
    const data = await res.json();

    const avatar = data?.user?.profile_pic;
    const followers = data?.followers_count;

    // Profile picture
    if (showProfilePic && avatar) {
      pfp.src = avatar;
      fadeIn(pfp);
    }

    // Count-up
    countUp(followersEl, lastFollowers, followers);
    fadeIn(followersEl);

    // Puls pentru FOLLOW
    if (followers > lastFollowers) triggerPulse();

    // Goal bar
    if (useGoal && goalBar) {
      fadeIn(goalBar);
      const pct = Math.min(100, (followers / goal) * 100);
      goalFill.style.width = `${pct}%`;
      goalText.textContent =
        `${followers.toLocaleString()} / ${goal.toLocaleString()}`;
    }

    lastFollowers = followers;
  } catch (e) {
    console.error("Kick error:", e);
  }
}

// === FETCH LAST FOLLOWER ===
async function fetchLastFollower() {
  try {
    const res = await fetch(
      `https://kickapi.su/api/v2/channels/${username}/followers?limit=1`
    );
    const data = await res.json();

    const f = data?.data?.[0]?.follower;
    if (!f) return;

    lfName.textContent = f.username;
    lfPfp.src = f.profile_pic;
    fadeIn(lastFollowerBox);
  } catch (e) {
    console.error("Last follower error:", e);
  }
}

// === EFFECT: FOLLOW PULSE ===
function triggerPulse() {
  pulseFx.classList.remove("active");
  void pulseFx.offsetWidth;
  pulseFx.classList.add("active");
}

// === ANIMATIE ===
function fadeIn(el) {
  if (!el) return;
  el.classList.remove("hidden");
  el.classList.add("fade-in");
}

// === RUN ===
fetchFollowers();
fetchLastFollower();

setInterval(fetchFollowers, 10000);
setInterval(fetchLastFollower, 10000);

// === CSS ===
const style = document.createElement("style");
style.textContent = `

  body {
    background: transparent;
    margin: 0;
    overflow: hidden;
  }

  /* === OVERLAY CENTRAT PE MIJLOC === */
  .overlay-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;  /* CENTER VERTICAL */
    align-items: center;      /* CENTER HORIZONTAL */
    height: 100vh;
    width: 100vw;
    gap: 18px;
  }

  /* === THEME === */
  .dark .followers, .dark #lfName, .dark .goal-text {
    color: white;
  }
  .light .followers, .light #lfName, .light .goal-text {
    color: black;
  }

  /* === PFP === */
  .pfp {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 6px 18px rgba(0,0,0,0.5);
    opacity: 0;
    transform: scale(0.85);
    transition: 0.4s;
  }

  /* === FOLLOWERS COUNT === */
  .followers {
    font-size: 4.6rem;
    font-weight: 700;
    text-shadow: 0 5px 16px rgba(0,0,0,0.5);
    opacity: 0;
    transform: translateY(12px);
    transition: 0.4s;
  }

  /* === LAST FOLLOWER === */
  .last-follower {
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(12px);
    transition: 0.4s;
  }

  .lf-pfp {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }

  #lfName {
    font-weight: 600;
    font-size: 1.2rem;
  }

  /* === GOAL BAR === */
  .goal-bar {
    width: 380px;
    height: 30px;
    background: rgba(255,255,255,0.16);
    border-radius: 50px;
    overflow: hidden;
    position: relative;
    opacity: 0;
    transform: translateY(12px);
    transition: 0.4s;
  }

  .goal-fill {
    height: 100%;
    width: 0%;
    background: var(--main-color);
    transition: width 0.6s ease;
  }

  .goal-text {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.1rem;
    font-weight: 700;
  }

  /* === FOLLOW PULSE FX === */
  .pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 260px;
    height: 260px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, var(--main-color), transparent);
    opacity: 0;
  }

  .pulse.active {
    animation: pulseAnim 0.6s ease-out forwards;
  }

  @keyframes pulseAnim {
    0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.5); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
  }

  .hidden { opacity: 0; }
  .fade-in { opacity: 1 !important; transform: translateY(0) scale(1) !important; }
`;

document.head.appendChild(style);
