<template>
  <SidenavItem :icon="'fa-solid fa-circle-minus'" name="Remover" :active="active"
    @clicked="setActiveTool">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useTool } from '@/composbles/Tool';

const {
  active,
  setActiveTool
} = useTool('element-remover');
</script>

<style scoped lang="scss">
</style>
