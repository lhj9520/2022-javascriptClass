let order = 0;
const lastOrder = $(".slides > div").length - 1;

$(".btns > button")
  .eq(0)
  .on("click", function () {
    // alert("좌 버튼");
    if (order === 0) {
      order = lastOrder;
    } else {
      order--;
    }

    $(".slides > div").removeClass("active");
    $(".slides > div").eq(order).addClass("active");
  });

$(".btns > button")
  .eq(1)
  .on("click", function () {
    // alert("우 버튼");

    if (order === lastOrder) {
      order = 0;
    } else {
      order++;
    }

    $(".slides > div").removeClass("active");
    $(".slides > div").eq(order).addClass("active");
  });

$(".slides > div").on("click", function (event) {
  const target = $(event.target);
  const index = target.index();
  order = index;

  $(".slides > div").removeClass("active");
  $(".slides > div").eq(order).addClass("active");
});
