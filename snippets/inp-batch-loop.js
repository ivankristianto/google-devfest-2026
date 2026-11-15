for (let start = 0; start < matches.length;
    start += BATCH_SIZE) {
  const html = matches.slice(start, start + BATCH_SIZE)
      .map(lineCard).join('');
  results.insertAdjacentHTML('beforeend', html);
  await nextFrame();
  await yieldToMain();
  if (token !== renderToken) return;
}
