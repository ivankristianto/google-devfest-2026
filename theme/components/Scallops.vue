<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  x: number
  top: number
  bottom: number
  count?: number
  depth?: number
  side?: 'left' | 'right'
}>(), { count: 5, depth: 63, side: 'left' })

const d = computed(() => {
  const h = (props.bottom - props.top) / props.count
  const dir = props.side === 'left' ? 0 : 1
  let p = `M${props.x},${props.top}`
  for (let i = 0; i < props.count; i++)
    p += ` A${props.depth},${h / 2} 0 0 ${dir} ${props.x},${props.top + h * (i + 1)}`
  return p
})
</script>

<template>
  <svg class="df-scallops" viewBox="0 0 1280 720" aria-hidden="true">
    <path :d="d" fill="none" stroke="var(--df-ink)" stroke-width="3" />
  </svg>
</template>

<style scoped>
.df-scallops { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
