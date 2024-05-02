<template>
  <SidenavItem :icon="'fa-solid fa-sitemap'" name="Remover"
    @clicked="setActiveTool">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useToolsStore } from '@/stores/tools';

const tools = useToolsStore();
const setActiveTool = () => {
  tools.setActiveTool('element-remover');
  console.log("Remover active");
}
</script>

<style scoped lang="scss">

</style>
