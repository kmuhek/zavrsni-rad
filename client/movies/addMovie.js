const titleInput = document.getElementById('titleInput');
const yearInput = document.getElementById('yearInput');
const runtimeInput = document.getElementById('runtimeInput');
const genresInput = document.getElementById('genresInput');
const synopsisInput = document.getElementById('synopsisInput');
const languagesInput = document.getElementById('languagesInput');
const pictureInput = document.getElementById('pictureInput');

const directorsList = document.getElementById('directorsList');
const actorsList = document.getElementById('actorsList');
const writersList = document.getElementById('writersList');

async function load() {
    const url = 'http://localhost:8080/people';

    const response = await fetch(url);
    const data = await response.json();

    loadList(directorsList, data, 'director');
    loadList(actorsList, data, 'actor');
    loadList(writersList, data, 'writer');
}

function loadList(list, people, filter) {
    people.filter(person => person.type.includes(filter))
    .forEach(filteredPerson => {
        const block = document.createElement('div');
        block.classList.add('personCheckbox');

        const checkbox = document.createElement('input');
        checkbox.classList.add('checkbox');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('value', filteredPerson._id);
        checkbox.setAttribute('id', filteredPerson._id + filter);

        const label = document.createElement('label');
        label.textContent = filteredPerson.name + ' ' + filteredPerson.surname;
        label.setAttribute('for', filteredPerson._id + filter);

        block.appendChild(checkbox);
        block.appendChild(label);

        list.appendChild(block);
    });
}


addForm.addEventListener('submit', function(e){
    e.preventDefault();

    const title = titleInput.value;
    const year = yearInput.value;
    const runtime = runtimeInput.value;
    const genres = genresInput.value;
    const synopsis = synopsisInput.value;
    const languages = languagesInput.value;
    const picture = pictureInput.value;

    const directors = getSelectedPeople(directorsList);
    const actors = getSelectedPeople(actorsList);
    const writers = getSelectedPeople(writersList);

    const movieAdd = {
        title,
        year,
        runtime,
        genres,
        synopsis,
        languages,
        picture,
        directors,
        actors,
        writers
    };

    const addData = JSON.stringify(movieAdd);

    const xhr = new XMLHttpRequest(); 
    const url = 'http://localhost:8080/movies/';

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json'); 

    xhr.send(addData);

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500 + Math.random() * 1000);
});

function getSelectedPeople(list) {
    const allPeople = list.querySelectorAll('.checkbox');
    const array = [];
    for(let i = 0; i < allPeople.length; i++) {
        if(allPeople[i].checked) {
            array.push(allPeople[i].value);
        }
    }
    return array;
}

load();