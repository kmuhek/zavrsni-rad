const movieCards = document.getElementById('movie-card');
const movieDetails = document.getElementById('movie-details');
const reviews = document.getElementById('reviews');
const addCommentForm = document.getElementById('addReviewForm');

async function getMovieDetails(){
    const movieId = localStorage.getItem('movieId');

    const response = await fetch('http://localhost:8080/movies/' + movieId);
    const movie = await response.json();

    const movieCard = createMovieCard(movie);
    movieCards.appendChild(movieCard);

    const movieDetail = createMovieDetail(movie);
    movieDetails.appendChild(movieDetail);

    movie.reviews.forEach(function (review) {
        const reviewCard = createReviewCard(review);
        reviews.appendChild(reviewCard);
    });
}

function createMovieCard(movie){
    const card = document.createElement('div');
    const title = document.createElement('h1');
    const year = document.createElement('h5');
    const picture = document.createElement('img');

    card.classList.add('cardMovie');
    
    title.classList.add('cardTitle');
    title.textContent = movie.title;
    
    picture.classList.add('cardPicture');
    picture.src = movie.picture;
    
    year.classList.add('cardYear');
    year.textContent = movie.year;
    
    card.appendChild(picture);
    card.appendChild(title);
    card.appendChild(year);

    return card;
}

function createReviewCard(review) {
    const root = document.createElement('div');
    const username = document.createElement('h3');
    const date = document.createElement('div');
    const comment = document.createElement('p');
    const rating = document.createElement('div');

    root.classList.add('reviews');
    username.classList.add('reviewUsername');
    date.classList.add('reviewDate');
    rating.classList.add('reviewRating');
    comment.classList.add('reviewComment');

    username.textContent = review.username;
    date.textContent = 'Posted on ' + review.date;
    comment.textContent = review.comment;
    rating.textContent = `Rating: ${review.rating}/5`;

    root.appendChild(username);
    root.appendChild(comment);
    root.appendChild(rating);
    root.appendChild(date);

    return root;
}

function createMovieDetail(movie){
    const cardDetail = document.createElement('div');
    const director = document.createElement('h3');
    const actor = document.createElement('h3');
    const writer = document.createElement('h3');
    const runtime = document.createElement('h3');
    const genres = document.createElement('h3');
    const synopsis = document.createElement('p');
    const language = document.createElement('h3');

    cardDetail.classList.add('detailsMovie');
    
    const directors = movie.people.directors;
    const actors = movie.people.actors;
    const writers = movie.people.writers;
    
    language.classList.add('cardYear');
    language.textContent = `Languages: ${movie.language}`;

    synopsis.classList.add('cardSynopsis');
    synopsis.textContent = movie.synopsis;

    runtime.classList.add('cardYear');
    runtime.textContent = `Runtime: ${movie.runtime} min`;

    genres.classList.add('cardYear');
    genres.textContent = `Genres: ${movie.genres}`;

    director.classList.add('cardYear');
    director.textContent = 'Directors: '
    directors.forEach(function(dir, index) {
        if(dir){
            const dirA = document.createElement('a');
            const div = document.createElement('div');
    
            const fullName = `${dir.name} ${dir.surname}`;
    
            dirA.textContent = fullName;
            div.appendChild(dirA);
    
            director.appendChild(div);
            dirA.href = '../people/people.html';
    
            dirA.addEventListener('click', function(){
                localStorage.setItem('peopleId', movie.people.directors[index]._id);
            });
        }
    });

    actor.classList.add('cardYear');
    actor.textContent = 'Actors: '
    actors.forEach(function(act, index) {
        if(act){
            const actA = document.createElement('a');
            const div = document.createElement('div');
    
            const fullName = `${act.name} ${act.surname}`;
    
            actA.textContent = fullName;
            div.appendChild(actA);
    
            actor.appendChild(div);
            actA.href = '../people/people.html';
    
            actA.addEventListener('click', function(){
                localStorage.setItem('peopleId', movie.people.actors[index]._id);
            });
        }
    });

    writer.classList.add('cardYear');
    writer.textContent = 'Writers: '
    writers.forEach(function(wri, index) {
        if(wri){
            const wriA = document.createElement('a');
            const div = document.createElement('div');
    
            const fullName = `${wri.name} ${wri.surname}`;
    
            wriA.textContent = fullName;
            div.appendChild(wriA);
    
            writer.appendChild(div);
            wriA.href = '../people/people.html';
    
            wriA.addEventListener('click', function(){
                localStorage.setItem('peopleId', movie.people.writers[index]._id);
            });
        }
    });

    cardDetail.appendChild(genres);
    cardDetail.appendChild(director);
    cardDetail.appendChild(writer);
    cardDetail.appendChild(actor);
    cardDetail.appendChild(runtime);
    cardDetail.appendChild(synopsis);
    cardDetail.appendChild(language);

    return cardDetail;
}

addCommentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('usernameInput').value;
    const comment = document.getElementById('commentInput').value;
    const rating = document.getElementById('ratingInput').value;
    const movieId = window.localStorage.getItem('movieId');

    const review = {
        username,
        comment,
        rating,
        movieId
    };

    const postData = JSON.stringify(review);

    const xhr = new XMLHttpRequest(); 
    const url = 'http://localhost:8080/reviews/';

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json'); 

    xhr.send(postData);

    location.reload();
});

getMovieDetails();