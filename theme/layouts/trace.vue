<script setup lang="ts">
import { useEntrance } from '../composables/entrance'
withDefaults(defineProps<{ split?: string, codeSize?: string }>(), { split: '4fr 7fr' })
const entering = useEntrance()
</script>

<template>
  <div class="df-slide df-trace" :class="{ 'df-enter': entering }" :style="codeSize ? { '--slidev-code-font-size': codeSize } : {}">
    <Frame shape="content" />
    <div class="df-trace-head"><slot name="title" /></div>
    <div class="df-trace-grid" :style="{ gridTemplateColumns: split }">
      <div class="df-trace-left"><slot /></div>
      <div class="df-trace-right"><slot name="right" /></div>
    </div>
    <div class="df-trace-foot"><slot name="foot" /></div>
    <GdgLogo class="df-notch-logo" variant="stacked" />
  </div>
</template>

<style scoped>
.df-trace-head {
  position: absolute;
  left: 91px;
  top: 82px;
  width: 1098px;
}
.df-trace-head :deep(h1) { font-size: var(--df-size-title); }
.df-trace-grid {
  position: absolute;
  left: 91px;
  top: 160px;
  width: 1098px;
  height: 384px;
  display: grid;
  gap: 36px;
}
.df-trace-left {
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: var(--df-size-small);
  line-height: 1.3;
  min-width: 0;
}
.df-trace-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}
.df-trace-foot {
  position: absolute;
  left: 91px;
  top: 566px;
  width: 790px;
  height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  font-family: var(--df-font-mono);
  font-weight: 300;
  font-size: 24px;
  line-height: 1.3;
}
.df-notch-logo { position: absolute; left: 944px; top: 591px; }
</style>
