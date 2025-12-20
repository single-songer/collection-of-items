

const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');
const error = document.getElementById('error');
const loadingEl = document.getElementById('loading');
// 防抖函数
function debounce(fun, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(this, args)
        }, delay)
    }
}
async function fetchMovies(query) {
    if (!query.trim()) {
        movieContainer.innerHTML = '';
        return;
    }
    try {
        showLoading()
        hideError()
        console.log(query);

        const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('API 请求失败，请检查网络或API Key');
        }
        const data = await response.json();
        console.log(data);

        if (data.results.length === 0) {
            showError('未找到相关电影');
            movieContainer.innerHTML = '';
            return;
        }
        renderMoives(data.results);
    } catch (error) {
        console.error(error);
        showError(error.message || '未知错误');
    } finally {
        hideLoading();
    }
}
function renderMoives(moives) {
    movieContainer.innerHTML = moives.map(movie => {
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
        const year = movie.release_date ? movie.release_date.split('-')[0] :
            '未知';
        const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A';
        return `
         <div class="movie-card">
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-info">
          <span>${year}年</span>
          <span>⭐ ${rating}</span>
        </div>
      </div>
        `
    }).join('');
}
function showLoading() { loadingEl.classList.remove('hidden') }
function hideLoading() { loadingEl.classList.add('hidden') }
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}
function hideError() { error.classList.add('hidden'); }

const debounceSearch = debounce((e) => {
    fetchMovies(e.target.value);
}, 500)
searchInput.addEventListener('input', debounceSearch);
window.addEventListener('load', () => {
    fetchMovies('勇者时刻');
})