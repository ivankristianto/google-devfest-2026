<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ variant?: 'stacked' | 'horizontal' }>(), { variant: 'stacked' })
const { $slidev } = useSlideContext()
const show = computed(() => $slidev.themeConfigs.brandMarks !== false)
const src = computed(() => `${import.meta.env.BASE_URL}brand/gdg-logo-${props.variant}.png`)
</script>

<template>
  <img v-if="show" class="df-gdg" :class="variant" :src="src" alt="Google Developer Groups">
  <span v-else class="df-gdg-text" :class="variant">Google Developer Groups</span>
</template>

<style scoped>
.df-gdg { display: block; height: auto; }
.df-gdg.stacked { width: 291px; }
.df-gdg.horizontal { width: 435px; }
.df-gdg-text {
  display: block;
  font-family: var(--df-font-sans);
  font-size: 22px;
  line-height: 1.15;
  color: var(--df-ink);
}
.df-gdg-text.stacked { width: 140px; margin-left: 150px; }
</style>
