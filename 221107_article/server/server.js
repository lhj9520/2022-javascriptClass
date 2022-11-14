const express = require("express");
const cors = require("cors");
/**
 * 세션 호출
 */
const session = require("express-session");
/**
 * DB 연결 수행 전라이브러리 호출
 */
const mysql = require("mysql2");
const db = mysql.createPoolCluster();

const app = express();
const port = 4000;

/**
 * post로 데이터 받으려면 이거 넣어야 됨
 * 안적으면 undefined 출력
 */
app.use(express.json());

/**
 * 로그인 세션 사용하려면 적어줭~
 */
app.use(
  session({
    secret: "SECRET", //여기는 아무값이나 넣어도 됨
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true, //다른도메인에서 온 쿠키 공유 받아줄게
  })
);

/**
 * DB 서버 연결 정보
 */
db.add("articleproject", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "aritlce_project", //아놔 오타 ㅋ
  port: 3306,
});

function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("articleproject", function (error, connection) {
      if (error) {
        console.log("DB 연결 오류", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("쿼리 오류", error);
          reject(true);
        }
        resolve(data);
      });

      //쿼리 밑에 안에가 아니고
      connection.release();
    });
  });
}
app.get("/", async (req, res) => {
  /**
   * 비동기라서 클라이언트로 데이터를 못줌
   * 동기로 바꿔야 됨
   * async await 그리고 Promise!!
   * 디비를 연결해서 쿼리를 사용해야할때마다 이렇게 연결해줘야함 -> 함수화 하여 사용(new Promise 부분 그대로 함수로 뺌)
   */
  const 데이터 = await 디비실행("select * from user");

  console.log(데이터);

  res.send("안녕하슈");
});

app.post("/join", async (req, res) => {
  const { id, pw } = req.body;

  const result = {
    code: "success",
    message: "회원가입되었습니다",
  };

  /**
   * 아이디 중복체크
   * - DB user테이블에 진짜 이 아이디가 존재하는지 확인해야함 !!
   * 구현해주세요
   */
  const 회원 = await 디비실행(`SELECT * FROM user WHERE id = '${id}' `);

  if (회원.length > 0) {
    result.code = "error";
    result.message = "이미 같은 아이디로 회원가입 되어있습니다";
    res.send(result);
    return;
  }

  // Mysql user 테이블에 INSERT 해줘야함 !!
  const query = `INSERT INTO user(id,password,nickname) VALUES('${id}','${pw}','지나가던나그네')`;
  await 디비실행(query);

  res.send(result);
});

app.get("/user", (req, res) => {
  res.send(req.session.loginUser);
});

app.get("/test", (req, res) => {
  console.log(req.session);

  res.send("//");
});

app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  /**
   * 1. 아이디랑 비밀번호가 같은 데이터가 있는 확인 (Mysql DB)
   * - 같은 데이터가 존재하면 session 저장
   * - 없을 경우 [회원 정보가 존재하지 않습니다] 메시지 보내주기~
   */

  const result = {
    code: "success",
    message: "로그인 되었습니다",
  };

  const 회원 = await 디비실행(
    `SELECT * FROM user WHERE id='${id}' AND password='${pw}'`
  );

  if (회원.length === 0) {
    result.code = "error";
    result.message = "회원 정보가 존재하지 않습니다";
    res.send(result);
    return;
  }

  req.session.loginUser = 회원[0];
  req.session.save();

  res.send(result);
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
