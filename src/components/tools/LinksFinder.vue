<template>
  <SidenavItem name="Links" icon="fa-solid fa-link" @clicked="setActiveTool">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useTool } from '@/composbles/Tool';

const { setActiveTool } = useTool('links-finder');
</script>

<style scoped lang="scss">

</style>
