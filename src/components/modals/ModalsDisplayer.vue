<template>
  <div class="modal-mask" @click="closeAll" v-if="modals.length">
    <CreateModelModal></CreateModelModal>
    <InspectModelModal></InspectModelModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CreateModelModal from './CreateModelModal.vue';
import InspectModelModal from './InspectModelModal.vue';
import { useModalsStore } from '@/stores/modals';
import { ComposeAlert } from '@/services/FireAlert.service';

const modalsStore = useModalsStore();
const modals = computed(() => modalsStore.activeModals);

const closeAll = async () => {
  if (modals.value.length > 1) {
    const pass = await ComposeAlert(
      'Are you sure you want to close all modals?',
      'warning', true
    );
    if (pass.isDismissed) return;
  }

  modalsStore.closeModals();
}
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000, $alpha: 0.3);

  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
}
</style>
