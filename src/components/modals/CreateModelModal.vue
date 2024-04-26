<template>
  <GeneralModal :modal="'create-model'">
    <template #header>
      <span>Create Model</span>
    </template>

    <template #content>
      <div class="modal-content">
        <form class="element-form" @submit.prevent="addElement">
          <div class="title">
            <span>Name</span>
          </div>
          <div class="title">
            <span>Getter</span>
          </div>

          <input type="text" v-model="element" placeholder="Element name">
          <div class="selector">
            <div>
              <select v-model="chosen_getter">
                <option v-for="s of getters" :value="s">
                  {{ s }}
                </option>
              </select>
            </div>
          </div>
          <input type="submit" value="" v-show="false">
        </form>

        <div class="elements-container">
          <table class="elements">
            <tr>
              <th>Name</th>
              <th>Getter</th>
              <th></th>
            </tr>
            <tr class="element" v-for="e of elements">
              <td class="element-name">{{ e.name }}</td>
              <td class="element-selector">{{ e.getter }}</td>
              <td class="options">
                <button class="remove-btn" @click="removeElement(e.name)">
                  <fai icon="fa-solid fa-trash-can"></fai>
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div class="save-schema-container">
          <form class="save-form">
            <div class="input">
              <div class="title"><span>Save as</span></div>
              <input type="text" placeholder="schema name" v-model="model_name">
            </div>

            <div class="btns-continer">
              <button class="save-btn" @click.prevent="saveSchema">
                <fai icon="fa-solid fa-save"></fai>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </GeneralModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useModelsStore } from '@/stores/models';
import GeneralModal from './GeneralModal.vue';

const model_name = ref<string>('');
const element = ref<string>('');
const elements = ref<{ name: string, getter: string }[]>([]);
const modelsStore = useModelsStore();
const getters = computed(() => modelsStore.getters);
const chosen_getter = ref<string>('');
watch(getters, v => chosen_getter.value = v[0] || '');

const saveSchema = () => {

}

const addElement = (ev: Event) => {

}

const removeElement = (name: string) => {

}
</script>

<style scoped lang="scss">
@import '@/sass/variables';
@import '@/sass/mixins';

.modal-content {
  padding: 0.5rem;
  display: grid;
  grid-template-rows: auto 200px 40px;
  row-gap: 0.3rem;

  .element-form {
    border: 1px solid $primary;
    border-radius: 10px;
    padding: 0.5rem 0.7rem;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 0.7fr 1fr;
    column-gap: 0.3rem;

    .title {
      color: $accent;
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      column-gap: 0.2rem;
      align-items: baseline;

      input {
        margin: 0;
      }
    }

    .radios-container {
      text-wrap: nowrap;
      color: $text;
    }

    input[type="text"], select {
      width: 100%;
      height: 25px;
      border-radius: 4px;
      outline: none;
      border: 1px solid $primary;
      color: $accent;
    }
  }

  .elements-container {
    border: 1px solid $primary;
    border-radius: 8px;
    padding: 0.3rem;
  }

  table.elements {
    width: 100%;
    color: $accent;

    tr {
      border-bottom: 1px solid $primary;
      border-collapse: collapse;
      margin-bottom: 0.3rem;

      display: grid;
      grid-template-columns: 45% 45% 10%;
      align-items: baseline;

      td {
        text-align: center;
      }

      .remove-btn {
        @include button-style();
      }
    }
  }

  .save-schema-container {
    padding: 0.6rem 0.4rem;
    border: 1px solid $primary;
    border-radius: 8px;
    display: flex;
    align-items: center;

    form {
      width: 100%;
      position: relative;
      display: grid;
      grid-template-columns: 85% 15%;
      align-items: center;
      column-gap: 0.3rem;

      .title {
        position: absolute;
        top: -8px; left: 4px;
        background-color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        color: $accent;
      }

      input {
        width: 100%; height: 25px;
        border-radius: 4px;
        outline: none;
        border: 1px solid $primary;
        font-size: 0.75rem;
        color: $accent;
        padding: 0 0.2rem;
      }

      .btns-continer {
        height: 100%;
        width: 100%;
        justify-self: flex-end;

        button {
          @include button-style();
          width: 100%;
          height: 100%;
          padding: 0.2rem 0.3rem;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
