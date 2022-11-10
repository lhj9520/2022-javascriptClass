const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const characters = [
  {
    name: "콘",
    content: "https://kakaofriendsmbti.netlify.app/images/ENFJ.png",
    mbti: "ENFJ", // for , for of [구글 에서 검색]
  },
  {
    name: "빠냐",
    content: "https://kakaofriendsmbti.netlify.app/images/ESTJ.png",
    mbti: "ESTJ",
  },
  {
    name: "앙몬드",
    content: "https://kakaofriendsmbti.netlify.app/images/INFP.png",
    mbti: "INFP",
  },
  {
    name: "어피치",
    content: "https://kakaofriendsmbti.netlify.app/images/ENTP.png",
    mbti: "ENTP",
  },
  {
    name: "죠르디",
    content: "https://kakaofriendsmbti.netlify.app/images/ISFJ.png",
    mbti: "ISFJ",
  },
];

app.use(cors());

app.get("/", (req, res) => {
  res.send("안녕하슈");
});

app.get("/mbti", (req, res) => {
  //   res.send("여기는 MBTI 결과값을 리턴해야합니다.");
  console.log(req.query);
  let result = "";
  const mbti = req.query;

  for (let key in mbti) {
    const 객체 = mbti[key];
    // const mbti_key = Object.keys(value);

    //destructuring
    const [leftk, rightk] = Object.keys(객체);
    const [leftv, rightv] = Object.values(객체);

    if (leftv >= rightv) {
      result += leftk;
    } else {
      result += rightk;
    }
  }
  console.log(result);

  const [result2] = characters.filter((item, index) => {
    return item.mbti === result;
  });

  console.log(result2);

  res.send(result2);
});

app.listen(port, () => {
  console.log("서버가 실행되었습니다.");
});
