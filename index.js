const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filterMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchform = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ``
  for (page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies //這句話意思 當filterMovies.length有東西的話 給我filterMovies 反之如果沒有東西的話給我movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)//slice(a,b) slice是用來分割的 a代表分割的起點 b代表分割的終點(記得是切割到終點的前一位) 假設slice(1,11) 代表從第1個元素切個到第10個元素 
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title,image
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal"data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`

  })
  dataPanel.innerHTML = rawHTML
}

/* const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
          <button class="btn btn-info btn-add-favorite">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
} */
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  /*  console.log(id) *///測試用

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //一開始會用空陣列 是因為一開始在選取喜歡的電影前 最愛點影清單式空的 為了讓下面可以執行 所以用了OR判斷句 使一開始空陣列的時候 可以繼續執行   //JSON.parse()可以幫我們把括弧內的資料變成JSON字串 再運用第92行JSON.stringify(list) 把括弧中的JSON字串 轉喚回原本的資料類型  這是一個轉換技巧

  /*  function isMovieIDMatched(movie){
     return movie.id === id
   }
    const movie = movies.find(isMovieIDMatched) //先利用find把movies裡面的80部電影一個一個代入function isMovieIDMatched(movie)做判斷 看看我們點擊進去的id有沒有符合 符合的話就會是True 傳回find函式 當find有一個true時 就會回傳收到的值並結束執行 */
  const movie = movies.find(movie => movie.id === id)//上面那串可以簡化成這行
  if (list.some(movie => movie.id === id)) {  //some 只會回報「陣列裡有沒有 item 通過檢查條件」，有的話回傳 true ，
    return alert('此電影已經在收藏清單中!!')    //到最後都沒有就回傳 false。
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  /* console.log(movie) */
  console.log(list)
}


// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function OnPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchform.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()//用來防止點擊搜尋buttom時 網頁刷新
  console.log(searchInput.value)//searchInput.value 代表可以把搜尋框的搜尋內容值 取出來 記得一定要加value
  const keyword = searchInput.value.trim().toLowerCase()
  //.trim()用來把前後的空白去掉 可以防止在搜尋時只有空白但判斷keyword不為0的情況 
  //toLowerCase()用來讓所有搜尋的值 都變成小寫 就不會有大小寫搜尋不到的問題 當然電影清單的title也會使用toLowerCase()統一變成小寫



  /* if (!keyword.length) {   //會加一個!符號 是因為當keyword.length為0時 顯示的布林值是false 所以必須加一個!符號 使郭湖內的布林值變成true 才能進行我們要的判斷
    return alert('Please enter a valid string')
  } */

  /* for(const movie of movies){
    if(movie.title.toLowerCase().includes(keyword)){
      filterMovies.push(movie)
    }
  } *///這是for迴圈的作法 當中的movie可以隨意const 成其他字像是movieDDD之類的 因為這句話可以解讀成 把 movies變成movie來看後 再用movie來做判斷或是執行之後的條件

  /*  filterMovies = movies.filter(function movieList1(movie) {
     return movie.title.toLowerCase().includes(keyword)
   }) */ //這一串簡化成下面這一行

  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword)) //movies.filter()中的filter()函式會把前面movies當中的所有元素丟到filter()括弧中的條件函式去做判斷 如果符合為true會留下 如果不符合 為false 則會捨棄  所以利用filter()函式可以做判斷

  if (filterMovies.length === 0) {
    return alert('Cant not find movies with keyword:' + keyword)
  }

  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))

})


axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  /* renderMovieList(movies) //新增這裡 *///請修改成下面這段
  renderPaginator(movies.length) //重製分頁器
  renderMovieList(getMoviesByPage(1)) //預設顯示第 1 頁的搜尋結果
})
  .catch((err) => console.log(err))

/* localStorage.setItem('defult_language','english')//用來儲存一個key&value
localStorage.getItem('defult_language')//呼叫key,可以呼叫對應的value
localStorage.removeItem('defult_language')//去除key 同時去除對應的value
console.log(localStorage.getItem('defult_language')) */
