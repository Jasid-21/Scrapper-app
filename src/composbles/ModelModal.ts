import { Ref, computed, ref, watch } from 'vue';
import { useModelsStore } from '@/stores/models';
import { useModalsStore } from '@/stores/modals';
import { ComposeAlert } from '@/services/FireAlert.service';
import GetterName from '@/types/GetterName.type';
import Model from '@/classes/getters/Model.class';

export function useModelModal(inspect: boolean) {
  const modelsStore = useModelsStore();
  const modalsStore = useModalsStore();
  const model = computed((): Model | undefined => {
    if (!inspect) return;
    const m = modalsStore.paired_modals.find(m => m.modal == 'inspect-model')?.slots[0];
    console.log(m);
    return m;
  });
  const getters = computed(() => modelsStore.getters);

  const default_getter = '__none__';
  const model_name = ref<string>('');
  const element = ref<string>('');
  const elements = ref<{ name: string, getter: string }[]>(model.value?.raw_properties || []);
  const chosen_getter = ref<string>(default_getter);

  watch(getters, v => chosen_getter.value = default_getter);
  watch(chosen_getter, v => {
    if (v == default_getter) return;

    const name = element.value;
    if (!name.trim()) return;
    addElement();
  });

  const saveModel = async () => {
    const name = model_name.value;
    if (!name.trim()) {
      ComposeAlert('Please provide a name for new model.', 'info');
      return;
    }

    const model = await modelsStore.createModel(name, elements.value.map(e => ({
      name: e.name,
      value: undefined,
      selector: undefined,
      getter: e.getter as GetterName,
      multiple: false,
    })));
    
    if (!model) return;
    modalsStore.addPairedModal('inspect-model', [model]);
  }

  const addElement = async () => {
    const name = element.value;
    const exist = elements.value.findIndex(e => e.name == name);
    if (exist >= 0) {
      const pass = await ComposeAlert(
        `There is an element with name "${name}". Do you want to replace it?`,
        'warning', true
      );

      if (pass.isDismissed) return;
      elements.value[exist].getter = chosen_getter.value;
      return;
    }

    const el = {
      name: element.value,
      getter: chosen_getter.value,
    }

    elements.value.push(el);
  }

  const removeElement = async (name: string) => {
    const pass = await ComposeAlert(
      `Are you sure you want to delete element "${name}"?`,
      'warning', true
    );
    if (pass.isDismissed) return;
    elements.value = elements.value.filter(e => e.name != name);
  }

  return {
    model, element, elements,
    getters, default_getter,
    chosen_getter, model_name,
    saveModel, addElement,
    removeElement,
  }
}
