const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

//임시?간이? 디비
const DB = {
  todo: [],
};

app.listen(3000, function () {
  console.log("Node.js Start...");
});

app.get("/", function (req, res) {
  res.send("Hello Node.js!!!");
});

//디비에 저장된 데이터 응답
app.get("/getTodo", function (req, res) {
  res.send(DB.todo);
});

//디비에 저장된 데이터 삭제
app.get("/deleteAll", function (req, res) {
  DB.todo = [];

  console.log(DB.todo);

  res.send({
    code: "success",
    msg: "성공적으로 삭제되었습니다.",
  });
});

//디비에 저장된 데이터 삭제
app.get("/deleteTodo", function (req, res) {
  const index = req.query.todoindex;

  DB.todo.splice(index, 1);

  console.log(DB.todo);

  res.send({
    code: "success",
    msg: "성공적으로 삭제되었습니다.",
  });
});

//데이터 추가 url요청이 오면 데이터 받아서 저장 이에 대한 응답
app.get("/addTodo", function (req, res) {
  const todo = req.query.todo;

  //어펜드와같이 뒤로 넣어짐
  // DB.todo.push(todo);
  //반대는 unshift
  DB.todo.unshift(todo);

  console.log(DB.todo);

  res.send({
    code: "success",
    msg: "성공적으로 저장되었습니다.",
  });
});
