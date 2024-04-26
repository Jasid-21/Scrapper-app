<template>
  <SidenavItem name="Model" icon="fa-solid fa-sitemap" :click-cb="click">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useModalsStore } from '@/stores/modals';

const modalsStore = useModalsStore();

const click = (ev: MouseEvent) => {
  modalsStore.addPairedModal('create-model', [true]);
}
</script>

<style scoped lang="scss">

</style>
