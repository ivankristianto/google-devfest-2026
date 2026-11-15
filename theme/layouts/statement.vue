<script setup lang="ts">
import { useEntrance } from '../composables/entrance'
import { computed } from 'vue'

const props = defineProps<{ color?: 'offwhite' | 'blue' | 'green' | 'yellow' | 'red', location?: string }>()
const dots: Record<string, string> = {
  offwhite: 'var(--df-pastel-green)',
  blue: 'var(--df-blue)',
  green: 'var(--df-green)',
  yellow: 'var(--df-yellow)',
  red: 'var(--df-red)',
}
const dot = computed(() => dots[props.color || 'offwhite'])
const entering = useEntrance()
</script>

<template>
  <div class="df-slide df-statement" :class="[color && color !== 'offwhite' ? `bg-${color}` : '', { 'df-enter': entering }]">
    <Scallops :x="123" :top="64" :bottom="655" side="left" />
    <Scallops :x="758" :top="64" :bottom="655" side="right" />
    <div class="df-statement-text"><slot /></div>
    <DevFestLockup class="df-statement-lockup" :location="location" />
    <svg class="df-statement-art" viewBox="0 0 1280 720" aria-hidden="true">
      <polygon points="902,517 993,220 1062,220 970,517" fill="var(--df-pastel-blue)" stroke="var(--df-ink)" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="1034,517 1126,220 1196,220 1103,517" fill="var(--df-pastel-blue)" stroke="var(--df-ink)" stroke-width="2.5" stroke-linejoin="round" />
      <circle cx="934" cy="621" r="42" :fill="dot" stroke="var(--df-ink)" stroke-width="2.5" />
      <circle cx="1048" cy="621" r="42" :fill="dot" stroke="var(--df-ink)" stroke-width="2.5" />
      <circle cx="1162" cy="621" r="42" :fill="dot" stroke="var(--df-ink)" stroke-width="2.5" />
    </svg>
  </div>
</template>

<style scoped>
.df-statement-text {
  position: absolute;
  left: 170px;
  top: 64px;
  width: 560px;
  height: 591px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  font-size: var(--df-size-body);
  line-height: 1.25;
}
.df-statement-lockup { position: absolute; left: 870px; top: 53px; }
.df-statement-art { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
