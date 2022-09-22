/*
전송이나 엔터 눌렀을 때 이벤트를 넣는다. (event.keyCode === 13)
내가 입력한 값을 가져온다. $('.input').val()
입력한 값 그대로 채팅에 들어간다. append()
입력창에 입력한 문자를 지워준다. $('.input').val('')
 */

$("#input-form").on("submit", function (event) {
  //submit 새로고침 되는걸 막아줌
  event.preventDefault();

  const checkedValue = $("input[name=me]:checked").val();
  /**
   * 차이점
   * 1. class id가 other 이냐 mine
   * 2. 홍길동이냐 아들이냐
   */

  const role = checkedValue === "엄마" ? "mine" : "other";
  const name = checkedValue === "엄마" ? "홍길동" : "아들";

  const chat_value = $("#text-input").val();

  const chat_html = `<div class="chat-message ${role}">
  <section><i class="fa fa-user"></i></section>
  <span>${name}</span>
  <div>${chat_value}</div>
  </div>`;

  $(".message-box > .message-group").last().append(chat_html);
  $("#text-input").val("");

  //자동스크롤
  $(".message-box").scrollTop(99999999999999);
});
