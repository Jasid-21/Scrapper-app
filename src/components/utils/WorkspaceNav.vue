<template>
  <nav class="workspace-nav">
    <span>Url:</span>
    <form @submit.prevent="fetchPage">
      <input type="text" placeholder="Navigate to" v-model="url">
      <button type="submit">Go!</button>
    </form>
  </nav>
</template>

<script setup lang="ts">
import { useWebsiteStore } from '@/stores/website';
import { ref } from 'vue';

const website = useWebsiteStore();
const url = ref<string>('');

const fetchPage = () => {
  website.fetchPage(url.value);
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';
@import '@/sass/mixins';

.workspace-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 50px;
  background-color: rgba($color: $primary, $alpha: 0.5);
  padding: 0.5rem;

  color: $text;
  font-size: 0.9rem;
  font-weight: 700;

  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.3rem;

  form {
    display: flex;
    column-gap: 0.3rem;
  }

  input {
    @include input-style($d_accent, rgba($color: $primary, $alpha: 0.3));
    border-radius: 4px;
    width: 230px;
    padding: 0.2rem;
  }

  button {
    @include button-style();
  }
}
</style>
