import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 임시 로그인 (나중에 서버 연동 가능)
    navigate("/game"); // 로그인 후 게임 화면으로 이동
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Digimon Tamagotchi</h1>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;
