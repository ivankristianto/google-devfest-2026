const DATA_URL = '/shared/transcript.json';

// Artificial delay for the workshop. It stands in for a slow notices service,
// so the effect shows up clearly in a local trace.
const ANNOUNCEMENT_DELAY_MS = 2500;

const input = document.getElementById('search');
const status = document.getElementById('search-status');
const results = document.getElementById('results');

let lines = [];
let renderToken = 0;

const BATCH_SIZE = 100;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function timecode(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = String(Math.floor(seconds / 60) % 60).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function lineCard(line) {
  return `<li class="line" data-id="${escapeHtml(line.id)}" data-shelf="${escapeHtml(line.shelf)}">
    <a class="line-time" href="https://www.youtube.com/watch?v=${escapeHtml(line.video)}&amp;t=${escapeHtml(line.start)}s">${timecode(line.start)}</a>
    <p class="line-text">${escapeHtml(line.text)}</p>
    <p class="line-episode">${escapeHtml(line.episode)}</p>
  </li>`;
}

function yieldToMain() {
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function filterLines(query) {
  return lines.filter((line) =>
    line.text.toLowerCase().includes(query) ||
    line.episode.toLowerCase().includes(query));
}

function describeIdle() {
  return `Ketik kata atau judul episode untuk mencari di ${lines.length.toLocaleString('id')} baris transkrip.`;
}

function describeCount(count, query) {
  if (count === 0) return `Tidak ada baris yang cocok dengan “${query}”. Coba kata lain atau judul episode.`;
  return `${count.toLocaleString('id')} baris cocok dengan “${query}”.`;
}

async function renderResults(rawQuery) {
  const token = ++renderToken;
  const query = rawQuery.trim().toLowerCase();
  // Swapping to the results view right at the keystroke keeps late rows from pushing the home page around.
  document.body.classList.toggle('is-searching', query !== '');
  if (!query) {
    results.replaceChildren();
    status.textContent = describeIdle();
    return;
  }

  const matches = filterLines(query);
  status.textContent = describeCount(matches.length, rawQuery.trim());

  // One bounded batch per frame. Without the frame wait, yield continuations
  // ran ahead of rendering and dozens of batches piled into one layout.
  results.replaceChildren();
  for (let start = 0; start < matches.length; start += BATCH_SIZE) {
    const html = matches.slice(start, start + BATCH_SIZE).map(lineCard).join('');
    results.insertAdjacentHTML('beforeend', html);
    await nextFrame();
    await yieldToMain();
    if (token !== renderToken) return;
  }
}

function showAnnouncement() {
  const notice = document.createElement('aside');
  notice.className = 'announcement';
  notice.setAttribute('aria-label', 'Pengumuman');
  notice.innerHTML = `
    <img src="/shared/images/cover.jpg" width="96" height="96" alt="">
    <div>
      <p class="announcement-title">Episode baru setiap Selasa malam</p>
      <p class="announcement-when">Siaran langsung jam 20:00 WIB di YouTube</p>
      <p>Ikut ngobrol di kolom chat, atau kirim pertanyaan dan usul topik dengan tagar #ngobrolinweb.</p>
      <a href="#tentang">Tentang acara ini</a>
    </div>`;
  document.getElementById('announcement-slot').append(notice);
}

async function loadTranscript() {
  // The status keeps its text while loading: a shorter line would resize the header on narrow screens.
  input.disabled = true;
  const response = await fetch(DATA_URL);
  lines = await response.json();
  input.disabled = false;
  status.textContent = describeIdle();
  if (input.value) renderResults(input.value);
}

input.addEventListener('input', () => renderResults(input.value));
document.addEventListener('click', (event) => {
  const shortcut = event.target.closest('[data-query]');
  if (!shortcut || input.disabled) return;
  input.value = shortcut.dataset.query;
  input.focus();
  renderResults(input.value);
});
input.form.addEventListener('submit', (event) => event.preventDefault());

loadTranscript();
requestAnimationFrame(() => setTimeout(showAnnouncement, ANNOUNCEMENT_DELAY_MS));
