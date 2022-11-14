const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const port = 4000;

/**
 * 임시 DB 만들어줌
 * 다음시간에 Mysql 사용할거임
 */
const DB = {
  user: [
    {
      id: "asd",
      pw: "asd",
    },
  ],
};

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

app.get("/", (req, res) => {
  res.send("안녕하슈");
});

app.post("/join", (req, res) => {
  //post에서 확인하려면 body get은 query
  //   console.log(req.body);
  const { id, pw } = req.body;
  //   console.log(id, pw);

  DB.user.push({
    id: id,
    pw: pw,
  });

  console.log(DB.user);

  res.send({
    code: "success",
    message: "회원가입되었습니다",
  });
});

app.get("/test", (req, res) => {
  console.log(req.session);
  res.send("//");
});

app.post("/login", (req, res) => {
  const { id, pw } = req.body;

  /**
   * DB에 저장된 로그인 정보와 입력받은 로그인 정보와 비교하여 일치하는지 확인
   * find
   * 로그인에 성공하면 세선에 findUser를 저장해야함
   */
  const user = DB.user;
  const findUser = user.find((item) => {
    return item.id === id && item.pw === pw;
  });

  console.log(findUser);
  /**
   * 세션 저장
   * loginUser => 아무거나 써도 됨 변수 객체 키 내가 설정ㅇㅇ
   */
  req.session.loginUser = findUser;
  req.session.save();

  res.send("/");
});

app.listen(port, () => {
  console.log("서버가 실행되었습니다.");
});
