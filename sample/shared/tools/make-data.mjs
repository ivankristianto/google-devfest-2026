// Builds transcript.json and the local images from a checkout of https://github.com/ngobrolin/landing.
// Usage: node sample/shared/tools/make-data.mjs <path to landing checkout> [--images]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Pinned, newest first, so a new episode upstream does not change the dataset or the lab numbers.
const EPISODES = [
  '4PCOin52Y_w', 'kyzTP34JNao', 'POxXlgoLnQg', 'Nq3uKguMNCA', 'HeA7bGiTMMA', 'sr205BbmJnk', '6PTamSfxRM4',
  '-DdLCXFsrRY', '_VoS7mnsUdQ', '0RCXRNHhBfo', 'qei6_h3wwPY', '-TwyNC_SSFY', 'YBFDo2jSSJA', 'JJqLKn25DJI',
];
const SPONSOR_READ = /domainesia/i;

const [landing, flag] = process.argv.slice(2);
if (!landing) throw new Error('Pass the path to a checkout of ngobrolin/landing');
const shared = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const all = JSON.parse(readFileSync(resolve(landing, 'src/data/episodes.json'), 'utf8'));

const lines = [];
EPISODES.forEach((videoId, episodeIndex) => {
  const meta = all.find((e) => e.videoId === videoId);
  if (!meta) throw new Error(`Episode ${videoId} not found`);
  const episode = meta.title.replace(/ - Ngobrolin WEB$/, '');
  const { segments } = JSON.parse(readFileSync(resolve(landing, 'src/data/transcripts', `${videoId}.json`), 'utf8'));
  for (const s of segments) {
    if (SPONSOR_READ.test(s.text)) continue;
    lines.push({ id: lines.length + 1, video: videoId, shelf: episodeIndex % 8, episode, start: Math.floor(s.start), text: s.text });
  }
});
writeFileSync(resolve(shared, 'transcript.json'), JSON.stringify(lines));
console.log(`transcript.json: ${lines.length} lines from ${EPISODES.length} episodes`);

if (flag === '--images') {
  const images = resolve(shared, 'images');
  mkdirSync(images, { recursive: true });
  const save = async (url, name) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    writeFileSync(resolve(images, name), Buffer.from(await res.arrayBuffer()));
    console.log(`images/${name}`);
  };
  await save(`https://i.ytimg.com/vi/${EPISODES[0]}/maxresdefault.jpg`, 'hero-episode.jpg');
  for (const [i, id] of EPISODES.slice(1, 9).entries()) await save(`https://i.ytimg.com/vi/${id}/mqdefault.jpg`, `episode-${i + 1}.jpg`);
  // macOS only: sips scales the podcast cover and the host photos down.
  const scale = (from, name, size) => {
    execFileSync('sips', ['-Z', String(size), '-s', 'formatOptions', '80', resolve(landing, from), '--out', resolve(images, name)], { stdio: 'ignore' });
    console.log(`images/${name}`);
  };
  scale('public/podcast-cover.jpg', 'cover.jpg', 192);
  for (const host of ['eka', 'ivan', 'riza']) scale(`public/images/${host}.jpg`, `host-${host}.jpg`, 160);
}
