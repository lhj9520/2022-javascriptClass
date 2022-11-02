const express = require("express");
const app = express();
const cors = require("cors");

/**
 * DB : 데이터 영구저장소
 */
const DB = {
  장바구니: [],
  테스트: [],
};

app.use(
  cors({
    origin: true,
  })
);

const port = 4000;

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/add/cart", (req, res) => {
  DB.장바구니.push(req.query);

  console.log(DB.장바구니);
});

app.get("/delete/cart", (req, res) => {
  const item = req.query;
  const newMyCart = DB.장바구니.filter((myItem) => {
    return myItem.name !== item.name;
  });

  DB.장바구니 = newMyCart;
});

app.get("/myCart", (req, res) => {
  // DB에있는 장바구니 send해주기!

  console.log(DB.장바구니);

  res.send(DB.장바구니);
});

app.get("/test", (req, res) => {
  DB.테스트.push("테스트중입니다");

  console.log(DB.테스트);

  res.send({
    code: "success",
    msg: "테스트 성공",
  });
});

/**
 * 쿼리스트링
 * req : 요청
 * res : 응답
 */

app.listen(port, () => {
  console.log("Start Node.js Server");
});
