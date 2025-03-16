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
