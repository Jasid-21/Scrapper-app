<template>
  <Transition>
    <div class="sidenav" @mouseleave="emit('closeNavs')" v-if="active">
      <div class="header">
        <slot name="header"></slot>
      </div>

      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ active: boolean }>();
const emit = defineEmits<{ (e: 'closeNavs'): void }>();
</script>

<style scoped lang="scss">
@import '@/sass/variables';

$nav-width: 150px;
.sidenav {
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  width: $nav-width;
  background-color: rgba($color: $primary, $alpha: 0.5);
  box-shadow: 2px 0 4px $d_accent;
  padding: 0.4rem;

  .header {
    text-align: center;
    color: $d_accent;
    font-weight: 700;
    border-bottom: 1px solid $accent;
  }

  .content {
    margin-top: 0.4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 0.3rem;
  }
}

.v-enter-from,
.v-leave-to {
  left: -$nav-width;
}

.v-enter-active,
.v-leave-active {
  transition: left 180ms ease;
}
</style>
