<template>
  <button class="all-document-btn" @click="setContext"
    v-if="training && !hasContext">
    <span>All</span>
  </button>
</template>

<script setup lang="ts">
import { useWebsiteStore } from '@/stores/website';
import { useModelsStore } from '@/stores/models';
import { computed } from 'vue';

const website = useWebsiteStore();
const modelsStore = useModelsStore();
const context = computed(() => website.context);
const training = computed(() => modelsStore.trainingModel);
const hasContext = computed(() => training.value?.train_context);

const setContext = () => {
  if (!training.value || hasContext.value) return;
  if (!context.value) return;

  modelsStore.setTrainingContext(context.value.body);
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';

.all-document-btn {
  padding: 0.3rem;
  border-radius: 50%;
  background-color: rgba($color: $secondary, $alpha: 0.5);
  border: 2px solid $primary;
  font-size: 0.8rem;
  font-weight: 700;
  transition-property: background-color color;
  transition-duration: 180ms;

  z-index: 100;
  position: absolute;
  top: 60px;
  right: 10px;

  &:hover {
    background-color: $secondary;
    color: #fff;
  }
}
</style>
