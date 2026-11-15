<script setup lang="ts">
withDefaults(defineProps<{
  value: string
  what: string
  source?: string
  compact?: boolean
}>(), { source: 'Lab, headless Chromium, 4x slower CPU, middle of 5 runs' })
</script>

<template>
  <div v-if="compact" class="df-lab compact">
    <span class="df-lab-value">{{ value }}</span>
    <div>
      <div class="df-lab-source">{{ source }}</div>
      <div class="df-lab-what">{{ what }}</div>
    </div>
  </div>
  <div v-else class="df-lab">
    <div class="df-lab-source">{{ source }}</div>
    <div class="df-lab-row">
      <span class="df-lab-value">{{ value }}</span>
      <span class="df-lab-what">{{ what }}</span>
    </div>
  </div>
</template>

<style scoped>
.df-lab {
  flex: none;
  box-sizing: border-box;
  border: var(--df-stroke) solid var(--df-ink);
  border-radius: 16px;
  background: var(--df-pastel-yellow);
  padding: 12px 22px 14px;
}
.df-lab-source {
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: 20px;
  line-height: 1.3;
}
.df-lab-row { display: flex; align-items: baseline; gap: 18px; margin-top: 2px; }
.df-lab-value { font-weight: 700; font-size: 56px; line-height: 1.05; white-space: nowrap; }
.df-lab-what { font-size: var(--df-size-small); line-height: 1.2; }
.df-lab.compact { display: flex; align-items: center; gap: 20px; padding: 10px 22px; }
.df-lab.compact .df-lab-value { font-size: 48px; }
</style>
