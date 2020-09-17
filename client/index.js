const movieCards = document.getElementById('movie-cards');

async function getMovies(){
    const response = await fetch('http://localhost:8080/movies');
    const json = await response.json();

    json.forEach(function(movie) {
        const movieCard = createMovieCard(movie);
        movieCards.appendChild(movieCard);
    });
}

function createMovieCard(movie){
    const card = document.createElement('div');
    const title = document.createElement('a');
    const year = document.createElement('h5');
    const picture = document.createElement('img');
    const btnDelete = document.createElement('button');
    const btnUpdate= document.createElement('button');
    const divBtn = document.createElement('div');
    
    card.classList.add('card');
    
    title.classList.add('cardTitle');
    title.href = 'movies/details.html';
    title.addEventListener('click', function(e){
        localStorage.setItem('movieId', movie._id);
    })
    title.textContent = movie.title;

    btnDelete.classList.add('btnDelete');
    btnDelete.setAttribute('dataId', movie._id);
    btnDelete.addEventListener('click', function(e){
        const movieId = e.target.getAttribute('dataId');

        const movie = {
            movieId
        }
        
        const data = JSON.stringify(movie);

        const xhr = new XMLHttpRequest(); 
        const url = 'http://localhost:8080/movies/';

        xhr.open('DELETE', url, true);

        xhr.setRequestHeader('Content-Type', 'application/json'); 

        xhr.send(data);

        location.reload();
    });

    btnUpdate.classList.add('btnUpdate');
    btnUpdate.addEventListener('click', function(e){
        localStorage.setItem('movieId', movie._id);
        window.location.href = 'movies/update.html';
    });


    divBtn.classList.add('divBtn');
    divBtn.appendChild(btnDelete);
    divBtn.appendChild(btnUpdate);
    
    picture.classList.add('cardPicture');
    picture.src = movie.picture;
    
    year.classList.add('cardYear');
    year.textContent = movie.year;
    
    card.appendChild(picture);
    card.appendChild(title);
    card.appendChild(year);
    card.appendChild(divBtn);

    return card;
}

getMovies();