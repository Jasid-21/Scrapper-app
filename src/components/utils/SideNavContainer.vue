<template>
  <div class="sidenav-container">
    <ModelsSidenav :active="nav == 'models'" @close-navs="setActiveNav()">
    </ModelsSidenav>
    <!--
    <SideNavLayout :active="nav == 'tools'" @close-navs="setActiveNav()">
      <template #header>
        <span class="title">Tools</span>
      </template>

      <template #content></template>
    </SideNavLayout>
    -->

    <div class="buttons-container" v-if="!nav">
      <button class="models-btn" @click="setActiveNav('models')">
        <fai icon="fa-solid fa-sitemap"></fai>
      </button>
      <!--
      <br>
      <button class="tools-btn" @click="setActiveNav('tools')">
        <fai icon="fa-solid fa-toolbox"></fai>
      </button>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SideNavLayout from './SideNavLayout.vue';
import SidenavItem from '../SidenavItem.vue';
import { useModelsStore } from '@/stores/models';
import { useModalsStore } from '@/stores/modals';
import CreateModel from '../tools/CreateModel.vue';
import ModelsSidenav from './ModelsSidenav.vue';

const modelsStore = useModelsStore();
const modalsStore = useModalsStore();
const models = computed(() => modelsStore.models);
type NavName = 'models' | 'tools';
const nav = ref<NavName | undefined>(undefined);

const setActiveNav = (v?: NavName) => nav.value = v;
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
