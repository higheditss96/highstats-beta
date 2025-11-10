// src/api/kickAPI.js

export async function fetchKickData(username) {
  try {
    // Fetch user info
    const userRes = await fetch(`https://kick.com/api/v1/channels/${username}`);
    const userData = await userRes.json();

    // Fetch subscriptions (subs)
    const subRes = await fetch(
      `https://kick.com/api/v1/channels/${username}/subscriptions`
    );
    const subData = await subRes.json();

    // Fetch gifted subs
    const giftedRes = await fetch(
      `https://kick.com/api/v1/channels/${username}/subscriptions/gifted`
    );
    const giftedData = await giftedRes.json();

    return {
      followers: userData?.followersCount || 0,
      subs: subData?.total || 0,
      gifted: giftedData?.total || 0,
      profilePic: userData?.user?.profile_pic || "",
    };
  } catch (err) {
    console.error("❌ Error fetching Kick API data:", err);
    return {
      followers: 0,
      subs: 0,
      gifted: 0,
      profilePic: "",
    };
  }
}
