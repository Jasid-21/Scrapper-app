<template>
  <SidenavItem name="New" icon="fa-solid fa-plus" @clicked="openModal">
  </SidenavItem>
</template>

<script setup lang="ts">
import SidenavItem from '../SidenavItem.vue';
import { useModalsStore } from '@/stores/modals';

const modalsStore = useModalsStore();

const openModal = () => {
  modalsStore.addPairedModal('create-model', [true]);
}
</script>

<style scoped lang="scss">

</style>
