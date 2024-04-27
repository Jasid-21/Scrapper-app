import { computed, ref, watch } from 'vue';
import { useModelsStore } from '@/stores/models';
import { ComposeAlert } from '@/services/FireAlert.service';
import GetterName from '@/types/GetterName.type';
import Model from '@/classes/getters/Model.class';

export function useModelModal(model?: Model) {
  const modelsStore = useModelsStore();
  const getters = computed(() => modelsStore.getters);

  const default_getter = '__none__';
  const model_name = ref<string>('');
  const element = ref<string>('');
  const elements = ref<{ name: string, getter: string }[]>(model?.raw_properties || []);
  const chosen_getter = ref<string>(default_getter);

  watch(getters, v => chosen_getter.value = v[0] || default_getter);
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

    const pass = await modelsStore.createModel(name, elements.value.map(e => ({
      name: e.name,
      value: undefined,
      selector: undefined,
      getter: e.getter as GetterName,
    })));
    
    if (!pass) return;
    ComposeAlert('Model created successfully', 'success');
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
    element, elements,
    getters, default_getter,
    chosen_getter, model_name,
    saveModel, addElement,
    removeElement,
  }
}
