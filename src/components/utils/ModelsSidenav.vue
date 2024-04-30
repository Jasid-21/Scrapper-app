<template>
  <SideNavLayout @close-navs="emit('close-navs')" :active="active">
    <template #header>
      <span class="title">Models</span>
    </template>
    <template #content>
      <CreateModel></CreateModel>
      <SidenavItem v-for="i of models" :icon="'fa-solid fa-sitemap'"
        :name="i.name" @clicked="openModelModal(i.name)">
      </SidenavItem>
    </template>
  </SideNavLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SideNavLayout from './SideNavLayout.vue';
import SidenavItem from '../SidenavItem.vue';
import { useModelsStore } from '@/stores/models';
import { useModalsStore } from '@/stores/modals';
import CreateModel from '../tools/CreateModel.vue';

const emit = defineEmits<{ (e: 'close-navs'): void }>();
const props = defineProps<{
  active: boolean;
}>();

const modelsStore = useModelsStore();
const modalsStore = useModalsStore();
const models = computed(() => modelsStore.models);

const openModelModal = (name: string) => {
  const model = models.value.find(m => m.name == name);
  if (!model) return;
  modalsStore.addPairedModal('inspect-model', [model]);
}
</script>

<style scoped lang="scss">
@import '@/sass/mixins';

.buttons-container {
  position: fixed;
  top: 60px; left: 10px;

  button {
    @include button-style($primary);
    width: 30px;
    padding: 0.2rem;
  }
}
</style>
