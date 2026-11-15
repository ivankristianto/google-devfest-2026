<template>
  <div class="df-slide df-presenter">
    <div class="df-presenter-card">
      <div class="df-presenter-body"><slot /></div>
    </div>
    <GdgLogo class="df-presenter-logo" variant="horizontal" />
  </div>
</template>

<style scoped>
/* The right half stays empty for the speaker camera; nothing crosses x = 640. */
.df-presenter-card {
  position: absolute;
  left: 51px;
  top: 54px;
  width: 563px;
  height: 546px;
  box-sizing: border-box;
  border: 3px solid var(--df-ink);
  border-radius: 36px;
  background: var(--df-white);
}
.df-presenter-body {
  position: absolute;
  inset: 40px 40px 36px 43px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  font-size: var(--df-size-small);
  line-height: 1.3;
}
.df-presenter-body :deep(h1) { font-size: var(--df-size-title); }
.df-presenter-logo { position: absolute; left: 41px; top: 622px; width: 340px !important; }
</style>
