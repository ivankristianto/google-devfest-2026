<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ number?: string, subhead?: string, color?: 'blue' | 'yellow' | 'red' }>()
// Halftone fills match the case chips elsewhere in the deck; no colour keeps the template's pastel yellow.
const fills: Record<string, string> = {
  blue: 'var(--df-halftone-blue)',
  yellow: 'var(--df-halftone-yellow)',
  red: 'var(--df-halftone-red)',
}
const arrowFill = computed(() => (props.color && fills[props.color]) || 'var(--df-pastel-yellow)')
</script>

<template>
  <div class="df-slide df-section">
    <Frame shape="section" />
    <div class="df-section-number">{{ number }}</div>
    <svg class="df-section-art" viewBox="0 0 1280 720" aria-hidden="true">
      <polygon
        points="194,264 334,394 278,452 236,413 236,553 152,553 152,413 111,452 55,394"
        :fill="arrowFill" stroke="var(--df-ink)" stroke-width="3" stroke-linejoin="round"
      />
      <path
        d="M55,666 A46,60 0 0 1 147,666 A46,60 0 0 1 239,666 A46,60 0 0 1 331,666"
        fill="none" stroke="var(--df-ink)" stroke-width="3"
      />
    </svg>
    <div class="df-section-text">
      <slot />
      <p v-if="subhead" class="df-subhead">{{ subhead }}</p>
    </div>
    <GdgLogo class="df-notch-logo" variant="stacked" />
  </div>
</template>

<style scoped>
.df-section-number {
  position: absolute;
  left: 84px;
  top: 64px;
  font-family: var(--df-font-mono);
  font-weight: 100;
  font-size: 108px;
  line-height: 1.15;
}
.df-section-art { position: absolute; inset: 0; width: 100%; height: 100%; }
.df-section-text {
  position: absolute;
  left: 457px;
  top: 100px;
  width: 729px;
  height: 445px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
}
.df-section-text :deep(h1) { font-size: var(--df-size-section); line-height: 1.08; }
.df-section-text .df-subhead { max-width: 560px; }
.df-notch-logo { position: absolute; left: 944px; top: 591px; }
</style>
