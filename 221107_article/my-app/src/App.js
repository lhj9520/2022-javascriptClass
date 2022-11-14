import React from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

/**
 * 로그인 세션 사용하기 위한
 * 서버랑 app이랑 도메인이 다르자나 그러면 쿠키 공유가 안됨
 * 그래서 도메인이 달라고 내 쿠키를 공유해주겠다고 설정
 * app과 서버 둘 다 세션 관련된 설정을 해줘야함
 */
axios.defaults.withCredentials = true;

function Join() {
  const navigation = useNavigate();

  //useState는 항상 위
  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    // alert(event.target.name);
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 회원가입 = async () => {
    /**
     * GET : 가져올때
     * POST : 뭐를 만들때
     */
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data, //get은 params였음
    })
      .then((res) => {
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          navigation("/login");
        }

        // console.log(res); //data에 응답 메세지 옴
      })
      .catch((e) => {
        console.log("join error", e);
      });
    //여기서 내가 입력한 값을 console.log로 확인해주세요
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

function Login() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data, //get은 params였음
    })
      .then((res) => {
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          //로그인 후 메인페이지 이동해야겠지?
        }
      })
      .catch((e) => {
        console.log("login error", e);
      });
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Main() {
  return <div>Main</div>;
}

const StoreContext = React.createContext({});

function App() {
  return (
    <StoreContext.Provider value={{}}>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="login" element={<Login />} />
        <Route exact path="/join" element={<Join />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
