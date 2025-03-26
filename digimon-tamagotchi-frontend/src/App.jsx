// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SelectScreen from "./pages/SelectScreen";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<Login />} />

        {/* 기종/버전/슬롯 선택 화면 */}
        <Route path="/select" element={<SelectScreen />} />

        {/* 게임 화면 (슬롯ID 기반) */}
        <Route path="/game/:slotId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;