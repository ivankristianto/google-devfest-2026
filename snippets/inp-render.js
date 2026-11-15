let html = '';
let deadline = performance.now() + 50;
for (const line of matches) {
  html += lineCard(line);
  if (performance.now() >= deadline) {
    await yieldToMain();
    if (token !== renderToken) return;
    deadline = performance.now() + 50;
  }
}
results.innerHTML = html;
