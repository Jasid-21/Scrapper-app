<template>
  <div class="sidenav-item" @click="click">
    <span class="title">{{ name }}</span>
    <fai :icon="icon"></fai>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  icon: string;
  clickCb?: (ev: MouseEvent, ...params: any) => any;
}>();

const click = (ev: MouseEvent) => {
  if (props.clickCb) props.clickCb(ev);
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';

.sidenav-item {
  width: 50px;
  height: 50px;
  border: 2px solid $d_accent;
  border-radius: 8px;
  position: relative;
  color: $d_accent;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 1.2rem;

  transition-property: background-color color;
  transition-duration: 180ms;
  cursor: pointer;

  &:hover {
    background-color: $primary;
    color: #fff;
  }

  .title {
    font-weight: 700;
    font-size: 0.8rem;
    position: absolute;
    top: 0; left: 50%;
    translate: -50% 0;
    user-select: none;
  }
}
</style>
