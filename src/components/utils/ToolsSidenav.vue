<template>
  <SideNavLayout :active="active" @close-navs="emit('closeNavs')">
    <template #header>
        <span class="title">Tools</span>
      </template>

      <template #content>
        <RemoveElement></RemoveElement>
      </template>
  </SideNavLayout>
</template>

<script setup lang="ts">
import RemoveElement from '../tools/RemoveElement.vue';
import SideNavLayout from './SideNavLayout.vue';

const emit = defineEmits<{ (e: 'closeNavs'): void }>();
const props = defineProps<{
  active: boolean,
}>();
</script>

<style scoped lang="scss">

</style>
