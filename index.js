const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const { MongoClient, ObjectID } = require('mongodb');
const { json } = require('express');

const uri = "mongodb+srv://KristinaMuhek:eKLc$8AMcd$TKL3@dbmovies.fba8d.mongodb.net/dbMovies?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });

app.get('/movies', async function(request, response){
    await client.connect();
    const db = client.db('dbMovies');
    const moviesColl = db.collection('movies');

    const moviesCursor = await moviesColl.find({});

    const movies = [];

    await moviesCursor.forEach(function(movie){
        movies.push(movie);
    });

    response.json(movies);
});

app.get('/movies/:id', async function(request, response){
    const movieid = request.params.id;
    const objectId = new ObjectID(movieid);

    await client.connect();
    const db = client.db('dbMovies');
    const moviesColl = db.collection('movies');
    const peopleColl = db.collection('people');

    const movie = await moviesColl.findOne({_id: objectId});

    const directors = await getMovieDirectors(movie, peopleColl);
    const actors = await getMovieActors(movie, peopleColl);
    const writers = await getMovieWriters(movie, peopleColl);

    movie.people.directors = directors;
    movie.people.actors = actors;
    movie.people.writers = writers;

    response.json(movie);
});

function getMovieDirectors(movie, peopleColl){
    const directorsId = movie.people.directors;
    return Promise.all(directorsId.map(function(directorId){
        if(directorId){
            const objdirId = new ObjectID(directorId);
            return peopleColl.findOne({_id: objdirId});
        }else{
            return null;
        }
    }));

}

function getMovieActors(movie, peopleColl){
    const actorsId = movie.people.actors;
    return Promise.all(actorsId.map(function(actorId){
        if(actorId){
            const objactId = new ObjectID(actorId);
            return peopleColl.findOne({_id: objactId});
        }else{
            return null;
        }
    }));
}

function getMovieWriters(movie, peopleColl){
    const writersId = movie.people.writers;
    return Promise.all(writersId.map(function(writerId){
        if(writerId){
            const objwriId = new ObjectID(writerId);
            return peopleColl.findOne({_id: objwriId});
        }else{
            return null;
        }
    }));
}

app.get('/people', async function(request, response){
    await client.connect();
    const db = client.db('dbMovies');
    const peopleColl = db.collection('people');

    const peopleCursor = await peopleColl.find({});

    const people = [];

    await peopleCursor.forEach(function(person){
        people.push(person);
    });

    response.json(people);
});


app.get('/people/:id', async function(request, response){
    const peopleId = request.params.id;
    const objectId = new ObjectID(peopleId);

    await client.connect();
    const db = client.db('dbMovies');
    const peopleColl = db.collection('people');

    const people = await peopleColl.findOne({_id: objectId});

    response.json(people);
});

app.post('/reviews', async function(request, response) {
    const query = {_id: new ObjectID(request.body.movieId)};
    const review = {
        username: request.body.username,
        comment: request.body.comment,
        rating: request.body.rating,
        date: new Date()
    }
    const newValue = {$push: {reviews: review}};
    await client.connect();
    const db = client.db('dbMovies');
    const movieColl = db.collection('movies');

    movieColl.updateOne(query, newValue);
});

app.post('/movies', async function(request, response) {
    const genresArray = request.body.genres.split(',').map(genre => genre.trim());
    const languageArray = request.body.languages.split(',').map(language => language.trim());

    const addMovie = {
        _id: new ObjectID(),
        title: request.body.title,
        year: request.body.year,
        runtime: request.body.runtime,
        genres: genresArray,
        synopsis: request.body.synopsis,
        language: languageArray,
        picture: request.body.picture,
        people: {
            directors: request.body.directors,
            writers: request.body.writers,
            actors: request.body.actors
        }
    }

    await client.connect();
    const db = client.db('dbMovies');
    const movieColl = db.collection('movies');
    const peopleColl = db.collection('people');

    movieColl.insertOne(addMovie);

    const people = [...request.body.directors, ...request.body.writers, ...request.body.actors];
    const uniquePeople = [...new Set(people)];
    
    const movieId = addMovie._id;
    const newValues = { $push: { movies: movieId } };

    uniquePeople.forEach(function(person) {
        const query = { _id: new ObjectID(person) };
        peopleColl.updateOne(query, newValues);
    });
});

app.post('/movies/update', async function(request, response) {
    const query = {_id: new ObjectID(request.body.movieId)};

    const genresArray = request.body.newGenres.split(',').map(genre => genre.trim());
    const languageArray = request.body.newLanguages.split(',').map(language => language.trim());
    
    const movieUpdate = {
        title: request.body.newTitle,
        year: request.body.newYear,
        runtime: request.body.newRuntime,
        genres: genresArray,
        synopsis: request.body.newSynopsis,
        language: languageArray
    }

    const newValues = {$set: movieUpdate};
    await client.connect();
    const db = client.db('dbMovies');
    const movieColl = db.collection('movies');

    movieColl.updateOne(query, newValues);
    response.json({message: 'success'});
});

app.delete('/movies', async function(request, response) {
    const query = {_id: new ObjectID(request.body.movieId)};
    
    await client.connect();
    const db = client.db('dbMovies');
    const movieColl = db.collection('movies');

    movieColl.deleteOne(query);
});

app.listen(8080, console.log("server"));

