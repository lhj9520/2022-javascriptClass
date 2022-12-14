import React from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

const ProgressBar = (props) => {
  // 총너비 / 총스텝길이 * 현재스텝
  const width = (480 / 5) * props.step;

  return (
    <div className="progress-bar">
      <div className="percent" style={{ width: width }}></div>
    </div>
  );
};

const Question = (props) => {
  return (
    <div className="image-box">
      <img src={props.image} alt="온보딩이미지" />
    </div>
  );
};

const Answer = (props) => {
  const navigation = useNavigate();

  const { setDispatchType } = React.useContext(StoreContext);

  return (
    <button
      className="btn"
      onClick={() => {
        setDispatchType({
          code: "답변",
          params: { value: props.value },
        });
      }}
    >
      {props.text}
    </button>
  );
};

function On1() {
  return (
    <div className="main-app">
      <ProgressBar step={1} />
      <Question image="https://kakaofriendsmbti.netlify.app/images/01-01.png" />
      <Answer text="당연하지! 어디서 할지 고민 중이야!" value="E" />
      <Answer text="그냥 맛있는거 먹으러 갈까 생각 중이야!" value="I" />
    </div>
  );
}

function On2() {
  return (
    <div className="main-app">
      <ProgressBar step={2} />
      <Question image="https://kakaofriendsmbti.netlify.app/images/02-01.png" />
      <Answer text="영화 완전 재미었어! 너도 한번 봐봐!" value="S" />
      <Answer
        text="좀비가 너무 리얼했어. 실제 상황이면 난 바로 죽었을거야..."
        value="N"
      />
    </div>
  );
}

function On3() {
  return (
    <div className="main-app">
      <ProgressBar step={3} />
      <Question image="https://kakaofriendsmbti.netlify.app/images/03-01.png" />
      <Answer text="무슨 꽃 샀어? 향은 좋아?" value="T" />
      <Answer text="왜 우울해? 무슨 일 있어?" value="F" />
    </div>
  );
}

function On4() {
  return (
    <div className="main-app">
      <ProgressBar step={4} />
      <Question image="https://kakaofriendsmbti.netlify.app/images/04-01.png" />
      <Answer
        text="지금 PPT 만드는 중이니까 아마 한 2시간 뒤면 끝날거 같아!"
        value="J"
      />
      <Answer text="모르겠어. 근데 지금 PPT 만들고 있어!" value="P" />
    </div>
  );
}

function On5() {
  return (
    <div className="main-app">
      <ProgressBar step={5} />
      <Question image="https://kakaofriendsmbti.netlify.app/images/05-01.png" />
      <Answer
        text="그래! 역시 사람 많고 유명한 벚꽃 명소가 예쁘겠지 어디로 갈까?"
        value="E"
      />
      <Answer text="그래! 사람 적은 벚꽃 명소 한 번 찾아볼까?" value="I" />
    </div>
  );
}

function Result() {
  const navigation = useNavigate();

  const { state } = useLocation();

  const [result, setResult] = React.useState(undefined);

  const { setDispatchType } = React.useContext(StoreContext);

  const MBTI결과가져오기 = async () => {
    await axios({
      url: "http://localhost:5000/mbti",
      methos: "GET",
      responseType: "json",
      params: state,
    })
      .then(({ data }) => {
        // console.log(data);
        setResult(data);
      })
      .catch((e) => {
        console.log("에러!!", e);
      });
  };

  React.useEffect(() => {
    MBTI결과가져오기();
    setDispatchType({
      code: "로컬스토리지삭제",
    });
  }, []);

  if (result === undefined) {
    return <div></div>;
  }

  return (
    <div className="main-app">
      <img className="result-img" src={result.content} alt="결과화면" />
      <button
        className="btn"
        onClick={() => {
          navigation("/on1");
        }}
      >
        다시하기
      </button>
    </div>
  );
}

function Main() {
  /**
   * 왜가져왔는지?
   * App으로 넘기기위해~
   */
  const { setDispatchType } = React.useContext(StoreContext);

  const navigation = useNavigate();
  /**
   * 로컬스토리지 적용
   */
  React.useEffect(() => {
    /* 여기서 하지 말고
    const 기억되어있는MBTI = localStorage.getItem('MBTI');
    const 기억되어있는PAGE = localStorage.getItem('PAGE');
    //mbti 값 교체
    //페이지 값 교체
    if(기억되어있는MBTI && 기억되어있는PAGE){
    }*/

    /**
     * APP에서 응답코드 별 처리하는곳으로 넘김
     */
    setDispatchType({
      code: "임시저장",
    });
  }, []); //빈 배열 한번만 실행 중요!!

  return (
    <div className="main-app">
      <img
        src="https://kakaofriendsmbti.netlify.app/static/media/00.88f71908.png"
        alt="메인이미지"
      />
      <button
        className="btn"
        type="button"
        onClick={() => {
          navigation("/on1");
        }}
      >
        시작하기
      </button>
    </div>
  );
}

const StoreContext = React.createContext({});

function App() {
  const navigation = useNavigate();

  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });

  const [mbti, setMbti] = React.useState([
    {
      E: 0,
      I: 0,
    },
    {
      N: 0,
      S: 0,
    },
    {
      F: 0,
      T: 0,
    },
    {
      J: 0,
      P: 0,
    },
  ]);

  let [page, setPage] = React.useState(1);

  const [loginUser, setLoginUser] = React.useState({
    id: "zz",
    pw: "zz",
  });

  React.useEffect(() => {
    switch (dispatch.code) {
      /**
       * mbti state값을 바꾸는 로직 구현
       */
      case "답변":
        const { value } = dispatch.params;
        const clonembti = [...mbti];

        const findIndex = clonembti.findIndex((item) => {
          return item[value] !== undefined;
        });

        clonembti[findIndex][value]++;
        setMbti(clonembti);

        /**
         * 페이지 이동
         */
        const nextPage = (page += 1);
        setPage(nextPage);

        /**로컬스토리지에 데이터 저장
         * mbti 결과 객체
         * 다음페이지정보
         */
        localStorage.setItem("MBTI", JSON.stringify(clonembti));
        localStorage.setItem("PAGE", nextPage);

        /**
         * 페이지 이동 on숫자(증가)
         * 마지막 페이지일때 예외처리 결과페이지로 이동
         */
        if (nextPage === 6) {
          navigation("/result", {
            state: mbti,
          });
        } else {
          navigation(`/on${nextPage}`);
        }
        break;
      /**
       * 임시저장 로직 구현
       */
      case "임시저장":
        const 기억되어있는MBTI = localStorage.getItem("MBTI");
        const 기억되어있는PAGE = localStorage.getItem("PAGE");

        if (기억되어있는PAGE > "5") {
          localStorage.removeItem("MBTI");
          localStorage.removeItem("PAGE");
          return;
        }
        /**
         * 저장되어있는 mbti 값으로 교체
         * 저장되어있는 페이지로 교체
         */
        if (기억되어있는MBTI && 기억되어있는PAGE) {
          const 기억되어있는MBTI배열 = JSON.parse(기억되어있는MBTI);
          setMbti(기억되어있는MBTI배열);
          setPage(Number(기억되어있는PAGE)); //페이지는 숫자로 들어가야함
          navigation(`/on${기억되어있는PAGE}`);
        }
        break;
      /**내가 추가한 부분
       * result에서 다시하기 버튼을 누르면 여기로 이동
       * page와 mbti 데이터 초기화가 안되서 강제로 초기화 시켜줌
       */
      case "로컬스토리지삭제":
        localStorage.removeItem("MBTI");
        localStorage.removeItem("PAGE");
        setPage(1);
        setMbti([
          { E: 0, I: 0 },
          { N: 0, S: 0 },
          { F: 0, T: 0 },
          { J: 0, P: 0 },
        ]);
        break;

      default:
        break;
    }
  }, [dispatch]);

  return (
    <StoreContext.Provider value={{ setDispatchType }}>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/on1" element={<On1 />} />
        <Route exact path="/on2" element={<On2 />} />
        <Route exact path="/on3" element={<On3 />} />
        <Route exact path="/on4" element={<On4 />} />
        <Route exact path="/on5" element={<On5 />} />
        <Route exact path="/result" element={<Result />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
