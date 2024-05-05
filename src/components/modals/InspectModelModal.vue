<template>
  <GeneralModal :modal="'inspect-model'" @loaded="loadModel">
    <template #header>
      <span class="title">{{ modal?.slots[0]?.name }}</span>
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
                <option :value="default_getter">Choose a getter</option>
                <option v-for="s of getters.filter(g => g != model?.name)" :value="s">
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
            <tr class="element" v-for="e of model?.raw_properties">
              <td class="element-name">{{ e.name }}</td>
              <td class="element-selector">{{ e.getter }}</td>
              <td class="options">
                <button class="remove-btn" @click="removeElement(e.name)">
                  <fai icon="fa-solid fa-trash-can"></fai>
                </button>

                <button class="remove-btn" @click="trainProperty(e.name)">
                  <fai icon="fa-solid fa-person-running"></fai>
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div class="save-schema-container">
          <form class="save-form" @submit.prevent="saveModel">
            <div class="input">
              <div class="title"><span>Copy as</span></div>
              <input type="text" placeholder="schema name" v-model="model_name">
            </div>

            <div class="btns-continer">
              <button class="save-btn" type="submit">
                <fai icon="fa-solid fa-copy"></fai>
              </button>
            </div>
          </form>
        </div>

        <div class="buttons-container">
          <button class="start-training-btn" @click="startTraining">
            Train
          </button>
          <button class="run-model-btn" @click="runModel" v-if="model?.isDefault">
            Run
          </button>
          <button class="reset-btn" @click="resetTraining">Reset</button>
          <button class="delete-model-b" @click="deleteModel">Delete</button>
        </div>
      </div>
    </template>
  </GeneralModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import GeneralModal from './GeneralModal.vue';
import { useModalsStore } from '@/stores/modals';
import { useModelsStore } from '@/stores/models';
import { useModelModal } from '@/composbles/ModelModal';
import { useWebsiteStore } from '@/stores/website';
import { PairedModal } from '@/stores/interfaces/modalsState.interface';
import { ComposeAlert } from '@/services/FireAlert.service';
import { GetMainContext } from '@/services/SelectElements.service';
import GetterName from '@/types/GetterName.type';
import DownloadText from '@/services/DownloadText.service';

const modalsStore = useModalsStore();
const modal = ref<PairedModal | undefined>();
watch(modal, v => console.log("Inspect:", v));

const {
  element, model_name,
  getters, chosen_getter,
  default_getter, model,
  removeElement, saveModel,
} = useModelModal(true);
const loadModel = (paired: PairedModal) => {
  console.log({ ...paired });
  model.value = paired.slots[0];
  modal.value = paired;
}

watch(getters, v => chosen_getter.value = default_getter);
watch(chosen_getter, v => {
  console.log(v);
  if (v == default_getter) return;

  const name = element.value;
  if (!name.trim()) return;
  addElement();
});
const addElement = () => {
  model.value?.setRawProperty(element.value, chosen_getter.value as GetterName);
}

const modelsStore = useModelsStore();
const website = useWebsiteStore();
const web_content = computed(() => website.content);

const startTraining = () => {
  if (!web_content.value) {
    ComposeAlert('Request a website before start a training');
    return;
  }
  
  if (!model.value) return;
  if (!model.value.raw_properties.length) {
    ComposeAlert('Add some properties/elements before start a trining');
    return;
  }
  modelsStore.startTraining(model.value.name);
  modalsStore.closeModals();
}

const trainProperty = (name: string) => {
  if (!model.value) return;
  model.value.removeTraining([name]);
  startTraining();
}

const runModel = async () => {
  if (!model.value) return;
  if (!model.value.trained) return;

  const untrained = modelsStore.checkTraining(model.value.name);
  if (untrained) {
    ComposeAlert("There are some untrained models yet.");
    return;
  }

  const ctx = GetMainContext()?.querySelector('body');
  if (!ctx) return;
  const response = model.value.run([ctx]);
  let text: string = '';
  try {
    text = JSON.stringify(response);
  } catch (err) {
    console.log(err);
    ComposeAlert('Error downloading info', 'error');
    return;
  }

  const download = await ComposeAlert(
    'Your info is ready. Do you want to download it?',
    'question', true
  );

  if (download.isDismissed) return;
  DownloadText(model.value.name + '.json', text);
}

const deleteModel = () => {
  if (!model.value) return;
  modelsStore.deleteModels([model.value.name]);
}

const resetTraining = () => {
  if (!model.value) return;
  modelsStore.resetTraining(model.value);
}
</script>

<style scoped lang="scss">
@import '@/sass/variables';
@import '@/sass/mixins';

.modal-content {
  padding: 0.5rem;
  display: grid;
  grid-template-rows: auto 200px 50px;
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
      grid-template-columns: 40% 40% 20%;
      align-items: baseline;

      td {
        text-align: center;
      }

      .options {
        display: flex;

        .remove-btn {
          @include button-style();
          border: none;
          padding: 0.2rem;
        }
      }
    }
  }

  .save-schema-container {
    padding: 0.6rem 0.8rem;
    border: 1px solid $primary;
    border-radius: 8px;
    display: flex;
    align-items: center;

    form {
      width: 100%;
      position: relative;
      display: grid;
      grid-template-columns: 200px auto;
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
        display: flex;
        justify-content: center;

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

  .buttons-container {
    display: flex;
    justify-content: center;
    column-gap: 0.3rem;

    button {
      @include button-style();
    }
  }
}
</style>
