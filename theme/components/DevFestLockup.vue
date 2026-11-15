<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

defineProps<{ location?: string }>()
const { $slidev } = useSlideContext()
const show = computed(() => $slidev.themeConfigs.brandMarks !== false)
const src = `${import.meta.env.BASE_URL}brand/devfest-lockup.png`
</script>

<template>
  <div class="df-lockup">
    <img v-if="show" :src="src" alt="DevFest">
    <div v-else class="df-lockup-text">DevFest</div>
    <div class="df-location" :class="{ ph: (location || '').startsWith('PLACEHOLDER') }">{{ location || 'Location' }}</div>
  </div>
</template>

<style scoped>
.df-lockup { position: relative; width: 354px; height: 120px; }
.df-lockup img { display: block; width: 354px; height: 120px; }
.df-lockup-text {
  font-weight: 700;
  font-size: 58px;
  line-height: 1;
  padding: 8px 0 0 60px;
}
/* Box centred on the pill in devfest-lockup.png, checked against a 2x export. */
.df-location {
  position: absolute;
  left: 44px;
  top: 80px;
  width: 272px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--df-font-sans);
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  text-box: trim-both cap alphabetic;
  white-space: nowrap;
  overflow: hidden;
}
.df-location.ph { color: var(--df-red); font-size: 14px; }
</style>
