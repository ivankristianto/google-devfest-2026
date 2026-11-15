<script setup lang="ts">
import { useEntrance } from '../composables/entrance'
defineProps<{ dense?: boolean }>()
const entering = useEntrance()
</script>

<template>
  <div class="df-slide df-default" :class="[{ 'df-dense': dense }, { 'df-enter': entering }]">
    <Frame shape="content" />
    <div class="df-default-body">
      <slot />
    </div>
    <div class="df-default-foot"><slot name="foot" /></div>
    <GdgLogo class="df-notch-logo" variant="stacked" />
  </div>
</template>

<style scoped>
.df-default-body {
  position: absolute;
  left: 119px;
  top: 100px;
  width: 1042px;
  height: 445px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}
.df-default-body :deep(h1) { font-size: var(--df-size-title); }
.df-default-foot {
  position: absolute;
  left: 119px;
  top: 568px;
  width: 750px;
  height: 80px;
  display: flex;
  align-items: center;
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: var(--df-size-small);
  line-height: 1.3;
}
.df-notch-logo { position: absolute; left: 944px; top: 591px; }
</style>
