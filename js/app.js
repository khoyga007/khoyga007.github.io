// ✍ Written by Claire

// ── CLOCK ──
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hh}:${mm}:${ss}`;

  const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const d = `${days[now.getDay()]}, ${now.getDate()}/${months[now.getMonth()]}/${now.getFullYear()}`;
  document.getElementById('date-display').textContent = d;
}
setInterval(updateClock, 1000);
updateClock();

// ── SEARCH ──
const searchEngines = {
  google: 'https://www.google.com/search?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  github: 'https://github.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
};

function doSearch() {
  const q = document.getElementById('searchInput').value.trim();
  const engine = document.getElementById('searchEngine').value;
  if (!q) return;
  window.open(searchEngines[engine] + encodeURIComponent(q), '_blank');
  document.getElementById('searchInput').value = '';
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

// ── WEATHER ──
async function loadWeather() {
  const body = document.getElementById('weatherBody');
  try {
    // Get location
    const locRes = await fetch('https://ipapi.co/json/');
    const loc = await locRes.json();
    const { latitude: lat, longitude: lon, city, country_name } = loc;

    // Get weather from Open-Meteo (no API key needed)
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`
    );
    const w = await wRes.json();
    const c = w.current;

    const icon = weatherIcon(c.weather_code);
    const desc = weatherDesc(c.weather_code);

    body.innerHTML = `
      <div class="weather-main">
        <span class="weather-icon">${icon}</span>
        <div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="weather-desc">${desc}</div>
        <div class="weather-location">📍 ${city}, ${country_name}</div>
      </div>
      <div class="neon-divider"></div>
      <div class="weather-details">
        <div class="weather-detail">
          <div class="weather-detail-label">💧 Độ ẩm</div>
          <div class="weather-detail-value">${c.relative_humidity_2m}%</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">💨 Gió</div>
          <div class="weather-detail-value">${Math.round(c.wind_speed_10m)} km/h</div>
        </div>
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<div style="color:var(--text-dim);text-align:center;padding:20px;font-size:13px;">Không thể tải thời tiết</div>`;
  }
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function weatherDesc(code) {
  if (code === 0) return 'Trời quang';
  if (code <= 2) return 'Ít mây';
  if (code <= 3) return 'Nhiều mây';
  if (code <= 48) return 'Sương mù';
  if (code <= 57) return 'Mưa phùn';
  if (code <= 67) return 'Có mưa';
  if (code <= 77) return 'Tuyết rơi';
  if (code <= 82) return 'Mưa rào';
  if (code <= 86) return 'Mưa tuyết';
  if (code <= 99) return 'Giông bão';
  return 'Không rõ';
}

loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);

// ── LINKS ──
const DEFAULT_LINKS = [
  { name: 'GitHub', url: 'https://github.com/khoyga007', emoji: '🐙' },
  { name: 'YouTube', url: 'https://youtube.com', emoji: '▶️' },
  { name: 'Google', url: 'https://google.com', emoji: '🔍' },
  { name: 'Reddit', url: 'https://reddit.com', emoji: '🤖' },
  { name: 'Steam', url: 'https://store.steampowered.com', emoji: '🎮' },
  { name: 'Gmail', url: 'https://mail.google.com', emoji: '📧' },
  { name: 'Discord', url: 'https://discord.com/app', emoji: '💬' },
  { name: 'Twitter/X', url: 'https://x.com', emoji: '🐦' },
  { name: 'Spotify', url: 'https://open.spotify.com', emoji: '🎵' },
];

function getLinks() {
  return JSON.parse(localStorage.getItem('yang_links') || JSON.stringify(DEFAULT_LINKS));
}

function saveLinks(links) {
  localStorage.setItem('yang_links', JSON.stringify(links));
}

function renderLinks() {
  const links = getLinks();
  const container = document.getElementById('linksGrid');
  container.innerHTML = '';

  links.forEach((link, i) => {
    const div = document.createElement('div');
    div.className = 'link-item';
    div.onclick = (e) => {
      if (e.target.classList.contains('link-delete')) return;
      window.open(link.url, '_blank');
    };

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`;
    div.innerHTML = `
      <img class="link-favicon" src="${faviconUrl}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
           alt="">
      <div class="link-favicon-fallback" style="display:none">${link.emoji || '🔗'}</div>
      <span class="link-name">${link.name}</span>
      <button class="link-delete" onclick="deleteLink(${i})">✕</button>
    `;
    container.appendChild(div);
  });

  // Add tile
  const addTile = document.createElement('div');
  addTile.className = 'add-link-tile';
  addTile.onclick = showAddLinkModal;
  addTile.innerHTML = `<span>+</span><span>Thêm link</span>`;
  container.appendChild(addTile);
}

function deleteLink(i) {
  const links = getLinks();
  links.splice(i, 1);
  saveLinks(links);
  renderLinks();
}

function showAddLinkModal() {
  document.getElementById('modal-link-name').value = '';
  document.getElementById('modal-link-url').value = '';
  document.getElementById('modal-link-emoji').value = '';
  showModal('linkModal');
}

function confirmAddLink() {
  const name = document.getElementById('modal-link-name').value.trim();
  let url = document.getElementById('modal-link-url').value.trim();
  const emoji = document.getElementById('modal-link-emoji').value.trim() || '🔗';
  if (!name || !url) return;
  if (!url.startsWith('http')) url = 'https://' + url;
  const links = getLinks();
  links.push({ name, url, emoji });
  saveLinks(links);
  renderLinks();
  hideModal('linkModal');
}

renderLinks();

// ── TODO ──
function getTodos() {
  return JSON.parse(localStorage.getItem('yang_todos') || '[]');
}

function saveTodos(todos) {
  localStorage.setItem('yang_todos', JSON.stringify(todos));
}

function renderTodos() {
  const todos = getTodos();
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach((todo, i) => {
    const div = document.createElement('div');
    div.className = 'todo-item' + (todo.done ? ' done' : '');
    const id = `todo-${i}`;
    div.innerHTML = `
      <input type="checkbox" id="${id}" ${todo.done ? 'checked' : ''} onchange="toggleTodo(${i})">
      <label for="${id}">${escHtml(todo.text)}</label>
      <button class="todo-del" onclick="deleteTodo(${i})">✕</button>
    `;
    list.appendChild(div);
  });
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;
  const todos = getTodos();
  todos.unshift({ text, done: false });
  saveTodos(todos);
  renderTodos();
  input.value = '';
}

function toggleTodo(i) {
  const todos = getTodos();
  todos[i].done = !todos[i].done;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(i) {
  const todos = getTodos();
  todos.splice(i, 1);
  saveTodos(todos);
  renderTodos();
}

document.getElementById('todoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

renderTodos();

// ── NOTES ──
const notesEl = document.getElementById('notes');
const noteStatus = document.getElementById('noteStatus');
notesEl.value = localStorage.getItem('yang_notes') || '';
let noteTimeout;

notesEl.addEventListener('input', () => {
  clearTimeout(noteTimeout);
  noteStatus.textContent = 'Đang lưu...';
  noteTimeout = setTimeout(() => {
    localStorage.setItem('yang_notes', notesEl.value);
    noteStatus.textContent = 'Đã lưu ✓';
    setTimeout(() => noteStatus.textContent = '', 2000);
  }, 800);
});

// ── YOUTUBE ──
let ytPlayer = null;
let playlist = JSON.parse(localStorage.getItem('yang_playlist') || '[]');
let currentIdx = -1;

function savePlaylist() {
  localStorage.setItem('yang_playlist', JSON.stringify(playlist));
}

function extractYTId(input) {
  input = input.trim();
  // Full URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
}

async function loadYT() {
  const input = document.getElementById('ytInput').value.trim();
  if (!input) return;
  const id = extractYTId(input);
  if (!id) { alert('URL YouTube không hợp lệ!'); return; }

  // Fetch title via oEmbed
  let title = id;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    const data = await res.json();
    title = data.title;
  } catch {}

  // Add to playlist if not exists
  if (!playlist.find(p => p.id === id)) {
    playlist.push({ id, title, thumb: `https://img.youtube.com/vi/${id}/mqdefault.jpg` });
    savePlaylist();
    renderPlaylist();
  }

  playVideo(playlist.findIndex(p => p.id === id));
  document.getElementById('ytInput').value = '';
}

function playVideo(idx) {
  if (idx < 0 || idx >= playlist.length) return;
  currentIdx = idx;
  const video = playlist[idx];
  const container = document.getElementById('yt-frame-container');
  container.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0"
            allow="autoplay; encrypted-media" allowfullscreen></iframe>
  `;
  renderPlaylist();
}

function renderPlaylist() {
  const list = document.getElementById('playlistItems');
  if (playlist.length === 0) {
    list.innerHTML = `<div class="playlist-empty">Chưa có video nào.<br>Dán link YouTube vào ô trên!</div>`;
    return;
  }
  list.innerHTML = playlist.map((v, i) => `
    <div class="playlist-item ${i === currentIdx ? 'active' : ''}" onclick="playVideo(${i})">
      <img class="playlist-thumb" src="${v.thumb}" alt="">
      <span class="playlist-title">${escHtml(v.title)}</span>
      <button class="playlist-del" onclick="removeFromPlaylist(event,${i})">✕</button>
    </div>
  `).join('');
}

function removeFromPlaylist(e, i) {
  e.stopPropagation();
  playlist.splice(i, 1);
  if (currentIdx === i) {
    currentIdx = -1;
    document.getElementById('yt-frame-container').innerHTML = '';
  } else if (currentIdx > i) {
    currentIdx--;
  }
  savePlaylist();
  renderPlaylist();
}

function clearPlaylist() {
  if (!confirm('Xóa toàn bộ playlist?')) return;
  playlist = [];
  currentIdx = -1;
  document.getElementById('yt-frame-container').innerHTML = '';
  savePlaylist();
  renderPlaylist();
}

document.getElementById('ytInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') loadYT();
});

renderPlaylist();

// ── MODAL ──
function showModal(id) {
  document.getElementById(id).classList.add('show');
}

function hideModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('show');
  });
});

// ── UTIL ──
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
