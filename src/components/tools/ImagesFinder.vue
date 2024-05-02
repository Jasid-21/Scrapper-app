<template>
  <SidenavItem name="Images" icon="fa-solid fa-image" :active="active"
    @clicked="setActiveTool">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useTool } from '@/composbles/Tool';

const {
  active,
  setActiveTool
} = useTool('images-finder');
</script>

<style scoped lang="scss">

</style>
