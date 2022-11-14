import axios from "axios";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

// 도메인 달라도 쿠키공유해줄게
axios.defaults.withCredentials = true;

function Join() {
  const navigation = useNavigate();

  // useState는 항상위
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

  const 회원가입 = async () => {
    /**
     * GET : 가져올떄
     * POST : 뭐를 생성할떄
     */
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;

        console.log(message);

        if (code === "success") {
          alert(message);
          navigation("/login");
        }
      })
      .catch((e) => {
        console.log("join Error", e);
      });

    // 여기서 내가 입력한 값을 console.log로 확인해주세요
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
  // const navigation = useNavigate();

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
      data: data,
    })
      .then((res) => {
        alert(res.data.message);

        if (res.data.code === "success") {
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.log("로그인에러", e);
      });
  };

  return (
    <div>
      <input name="id" onChange={데이터변경} />
      <input name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Write() {
  const navigation = useNavigate();
  /**
   * 제목,내용 입력 state에 저장한 후
   * 작성하기 누르면 서버에 요청 보내기
   * 다 하신분들은 Mysql article 테이블에 저장까지 해주세요~
   */
  const { loginUser } = React.useContext(StoreContext);

  const [data, setData] = React.useState({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 작성하기 = async () => {
    // console.log(data);

    await axios({
      url: "http://localhost:4000/article",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;
        console.log(message);
        if (code === "success") {
          alert(message);
          navigation("/");
        }
      })
      .catch((e) => {
        console.log("write Error", e);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
      <h2>게시글 작성</h2>
      <h3>제목</h3>
      <input name="title" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        cols="50"
        rows="10"
        name="body"
        onChange={데이터변경}
      ></textarea>
      <button type="button" onClick={작성하기}>
        작성하기
      </button>
    </div>
  );
}

function Main() {
  const navigation = useNavigate();
  const [article, setArticle] = React.useState({
    title: "",
    body: "",
    user_seq: "",
  });

  const { loginUser } = React.useContext(StoreContext);

  const 글목록요청 = async () => {
    // console.log(data);

    await axios({
      url: "http://localhost:4000/articlelist",
      method: "GET",
    })
      .then((res) => {
        const { code, message, list } = res.data;
        console.log(message);
        if (code === "success") {
          console.log(list);
          setArticle(list);
        }
      })
      .catch((e) => {
        console.log("write Error", e);
      });
  };

  React.useEffect(() => {
    글목록요청();
  }, []);

  return (
    <div>
      <h2>{loginUser.nickname}님 안녕하세요!</h2>
      <button
        type="button"
        onClick={() => {
          navigation("/write");
        }}
      >
        글작성하기
      </button>
      <div>
        <h2>글목록</h2>
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>내용</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {article.length > 0 &&
              article.map((item) => {
                return (
                  <tr key={item.seq}>
                    <th>{item.title}</th>
                    <th>{item.body}</th>
                    <th>{item.user_seq}</th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * 1. React Router DOM (완료)
 * npm install react-router-dom
 *
 * 2. Context Provider (완료)
 * 두개 설정해주세요
 * https://to2.kr/d6P
 */
const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
    }).then((res) => {
      console.log(res.data);

      setLoginUser(res.data);
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/write" element={<Write />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
