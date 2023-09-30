const apiKey = 'ac0691b'
const watchingList = JSON.parse(localStorage.getItem("watchlist")) || [];


window.addEventListener('load',chechList)


function chechList(){
     if (watchingList.length > 0){
        collectImdb()
        }
    else{
        watching_list.innerHTML=`<div class="before_movie">
            <p class="start">Your watchlist is looking a little empty...</p>
            <a href="index.html" class="start">Let’s add some movies!</a>
       </div>`        
    }
}

async function collectImdb(){
    let allData=''    
    for(let imdbId of watchingList){
         const allMovieJson = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}&plot=full`)
         const movieResult = await allMovieJson.json();
         for(let movie of [movieResult]){
             
             let plot = movie.Plot.slice(0,200)   
             
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
                            <button id="${movie.imdbID}" data-watchlistbtn="${movie.imdbID}" class="add-to-watchlist">Remove</button>
                        </div>
                    </div>
                    <p class="movie-description">
                        ${plot}...
                    </p>
                </div>
            </div>
             `
         }
    }
    watching_list.innerHTML=allData
}

document.addEventListener('click', function(e){
    if(e.target.dataset.watchlistbtn){
       handleRemoveClick(e.target.dataset.watchlistbtn) 
    }
})

function handleRemoveClick(idOfMovie){
    if(watchingList.includes(idOfMovie)) {
        watchingList.splice(watchingList.indexOf(`${idOfMovie}`), 1)
        localStorage.setItem("watchlist", JSON.stringify(watchingList))
        chechList()
    }
}

