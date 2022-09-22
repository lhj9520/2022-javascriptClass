/*
$(".page-nav > div").click(function (event) {
  const target = $(event.target);
  const myOrder = target.index();

  // 사진 변경
  $(".slides > div").removeClass("active");
  $(".slides > div").eq(myOrder).addClass("active");

  // 메뉴 활성화 변경
  target.siblings().removeClass("active");
  target.addClass("active");
});

setInterval(function () {
  let changeIndex = $(".page-nav > .active").index() + 1;

  if ($(".page-nav > div").length === changeIndex) {
    changeIndex = 0;
  }

  // 사진 변경
  $(".slides > div").removeClass("active");
  $(".slides > div").eq(changeIndex).addClass("active");

  $(".page-nav > div").removeClass("active");
  $(".page-nav > div").eq(changeIndex).addClass("active");
}, 2000);
*/

$(".page-nav > div").on("click", function (event) {
  const target = $(event.target);
  const myOrder = target.index();

  $(".slides > div").removeClass("active");
  $(".slides > div").eq(myOrder).addClass("active");

  $(".page-nav > div").removeClass("active");
  $(".page-nav > div").eq(myOrder).addClass("active");
});
