
const watchlistContainerEl = document.getElementById('main-container-watchlist')

  renderWatchlist()



function renderWatchlist(){
  let values = Object.keys(localStorage).map(key=> localStorage.getItem(key)).join('')
  watchlistContainerEl.innerHTML = values

}

watchlistContainerEl.addEventListener('click', function(e){
  let itemKeyId = e.target.id.replace('watchlist-', '')
  localStorage.removeItem(itemKeyId)
  renderWatchlist()
  console.log(itemKeyId)
})


