<template>
  <div class="df-slide df-full">
    <Frame shape="content" />
    <div class="df-full-body"><slot /></div>
    <div class="df-full-sub"><slot name="sub" /></div>
    <GdgLogo class="df-notch-logo" variant="stacked" />
  </div>
</template>

<style scoped>
.df-full-body {
  position: absolute;
  left: 119px;
  top: 112px;
  width: 1042px;
  height: 420px;
  font-size: var(--df-size-body);
  line-height: 1.3;
}
.df-full-body :deep(p + p) { margin-top: 0.6em; }
.df-full-sub {
  position: absolute;
  left: 119px;
  top: 560px;
  width: 721px;
  height: 90px;
  display: flex;
  align-items: center;
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: var(--df-size-small);
  line-height: 1.3;
}
.df-notch-logo { position: absolute; left: 944px; top: 591px; }
</style>
