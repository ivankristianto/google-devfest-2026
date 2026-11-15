<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  shape?: 'content' | 'cover' | 'section' | 'plain'
  fill?: string
}>(), { shape: 'content', fill: 'var(--df-white)' })

// Outlines traced from the template backgrounds on a 1280x720 canvas, clockwise.
const shapes: Record<string, [number, number][]> = {
  content: [[51, 54], [1229, 54], [1229, 561], [906, 561], [906, 666], [51, 666]],
  cover: [[448, 54], [1229, 54], [1229, 561], [906, 561], [906, 666], [51, 666], [51, 207], [448, 207]],
  section: [[51, 54], [1229, 54], [1229, 561], [906, 561], [906, 666], [387, 666], [387, 207], [51, 207]],
  plain: [[51, 54], [1229, 54], [1229, 666], [51, 666]],
}

const R = 36

function roundedPath(pts: [number, number][], r: number) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[(i - 1 + n) % n]
    const [cx, cy] = pts[i]
    const [nx, ny] = pts[(i + 1) % n]
    const inLen = Math.hypot(cx - px, cy - py)
    const outLen = Math.hypot(nx - cx, ny - cy)
    const ix = (cx - px) / inLen
    const iy = (cy - py) / inLen
    const ox = (nx - cx) / outLen
    const oy = (ny - cy) / outLen
    const a = [cx - ix * r, cy - iy * r]
    const b = [cx + ox * r, cy + oy * r]
    // In SVG's y-down space a positive cross product is a clockwise turn.
    const sweep = ix * oy - iy * ox > 0 ? 1 : 0
    d += `${i === 0 ? 'M' : 'L'}${a[0]},${a[1]} A${r},${r} 0 0 ${sweep} ${b[0]},${b[1]} `
  }
  return `${d}Z`
}

const d = computed(() => roundedPath(shapes[props.shape], R))
</script>

<template>
  <svg class="df-frame" viewBox="0 0 1280 720" aria-hidden="true">
    <path :d="d" :fill="fill" stroke="var(--df-ink)" stroke-width="3" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.df-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
