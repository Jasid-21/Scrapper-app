<template>
  <div class="sidenav-container">
    <SideNavLayout @close-navs="setActiveNav()" :active="nav == 'models'">
      <template #header>
        <span class="title">Models</span>
      </template>
      <template #content>
        <SidenavItem v-for="i of models" :icon="'fa-solid fa-sitemap'" :name="'Item'">
        </SidenavItem>
      </template>
    </SideNavLayout>
    <SideNavLayout @close-navs="setActiveNav()" :active="nav == 'tools'">
      <template #header>
        <span class="title">Tools</span>
      </template>

      <template #content>
        <CreateModel></CreateModel>
      </template>
    </SideNavLayout>

    <div class="buttons-container" v-if="!nav">
      <button class="models-btn" @click="setActiveNav('models')">
        <fai icon="fa-solid fa-sitemap"></fai>
      </button>
      <br>
      <button class="tools-btn" @click="setActiveNav('tools')">
        <fai icon="fa-solid fa-toolbox"></fai>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SideNavLayout from './SideNavLayout.vue';
import SidenavItem from '../SidenavItem.vue';
import { useModelsStore } from '@/stores/models';
import CreateModel from '../tools/CreateModel.vue';

const modelsStore = useModelsStore()
const models = computed(() => modelsStore.models);
type NavName = 'models' | 'tools';
const nav = ref<NavName | undefined>(undefined);

const setActiveNav = (v?: NavName) => nav.value = v;
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
