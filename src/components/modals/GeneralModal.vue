<template>
  <div class="modal" v-if="active" @click.stop>
    <button class="close-btn" @click="closeModal">
      <fai icon="fa-solid fa-close"></fai>
    </button>
    <div class="header">
      <slot name="header"></slot>
    </div>

    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalsStore } from '@/stores/modals';
import ModalName from '@/types/ModalName.type';
import { computed, watch } from 'vue';

const emit = defineEmits<{ (e: 'loaded'): void }>();
const props = defineProps<{ modal: ModalName }>();

const modalsStore = useModalsStore();
const modal = computed(() => modalsStore.paired_modals.find(m => m.modal == props.modal));
const full = computed(() => !modal.value?.slots.some(s => s === undefined));
const active = computed(() => {
  const v = modal.value && full.value;
  if (v) emit('loaded');
  return v;
});

const closeModal = () => {
  modalsStore.closeModals([props.modal]);
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';
@import '@/sass/mixins';

.modal {
  width: 300px;
  height: 400px;

  background-color: #fff;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid $primary;
  position: relative;

  .close-btn {
    @include button-style(#b00);
    width: 20px; height: 20px;
    border-radius: 50%;
    padding: 0;
    position: absolute;
    top: 5px; right: 5px;

    padding: 0.2rem;
  }

  .header {
    text-align: center;
    margin-bottom: 0.4rem;
    border-bottom: 2px solid $primary;
  }
}
</style>
