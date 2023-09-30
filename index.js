const apiKey = 'ac0691b'
const movie_list = document.getElementById('movie_list')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const imdbIDResult = []
const watchingList = JSON.parse(localStorage.getItem('watchlist')) || [];

document.addEventListener('click', function(e){
    if(e.target.dataset.watchlistbtn){
       handleWatchingClick(e.target.dataset.watchlistbtn) 
    }
})

function handleWatchingClick(idOfMovie){
    if(!watchingList.includes(idOfMovie)) {
        watchingList.unshift(idOfMovie)
        localStorage.setItem(`watchlist`,JSON.stringify(watchingList))
    }
}

searchBtn.addEventListener('click',searchMovie)

async function searchMovie(){
    const res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&apikey=${apiKey}`);
    const searchResult = await res.json();
    if(searchResult.Search){
            for(let result of searchResult.Search){
            imdbIDResult.push(result.imdbID)
            collectImdb(imdbIDResult)            
        }
    }
    else{
        movie_list.innerHTML = `<div class="before_movie">
            <p class="start">Unable to find what you’re looking for. Please try another search.</p>
       </div>`
    }
    searchInput.value=''    
}



async function collectImdb(imdbArray){
    let allData=''    
    for(let imdb of imdbArray){
         const allMovieJson = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdb}&plot=full`)
         const movieResult = await allMovieJson.json();
         for(let movie of [movieResult]){
             
            let plot = `
                ${movie.Plot.slice(0, 200)} 
                <button class="read-btn" data-morebtn="${movie.imdbID}">...Read more</button>`
             
            document.addEventListener('click', (e) => {
                if(e.target.dataset.morebtn === movie.imdbID) {
                    document.getElementById(`${movie.imdbID}-plot`).innerHTML = `
                        ${movie.Plot} 
                        <button class="read-btn" data-lessbtn="${movie.imdbID}">Read less</button>`
                }
                if(e.target.dataset.lessbtn === movie.imdbID) {
                    document.getElementById(`${movie.imdbID}-plot`).innerHTML = `
                    ${movie.Plot.slice(0, 200)} 
                       <button class="read-btn" data-morebtn="${movie.imdbID}">...Read more</button>`
                }
            })
             

                
             allData+=`
                <div class="movie-list-item">
                <div class="movie-image">
                    <img src="${movie.Poster}" alt="Movie Image">
                </div>
                <div class="movie-details">
                    <div class="movie-header">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <span class="star-count">${movie.imdbRating} <i class="fa-regular fa-star"></i></span>
                    </div>
                    <div class="movie-metadata">
                        <div class="movie-info">
                            <span class="count">${movie.Runtime}</span>
                            <span class="type">${movie.Genre}</span>
                            <button id="${movie.imdbID}" data-watchlistbtn="${movie.imdbID}" class="add-to-watchlist">Watching</button>
                        </div>
                    </div>
                    <p id="${movie.imdbID}-plot" class="movie-description">
                        ${plot}
                    </p>
                </div>
            </div>
             `
         }
    }
    movie_list.innerHTML=allData
}