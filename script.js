// ===============================
// Movie Explorer - JavaScript
// ===============================

// 🔑 Replace with your OMDb API key
const API_KEY = "56630d3e";
const BASE_URL = "https://www.omdbapi.com/";

// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const moviesContainer = document.querySelector(".movies-container");
const errorMsg = document.getElementById("errorMsg");
const filterSelect = document.getElementById("filter");

let moviesData = []; // Store movies for sorting

// 🔍 Search Button Click
searchBtn.addEventListener("click", () => searchMovies());

// ⌨️ Enter Key Search
movieInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchMovies();
    }
});

// 🔽 Filter Change
filterSelect.addEventListener("change", applyFilter);

// ===============================
// Search Movies Function
// ===============================
function searchMovies(queryParam) {
    const query = queryParam || movieInput.value.trim();

    // Empty Input Handling
    if (query === "") {
        alert("Please enter a movie name");
        return;
    }

    errorMsg.style.display = "none";
    moviesContainer.innerHTML = "<p style='color: white; text-align: center; width: 100%; grid-column: 1/-1;'>Loading...</p>";

    fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "False") {
                moviesContainer.innerHTML = "";
                errorMsg.style.display = "block";
                return;
            }

            moviesData = data.Search;
            fetchMovieDetails(moviesData);
        })
        .catch(() => {
            moviesContainer.innerHTML = "";
            errorMsg.textContent = "Something went wrong!";
            errorMsg.style.display = "block";
        });
}

// Load default movies on start
document.addEventListener("DOMContentLoaded", () => {
    searchMovies("Interstellar");
});

// ===============================
// Fetch Movie Details
// ===============================
function fetchMovieDetails(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(details => {
                displayMovie(details);
            });
    });
}

// ===============================
// Display Movie Card
// ===============================
function displayMovie(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450'}" alt="${movie.Title}" class="movie-poster">

        <div class="movie-info">
            <h2 class="movie-title">${movie.Title}</h2>
            
            <div class="movie-meta">
                <span>${movie.Year}</span>
                <span class="rating-badge">⭐ ${movie.imdbRating}</span>
            </div>
            
            <p class="wrapper-plot">${movie.Plot}</p>
        </div>
    `;

    moviesContainer.appendChild(card);
}

// ===============================
// Apply Sorting Filter
// ===============================
function applyFilter() {
    const value = filterSelect.value;

    if (value === "year") {
        moviesData.sort((a, b) => b.Year - a.Year);
    }
    else if (value === "rating") {
        moviesData.sort((a, b) => {
            return parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0);
        });
    }

    fetchMovieDetails(moviesData);
}