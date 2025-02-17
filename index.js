
const searchBtnEl = document.getElementById('search-btn')
const searchInputEl = document.getElementById('search-input')
const mainContainerEl = document.getElementById('main-container')

let movieSearched


searchBtnEl.addEventListener('click', async function(e){

    e.preventDefault()
    let htmlString = ''

    if (!searchInputEl.value.trim()) { 
        e.preventDefault() // Prevent submission
        searchInputEl.reportValidity() // Show browser's built-in required message
        return
        }
   
   movieSearched = searchInputEl.value.trim()
   let moviesArray = await fetchMovies(movieSearched) // Grab the 10 movies array
  

    // Fetch all movie details in parallel using Promise.all
    let movieDetails = await Promise.all(moviesArray.map(movie => movieInformation(movie.imdbID)));

    // Generate HTML for each movie
    htmlString = movieDetails.map(movieInfo => printMovieDataInHtml(movieInfo)).join('');


    searchInputEl.value = ''
    mainContainerEl.innerHTML = htmlString

    document.getElementById('main-container').addEventListener('click', function(e){

        let elementId = e.target.id
        let addedMovieId = e.target.id.replace('watchlist-', '')

        if(document.getElementById(elementId).textContent === 'Remove'){
            localStorage.removeItem(addedMovieId)
            document.getElementById(elementId).textContent = 'Add to Watchlist'
            return
        }
        document.getElementById(elementId).textContent = 'Remove'

        

        // Grabs the parent and all child elements
        let parentElementString = document.getElementById(addedMovieId).outerHTML 
        //adding the movie IMDB ID as a key and the movie html format as a value
        localStorage.setItem(addedMovieId,parentElementString)     
      

    })

})

async function fetchMovies(searchInput){
    let response = await fetch(`https://www.omdbapi.com/?s=${searchInput}&apikey=6e23b5d3`)
    let data = await response.json()
    return data.Search
    
}

async function movieInformation(imdbId){
    let response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=6e23b5d3`)
    let data = await response.json()
    return data
}



function printMovieDataInHtml(movieObj){

    if(movieObj.Poster === 'N/A'){
        movieObj.Poster = 'images/noPosterImage.jpg'
    }
    let htmlString = ''
    htmlString = `
        <div  id="${movieObj.imdbID}"class="movie-container">
            <img src="${movieObj.Poster}" />
            <div class="movie-box">
                <h3>${movieObj.Title} ⭐ ${movieObj.imdbRating}</h3>
                <div class="movie-info-container">
                    <p>${movieObj.Runtime}</p>
                    <p>${movieObj.Genre}</p>
                    <button id="watchlist-${movieObj.imdbID}">Add to watchlist</button>
                </div>
            <p>
                ${movieObj.Plot}
            </p>
            </div>
        </div>
    `
    return htmlString
}


