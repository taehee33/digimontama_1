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


/*
 * server.js
 * Node + Express + node-cron 예시
 * In-memory 데이터(fakeDB)에 디지몬 상태 저장
 * 매 분마다 배고픔 <=2 디지몬 검사 → 콘솔 로그 알림 (or Discord Webhook)
 */
const express = require("express");
const cron = require("node-cron");
const fetch = require("cross-fetch"); // Discord Webhook 등 HTTP 요청 시

const app = express();
app.use(express.json());

// 간단 in-memory DB: slotId => { hunger, ... }
let fakeDB = {};

// (선택) 디스코드 웹훅 주소 (Railway 등 환경변수로 세팅 가능)
// 예: DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

/*
 * GET /api/digimon/:slotId
 * - 디지몬 상태 조회 (임시)
 */

app.get("/api/digimon/:slotId", (req, res) => {
  const slotId = req.params.slotId;
  if (!fakeDB[slotId]) {
    return res.status(404).json({ error: "Slot not found" });
  }
  return res.json(fakeDB[slotId]);
});

/*
 * POST /api/digimon/:slotId
 * - 디지몬 상태 저장/갱신
 * - body: { ...stats }
 */

app.post("/api/digimon/:slotId", (req, res) => {
  const slotId = req.params.slotId;
  const data = req.body; // 프론트에서 디지몬 stats 전체를 넘긴다고 가정
  fakeDB[slotId] = data;
  console.log(`[POST] Saved digimon state for slot ${slotId}`, data);
  return res.json({ success: true });
});

// 간단 테스트 엔드포인트
app.get("/", (req, res) => {
  res.send("Digimon Tamagotchi backend server is running!");
});

/*
 * * node-cron 설정
 * - 매 분 0초마다("* * * * *") 실행
 * - 실제 운영 시 "5 * * * *" (5분마다) 등 조정 가능 
*/

cron.schedule("* * * * *", async () => {
  console.log("[CRON] Checking digimon states...");

  // fakeDB 순회: hunger <= 2인 애들 알림
  for (const slotId in fakeDB) {
    const digi = fakeDB[slotId];
    if (!digi) continue;

    // isDead이 아닌데 hunger <= 2 이면 경고
    if (!digi.isDead && digi.hunger <= 2) {
      // 1) 콘솔
      console.log(`[CRON] Digimon in slot ${slotId} is hungry! hunger=${digi.hunger}`);

      // 2) (선택) 디스코드 웹훅
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
          console.error(`[CRON] Discord Webhook error:`, err);
        }
      }
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});