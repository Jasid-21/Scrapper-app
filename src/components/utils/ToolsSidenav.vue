<template>
  <SideNavLayout :active="active" @close-navs="emit('closeNavs')">
    <template #header>
        <span class="title">Tools</span>
      </template>

      <template #content>
        <RemoveElement></RemoveElement>
        <LinksFinder></LinksFinder>
        <ImagesFinder></ImagesFinder>
      </template>
  </SideNavLayout>
</template>

<script setup lang="ts">
import RemoveElement from '../tools/RemoveElement.vue';
import LinksFinder from '../tools/LinksFinder.vue';
import ImagesFinder from '../tools/ImagesFinder.vue';
import SideNavLayout from './SideNavLayout.vue';

const emit = defineEmits<{ (e: 'closeNavs'): void }>();
const props = defineProps<{
  active: boolean,
}>();
</script>

<style scoped lang="scss">

</style>
