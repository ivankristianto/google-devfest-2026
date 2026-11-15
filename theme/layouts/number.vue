<script setup lang="ts">
defineProps<{ above?: string, value?: string, below?: string }>()
</script>

<template>
  <div class="df-slide df-number">
    <div class="df-pill top">{{ above }}</div>
    <Scallops :x="96" :top="248" :bottom="472" :count="4" :depth="26" side="left" />
    <Scallops :x="620" :top="248" :bottom="472" :count="4" :depth="26" side="right" />
    <div class="df-number-value"><slot>{{ value }}</slot></div>
    <div class="df-pill bottom">{{ below }}</div>
    <svg class="df-number-art" viewBox="0 0 1280 720" aria-hidden="true">
      <circle cx="788" cy="123" r="78" fill="var(--df-pastel-yellow)" stroke="var(--df-ink)" stroke-width="2.5" />
      <polygon points="694,674 942,45 1078,45 830,674" fill="var(--df-pastel-blue)" stroke="var(--df-ink)" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="860,674 1108,45 1244,45 996,674" fill="var(--df-pastel-green)" stroke="var(--df-ink)" stroke-width="2.5" stroke-linejoin="round" />
      <circle cx="1162" cy="597" r="78" fill="var(--df-pastel-red)" stroke="var(--df-ink)" stroke-width="2.5" />
    </svg>
  </div>
</template>

<style scoped>
.df-pill {
  position: absolute;
  left: 43px;
  width: 630px;
  height: 97px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--df-ink);
  border-radius: 999px;
  background: var(--df-white);
  font-size: var(--df-size-body);
  padding: 0 32px;
  text-align: center;
  line-height: 1.1;
}
.df-pill.top { top: 45px; }
.df-pill.bottom { top: 577px; }
.df-number-value {
  position: absolute;
  left: 120px;
  width: 476px;
  top: 248px;
  height: 224px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 196px;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.df-number-art { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
