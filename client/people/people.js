const peopleCards = document.getElementById('people-card');
const peopleDetails = document.getElementById('people-details');

async function getPeopleDetails(){
    const peopleId = localStorage.getItem('peopleId');

    const response = await fetch('http://localhost:8080/people/' + peopleId);
    const people = await response.json();

    const peopleCard = createPeopleCard(people);
    peopleCards.appendChild(peopleCard);

    const peopleDetail = createPeopleDetail(people);
    peopleDetails.appendChild(peopleDetail);
}

function createPeopleCard(people){
    const card = document.createElement('div');

    const image = document.createElement('img');
    const fullname = document.createElement('h2');
    const birthdate = document.createElement('h4');

    card.classList.add('cardPeople');

    image.classList.add('cardPicture');
    image.src = people.image;
    
    name = people.name;
    
    surname = people.surname;

    fullname.classList.add('cardTitle');
    fullname.textContent = `${name} ${surname}`;

    birthdate.classList.add('cardTitle');
    birthdate.textContent = people.birthDate;
    
    card.appendChild(image);
    card.appendChild(fullname);
    card.appendChild(birthdate);
    
    return card;
}

function createPeopleDetail(people){
    const cardDetail = document.createElement('div');
    const biography = document.createElement('p');
    const type = document.createElement('h5');
    const movies = document.createElement('h5');

    cardDetail.classList.add('detailsPeople');
    
    biography.classList.add('cardTitle');
    biography.textContent = people.biography;
    
    type.classList.add('cardTitle');
    type.textContent = `Type: ${people.type}`;
    
    movies.classList.add('cardTitle');
    movies.textContent = `Movies: ${people.movies}`;

    cardDetail.appendChild(biography);
    cardDetail.appendChild(type);
    cardDetail.appendChild(movies);

    return cardDetail;
}

getPeopleDetails();