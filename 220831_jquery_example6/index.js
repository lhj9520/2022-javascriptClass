/**
 * TodoList 시나리오
 * ========= 입력한 Todo 기록하기 ===========
 * 1. form으로 감싸서 submit을 이벤트로 받는다
 * 2. 새로고침 막고 preventDefault()
 * 3. 입력한 값 가져오기
 * 4. 위로 데이터 쌓기 prepend
 * 5. 쌓은 다음 내가 입력한 input 빈 값 만들기
 *
 * ========= clear 버튼 구현 ===============
 * 1. clear라는 버튼에 onlick 이벤트 넣고
 * 2. todo 없애주기
 *
 * ===========단일 삭제 버튼 구현==========
 * 1. 삭제 버튼에 이벤트 넣기
 * 2. 삭제하면 되겠죠?\
 *
 * ============단일 수정 구현==============
 * 1. 수정 버튼에 이벤트 넣기
 * 2. input으로 바꾸기전에 텍스트 기억하기
 * 3. input으로 변경 값은 이전에 있던 텍스트
 * 4. form으로 submit 이벤트 받음
 *
 * ===========검색 기능 구현================
 * 1. 검색 input에 이벤트 추가 onKeyup 입력될때마다실행
 * 2. event, this 매개변수 받아서 입력하고 있는 값 가져오기 val()
 * 3. todo 내용 다 가져온 다음에 비교하기 배열 반복문 $(선택자).each(function (index,element) {} )
 * 4. span 태그 접근해서 text 확인하기 : startsWith 문법
 * 3. display : show,hide 일치하지 않는 element hide 처리 해주기
 */
$(document).ready(function () {
  addEvents();
});

function deleteTodo(event) {
  //   console.log(event);
  const target = $(event.target);
  //현재 첫번째 태그의 이름이 input인경우 return(수정중임)
  const nowTagName = target.siblings().first().prop("tagName");
  if (nowTagName === "INPUT") {
    return;
  }
  target.parent().remove(); //부모 태그는 li, li를 삭제하면 한줄 지워짐
}

function showUpdateInput(event) {
  //현재 수정중이라면 다른 항목의 수정은 불가함 true(업데이트중)면 return
  const nowUpdate =
    $("#todo-modify-form").find("input[type=text]").length === 0 ? false : true;

  if (nowUpdate === true) {
    $("#todo-modify-form").find("input[type=text]").focus();
    return;
  }
  const target = $(event.target);
  //현재 첫번째 태그의 이름이 input인경우 return(수정중인상태)
  const nowTagName = target.siblings().first().prop("tagName");
  if (nowTagName === "INPUT") {
    return;
  }
  const span = target.siblings("span");
  const html = `<input type="text" value="${span.text()}" />`;
  target.parent().prepend(html);
  span.remove();
}

function addEvents() {
  $("#todo-modify-form").on("submit", function (event) {
    event.preventDefault();
    const updateInput = $("#todo-modify-form").find("input[type=text]");
    const updateTodo = updateInput.val();
    updateInput.parent().prepend(`<span>${updateTodo}</span>`);
    updateInput.remove();
  });

  $("#todo-form").on("submit", function (event) {
    event.preventDefault();

    const todo = $("form > input[type=text]").val();

    //button 태그를 추가할 때 이벤트를 선언해서 추가
    const todohtml = `<li>
    <span>${todo}</span>
    <button type="button" onclick="deleteTodo(event)">삭제</button>
    <button type="button" onclick="showUpdateInput(event)">수정</button>
    </li>`;

    $("form > ul").prepend(todohtml);

    $("form > input[type=text]").val("");
  });

  //그냥 button은 form이 전송됨 type="button" 추가
  $("form > div > button").on("click", function () {
    $("form > ul").empty();
  });

  $("#search-input").on("keyup", function (event) {
    // console.log("이벤트");
    const searchText = $(event.target).val();

    const todos = $("#todo-modify-form > ul > li");

    //검색어가 없을 때 리스트 목록 다 보여주기
    if (searchText === "") {
      todos.show();
      return;
    }

    //forEach
    todos.each(function (index, element) {
      //   console.log(element);
      //span 태그를 찾자 원하는건 텍스트
      const text = $(element).children("span").text();
      if (!text.startsWith(searchText)) {
        $(element).hide();
      }
    });
  });
}
