const title = document.getElementById('titleInput');
const year = document.getElementById('yearInput');
const runtime = document.getElementById('runtimeInput');
const genres = document.getElementById('genresInput');
const synopsis = document.getElementById('synopsisInput');
const languages = document.getElementById('languagesInput');
const directors = document.getElementById('directorInput');
const writers = document.getElementById('writersInput');
const actors = document.getElementById('actorsInput');

async function getMovieUpdate(){
    const movieId = localStorage.getItem('movieId');

    const response = await fetch('http://localhost:8080/movies/' + movieId);
    const movie = await response.json();

    title.value = movie.title;
    year.value = movie.year;
    runtime.value = movie.runtime;
    genres.value = movie.genres;
    synopsis.value = movie.synopsis;
    languages.value = movie.language;

    const directorsMovie = movie.people.directors;
    const writersMovie = movie.people.writers;
    const actorsMovie = movie.people.actors;

    directorsMovie.forEach(function(dir) {
        if(dir){
            const fullName = `${dir.name} ${dir.surname} `;
            directors.value += fullName;
        }
    });

    writersMovie.forEach(function(dir) {
        if(dir){
            const fullName = `${dir.name} ${dir.surname} `;
            writers.value += fullName;
        }
    });

    actorsMovie.forEach(function(dir) {
        if(dir){
            const fullName = `${dir.name} ${dir.surname} `;
            actors.value += fullName;
        }
    });

}

updateForm.addEventListener('submit', function(e){
    e.preventDefault();

    const movieId = localStorage.getItem('movieId');
    const newTitle = title.value;
    const newYear = year.value;
    const newRuntime = runtime.value;
    const newGenres = genres.value;
    const newSynopsis = synopsis.value;
    const newLanguages = languages.value;

    const movieUpdate = {
        movieId,
        newTitle,
        newYear,
        newRuntime,
        newGenres,
        newSynopsis,
        newLanguages
    };

    const updateData = JSON.stringify(movieUpdate);

    const xhr = new XMLHttpRequest(); 
    const url = 'http://localhost:8080/movies/update';

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json'); 

    xhr.send(updateData);

    setTimeout(() => {
        window.location.href = 'details.html';
    }, 1500 + Math.random() * 1000);
});

getMovieUpdate();