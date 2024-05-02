<template>
  <SidenavItem name="Links" icon="fa-solid fa-link" :active="active"
    @clicked="setActiveTool">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useTool } from '@/composbles/Tool';

const {
  active,
  setActiveTool
} = useTool('links-finder');
</script>

<style scoped lang="scss">

</style>
