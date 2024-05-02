<template>
  <div class="sidenav-item" :class="{ active }" @click="emit('clicked')">
    <span class="title">{{ name }}</span>
    <fai :icon="icon"></fai>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'clicked'): void }>();
const props = defineProps<{
  name: string;
  icon: string;
  active?: boolean;
}>();
</script>

<style scoped lang="scss">
@import '@/sass/variables';

.sidenav-item {
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 8px;
  position: relative;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 1.2rem;

  transition-property: background-color color;
  transition-duration: 180ms;
  cursor: pointer;

  &.active, &:hover {
    background-color: $d_accent;
    color: #fff;
  }

  .title {
    font-weight: 700;
    font-size: 0.7rem;
    position: absolute;
    top: 0; left: 50%;
    translate: -50% 0;
    user-select: none;
  }
}
</style>
