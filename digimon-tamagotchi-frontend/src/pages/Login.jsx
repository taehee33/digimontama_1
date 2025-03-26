// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // 임시 로그인 => /select 이동
  const handleLogin = () => {
    navigate("/select");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login Page</h1>
      <p>임시 로그인. 실제 ID/PW 검증은 생략</p>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
      >
        로그인
      </button>
    </div>
  );
}

export default Login;