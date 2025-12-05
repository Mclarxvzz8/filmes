// ===========================
// CONFIG
// ===========================
const API_KEY = "e849d695"; // coloque sua OMDb key aqui
const API_URL = "https://www.omdbapi.com/?apikey=" + API_KEY;


// ===========================
// LOGIN SIMPLES (LocalStorage)
// ===========================

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function doLogin() {
    const name = document.getElementById("loginName").value.trim();
    if (!name) return alert("Digite seu nome!");

    localStorage.setItem("userName", name);

    updateUser();
    closeLogin();
}

function updateUser() {
    const area = document.getElementById("userNameDisplay");
    const stored = localStorage.getItem("userName");

    if (stored) {
        area.innerHTML = `👋 Olá, <b>${stored}</b>`;
    } else {
        area.innerHTML = "";
    }
}

updateUser();


// ===========================
// BUSCA OMDb
// ===========================

async function searchMovies() {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    const res = await fetch(`${API_URL}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.Search) {
        document.getElementById("results").innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }

    renderMovies(data.Search);
    renderCarousel(data.Search);
}


// ===========================
// RENDERIZA GRID
// ===========================

function renderMovies(movies) {
    const container = document.getElementById("results");
    container.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="openMovie('${movie.imdbID}')">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>
    `).join("");
}


// ===========================
// CARROSSEL 3D
// ===========================

let angle = 0;
let carouselData = [];

function renderCarousel(movies) {
    carouselData = movies;

    const carousel = document.getElementById("carousel");
    if (!carousel) return;

    carousel.innerHTML = "";

    const total = movies.length;
    const step = 360 / total;

    movies.forEach((movie, i) => {
        const item = document.createElement("div");
        item.className = "carousel-item";
        item.style.transform = `rotateY(${i * step}deg) translateZ(300px)`;

        item.innerHTML = `
            <img src="${movie.Poster}" onclick="openMovie('${movie.imdbID}')">
        `;

        carousel.appendChild(item);
    });
}

// Gira o carrossel automaticamente
setInterval(() => {
    const carousel = document.getElementById("carousel");
    if (!carousel) return;

    angle += 1;
    carousel.style.transform = `rotateY(${angle}deg)`;
}, 50);


// ===========================
// MODAL FILME
// ===========================

async function openMovie(id) {
    const res = await fetch(`${API_URL}&i=${id}&plot=full`);
    const movie = await res.json();

    const modal = document.getElementById("movieModal");
    const body = document.getElementById("modalBody");

    body.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster}" style="float:left; width:180px; margin-right:15px;">
        <p><b>Gênero:</b> ${movie.Genre}</p>
        <p><b>Nota:</b> ${movie.imdbRating}</p>
        <p><b>Diretor:</b> ${movie.Director}</p>
        <p><b>Descrição:</b> ${movie.Plot}</p>
        <br><br>
        <button onclick="closeModal()">Fechar</button>
    `;

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("movieModal").style.display = "none";
}
