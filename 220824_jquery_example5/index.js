$(document).ready(function () {
  /**
   * 1. 데이터를 가져온다 jquery ajax
   * 2. 가져온 다음에 배열로 있는 데이터를 반복문 돌리면서 카드를 만들어준다(html)
   * 3. html을 append 해준다
   */
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon?limit=9&offset=18",
    success: function (response) {
      console.log(response.results);
      let html = "";
      const pocketmonList = response.results;

      for (let i = 0; i < pocketmonList.length; i++) {
        const pocketmon = pocketmonList[i];

        html += `<div class="card card-number-0 grass">
                    <div>
                        <p>#${i + 1}</p>
                        <h3 class="white name">${pocketmon.name}</h3>
                    </div>
                    <div>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          i + 1
                        }.png">
                    </div>
                </div>`;
      }

      $("#list").append(html);
    },
  });
});
