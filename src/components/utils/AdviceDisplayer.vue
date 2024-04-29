<template>
  <Transition>
    <div class="advice-displayer" v-if="message">
      <div class="message">
        {{ message }}
      </div>
      <div class="buttons-container">
        <button class="close-btn" @click="closeAdvice">
          Close
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAdvicesStore } from '@/stores/advices';
import { computed } from 'vue';

const advices = useAdvicesStore();
const message = computed(() => advices.message);

const closeAdvice = () => {
  advices.closeAdvice();
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';
@import '@/sass/mixins';

.advice-displayer {
  position: fixed;
  top: 10px; left: 50%;
  translate: -50% 0;

  width: 450px;
  padding: 0.5rem;

  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px #000;
  z-index: 10;

  .message {
    max-height: 200px;
    text-align: center;
    overflow-y: auto;

    &::-webkit-scrollbar {
      border-radius: 10px;
      width: 9px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: $accent;
    }
  }

  .buttons-container {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    column-gap: 0.3rem;

    button {
      @include button-style(#ff4747);
      padding: 0.2rem 0.4rem;
    }
  }
}

.v-enter-from,
.v-leave-to {
  top: -150px;
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 180ms ease;
}
</style>
