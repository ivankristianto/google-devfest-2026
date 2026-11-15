<script setup lang="ts">
import { useEntrance } from '../composables/entrance'
defineProps<{
  location?: string
  name?: string
  role?: string
  date?: string
  titleSize?: 'short' | 'long'
}>()
const entering = useEntrance()
</script>

<template>
  <div class="df-slide df-cover" :class="{ 'df-enter': entering }">
    <Frame shape="cover" />
    <DevFestLockup class="df-cover-lockup" :location="location" />
    <div class="df-cover-title" :class="titleSize || 'long'">
      <slot />
    </div>
    <div class="df-cover-byline">
      <div v-for="line in [name, role, date].filter(Boolean)" :key="line" :class="{ 'df-ph-inline': line.startsWith('PLACEHOLDER') }">{{ line }}</div>
    </div>
    <GdgLogo class="df-notch-logo" variant="stacked" />
  </div>
</template>

<style scoped>
.df-cover-lockup { position: absolute; left: 53px; top: 53px; }
.df-cover-title {
  position: absolute;
  left: 111px;
  width: 1042px;
  bottom: 236px;
}
.df-cover-title :deep(h1) { font-size: var(--df-size-cover); line-height: 1.08; }
.df-cover-title.short :deep(h1) { font-size: 107px; }
.df-cover-byline {
  position: absolute;
  left: 114px;
  top: 516px;
  width: 760px;
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: var(--df-size-small);
  line-height: 1.3;
}
.df-notch-logo { position: absolute; left: 944px; top: 591px; }
</style>
