<script setup lang="ts">
defineProps<{
  label: string
  note?: string
  kind?: 'image' | 'snippet' | 'value' | 'step'
}>()
</script>

<template>
  <div class="df-placeholder" :class="kind || 'image'" role="note">
    <div v-if="kind === 'value'" class="df-ph-label" :title="label">PLACEHOLDER</div>
    <div v-else class="df-ph-label">PLACEHOLDER: {{ label }}</div>
    <div v-if="note" class="df-ph-note">{{ note }}</div>
    <slot />
  </div>
</template>

<style scoped>
.df-placeholder {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 64px;
  padding: 16px 22px;
  border: 3px dashed var(--df-red);
  border-radius: 16px;
  background-color: color-mix(in srgb, var(--df-pastel-red) 55%, white);
  color: var(--df-ink);
}
.df-ph-label {
  font-family: var(--df-font-mono);
  font-weight: 400;
  font-size: 22px;
  line-height: 1.3;
}
.df-ph-note {
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: 18px;
  line-height: 1.35;
}
.df-placeholder.value {
  display: inline-flex;
  width: auto;
  height: auto;
  min-height: 0;
  padding: 2px 10px;
  border-width: 2px;
  border-radius: 8px;
  vertical-align: middle;
}
.df-placeholder.value .df-ph-label { font-size: 16px; white-space: nowrap; }
.df-placeholder.step { height: auto; flex: none; }
</style>
