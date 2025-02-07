(() => {
    const movieBox = document.querySelector('#movie-box');
    const reviewTemplate = document.querySelector('#review-template');
    const reviewCon = document.querySelector('#review-con');
    const baseUrl = 'https://swapi.dev/api/';

    function getCharacters() {
        fetch(`${baseUrl}people`)
            .then(response => response.json())
            .then(function(response) {
                console.log(response);
                const characters = response.results;

                const ul = document.createElement('ul');
                characters.forEach(character => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');

                    a.textContent = character.name;
                    a.href = "#";
                    a.dataset.films = JSON.stringify(character.films); // Store film URLs

                    li.appendChild(a);
                    ul.appendChild(li);
                });

                movieBox.appendChild(ul);
            })
            .then(function() {
                const links = document.querySelectorAll('#movie-box li a');
                links.forEach(link => {
                    link.addEventListener('click', getMoviesForCharacter);
                });
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function getMoviesForCharacter(e) {
        e.preventDefault();
        const filmURLs = JSON.parse(e.currentTarget.dataset.films);
    
        if (!filmURLs.length) {
            reviewCon.innerHTML = "<p>No movies available for this character.</p>";
            return;
        }
    
        reviewCon.innerHTML = '<p>Loading movie...</p>';
    
        // Pick a random movie from the character's film list
        const randomIndex = Math.floor(Math.random() * filmURLs.length);
        const randomFilmURL = filmURLs[randomIndex];
    
        fetch(randomFilmURL)
            .then(res => res.json())
            .then(movie => {
                reviewCon.innerHTML = ''; // Clear previous content
    
                const clone = reviewTemplate.content.cloneNode(true);
                const reviewHeading = clone.querySelector('.review-heading');
                const reviewDescription = clone.querySelector('.review-description');
                const moviePoster = document.createElement('img');
    
                reviewHeading.innerHTML = movie.title;
                reviewDescription.innerHTML = movie.opening_crawl;
    
                // Extract movie ID from URL to fetch the correct poster
                const filmId = movie.url.match(/\/(\d+)\/$/)[1];
                moviePoster.src = `/images/${filmId}.jpg`; // Ensure images are named correctly
                moviePoster.alt = movie.title;
                moviePoster.style.width = '200px';
                moviePoster.style.height = 'auto';
                moviePoster.style.display = 'block';
                moviePoster.style.marginBottom = '10px';
    
                reviewCon.appendChild(moviePoster);
                reviewCon.appendChild(clone);
            })
            .catch(err => {
                console.error("Error fetching movie:", err);
                reviewCon.innerHTML = "<p>Movie details not available.</p>";
            });
    }
    

    getCharacters();
})();
