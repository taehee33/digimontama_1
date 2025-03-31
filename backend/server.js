/*

const express = require("express");
const app = express();

const PORT = 3000;

// 기본 API 엔드포인트
app.get("/", (req, res) => {
    res.send("Digimon Tamagotchi Server is running!");
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


*/

/**
 * server.js
 * Node + Express + node-cron
 * - Serves React build folder (build/)
 * - Provides /api/... endpoints (in-memory DB)
 * - Cron job checks hunger <= 2 each minute
 */

const express = require("express");
const path = require("path");
const cron = require("node-cron");
const fetch = require("cross-fetch"); // For Discord Webhook etc.

const app = express();
app.use(express.json());

// 1) In-memory DB
let fakeDB = {};

// 2) (Optional) Discord Webhook URL (Render/Netlify env var)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

/**
 * 3) Serve React "build" folder statically
 *    => This allows GET / to show React index.html
 */
app.use(express.static(path.join(__dirname, "build")));

/**
 * 4) API routes
 * GET /api/digimon/:slotId => return that slot's digimon state
 * POST /api/digimon/:slotId => save/update that slot's digimon
 */
app.get("/api/digimon/:slotId", (req, res) => {
  const slotId = req.params.slotId;
  if (!fakeDB[slotId]) {
    return res.status(404).json({ error: "Slot not found" });
  }
  return res.json(fakeDB[slotId]);
});

app.post("/api/digimon/:slotId", (req, res) => {
  const slotId = req.params.slotId;
  const data = req.body; // Full digimon stats from frontend
  fakeDB[slotId] = data;
  console.log(`[POST] Saved digimon state for slot ${slotId}`, data);
  return res.json({ success: true });
});

/**
 * 5) For any other route (non-API), serve index.html
 *    => Supports React Router
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/**
 * 6) node-cron: check hunger <=2 every minute
 *    "* * * * *" => every minute on the 0th second
 */
cron.schedule("* * * * *", async () => {
  console.log("[CRON] Checking digimon states...");

  for (const slotId in fakeDB) {
    const digi = fakeDB[slotId];
    if (!digi) continue;

    if (!digi.isDead && digi.hunger <= 2) {
      // 1) console
      console.log(`[CRON] Digimon in slot ${slotId} is hungry (hunger=${digi.hunger})`);

      // 2) (Optional) Discord Webhook alert
      if (DISCORD_WEBHOOK_URL) {
        try {
          await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: `슬롯 ${slotId} 디지몬이 배고픕니다! (hunger=${digi.hunger})`
            }),
          });
          console.log(`[CRON] Discord alert sent for slot ${slotId}`);
        } catch (err) {
          console.error("[CRON] Discord Webhook error:", err);
        }
      }
    }
  }
});

/**
 * 7) Start server
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Digimon Tamagotchi server is running on port ${PORT}`);
});