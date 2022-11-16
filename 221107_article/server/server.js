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

app.post("/article", async (req, res) => {
  const { title, body } = req.body;

  // console.log(req.session.loginUser);
  const { loginUser } = req.session;
  // console.log(user.seq);

  const result = {
    code: "success",
    message: "글작성완료",
  };

  /**
   * 빈제목, 빈내용 예외처리
   */
  if (title === "") {
    result.code = "fail";
    result.message = "제목을 작성해주세요";
  }

  if (body === "") {
    result.code = "fail";
    result.message = "내용을 작성해주세요";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  /**
   * Mysql article 테이블에 INSERT 해줘야함 !!
   */
  const query = `INSERT INTO article(title,body,user_seq) VALUES('${title}','${body}','${loginUser.seq}')`;
  await 디비실행(query);

  res.send(result);
});

app.post("/reply", async (req, res) => {
  const { user_seq, article_seq, body } = req.body;

  // console.log(req.body);

  const result = {
    code: "success",
    message: "댓글등록완료",
  };

  /**
   * 로그인 & 빈댓글 예외처리
   */

  if (user_seq === undefined) {
    result.code = "fail";
    result.message = "로그인해주세요";
  }

  if (body === "") {
    result.code = "fail";
    result.message = "댓글을 입력해주세요";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  const query = `INSERT INTO reply(boody,user_seq,article_seq) VALUES ('${body}',${user_seq},${article_seq});`;
  await 디비실행(query);

  res.send(result);
});

app.get("/articlelist", async (req, res) => {
  const result = {
    code: "success",
    message: "글목록불러오기완료",
    list: [],
  };

  /**
   * Mysql article 테이블 전체 조회
   */
  // const query = `SELECT * FROM article`;
  const query = `SELECT a.*,u.nickname FROM article AS a, USER AS u WHERE a.user_seq = u.seq;`;
  const 글목록 = await 디비실행(query);
  result.list = 글목록;
  res.send(result);
});

app.get("/articleview", async (req, res) => {
  const { seq } = req.query;

  const result = {
    code: "success",
    message: "글상세불러오기",
    article: [],
    reply: [],
  };

  const query = `SELECT a.*,u.nickname FROM article AS a, USER AS u WHERE a.user_seq = u.seq AND a.seq = ${seq};`;
  const 글상세 = await 디비실행(query);
  result.article = 글상세;

  const query2 = `SELECT u.nickname,r.boody FROM article AS a, USER AS u, reply AS r WHERE a.seq = ${seq} AND r.user_seq=u.seq AND r.article_seq=a.seq;`;
  const 댓글목록 = await 디비실행(query2);
  result.reply = 댓글목록;

  // console.log(result);
  res.send(result);
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
