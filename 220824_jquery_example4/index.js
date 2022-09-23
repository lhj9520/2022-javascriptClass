/**
 * ================1단계==================
 * 0. 어디서 가져올지 생각해본다
 * 1. 데이터를 가져온다 jquery ajax
 * 2. 데이터를 보여줄 화면을 선택자로 가져온다
 * 3. [100개의 데이터] => 반복문을 돌리면서 html을 만들어준다
 * 4. append(html)
 */

$(document).ready(function () {
  let html = "<table>";
  html += "<thead><th>번호</th><th>글 제목</th><th>작성자</th></thead>";
  html += "<tbody>";

  //비동기!!!!!!!!!
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    async: false, //동기로 설정
    success: function (response) {
      // console.log(response);
      // const container = $(".container");

      for (let i = 0; i < response.length; i++) {
        const data = response[i];

        html += `<tr>
        <td>${data.id}</td>
        <td>${data.title}</td>
        <td>${data.userId}</td>
        </tr>`;
      }
    },
  });

  //비동기면 아래가 먼저 실행되서 화면에 아무것도 안뜸
  html += "</tbody>";
  html += "</table>";

  $(".container").append(html);
});
