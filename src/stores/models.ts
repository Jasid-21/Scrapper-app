import { defineStore } from "pinia";
import ModelsState from "./interfaces/modelsState.interface";
import Model, { RawProperty } from "@/classes/getters/Model.class";
import BaseGetter from "@/classes/getters/BaseGetter.class";
import TextGetter from "@/classes/getters/TextGetter.class";
import LinkGetter from "@/classes/getters/LinkGetter.class";
import ImgGetter from "@/classes/getters/ImgGetter.class";
import { ComposeAlert } from "@/services/FireAlert.service";
import { useAdvicesStore } from "./advices";
import SelectElements, { GetMainContext } from "@/services/SelectElements.service";
import { useModalsStore } from "./modals";

export const useModelsStore = defineStore('models', {
  state: (): ModelsState => ({
    default_getters: [
      new TextGetter(),
      new LinkGetter(),
      new ImgGetter(),
    ],

    models: [
      new Model('Main', []),
    ],

    training: undefined,
    training_queue: [],
  }),

  getters: {
    trainingModel(): Model | undefined {
      return this.training;
    },

    trainingProperty(): string | undefined {
      if (!this.training) return;
      const model = this.trainingModel;
      return model?.nextProperty;
    },

    getters(): string[] {
      return [
        ...this.default_getters.map(g => g.name),
        ...this.models.map(g => g.name),
      ];
    }
  },

  actions: {
    checkTraining(name: string): number {
      const model = this.models.find(m => m.name == name);
      if (!model) return 1;

      const models_names = this.models.map(m => m.name);
      const model_children = model.raw_properties.filter(r => models_names.includes(r.getter));

      const untrained = model_children.map(m => this.checkTraining(m.getter));
      let count = untrained.reduce((c, n) => c + n , 0);
      console.log(count);
      
      const isTrained = !model.raw_properties.some(p => !p.selector);
      if (!isTrained) count++;

      return count;
    },

    async resetTraining(model: Model | string) {
      if (typeof model == 'string') {
        const m = this.models.find(m => m.name == model) as Model | undefined;
        if (!m) return;
        model = m;
      }

      const pass = await ComposeAlert('Are you sure you want to reset training?', 'warning', true);
      if (pass.isDismissed) return;
      
      model.resetTraining();
    },

    async trainProperty(el: Element) {
      if (!this.training) return;
      const model = this.trainingModel;
      if (!model) return;

      const property = model.nextProperty;
      const done = await model.trainProperty(property, el);
      console.log(model);
      if (!done) return;

      const next = model.nextProperty;
      if (!next) {
        ComposeAlert('Model trained', 'success');
        useAdvicesStore().closeAdvice();
        this.trainingModel?.setTrainingContext();
        this.training = undefined;
        return;
      }
      const msg = `Click element to train "${next}" property`;
      useAdvicesStore().setMessage(msg);
    },

    async setTrainingContext(element: Element) {
      await this.trainingModel?.setTrainingContext(element);
      const next = this.trainingModel?.nextProperty;
      if (!next) return;
      
      const msg = `Click element to train "${next}" property`;
      useAdvicesStore().setMessage(msg);
    },

    startTraining(model: Model | string) {
      if (typeof model === 'string') {
        const m = this.models.find(m => m.name == model);
        if (!m) return;
        model = m;
      }

      const next = model.nextProperty;
      if (!next) return;
      this.training = model;
      const msg = `Click element to define context`;
      useAdvicesStore().setMessage(msg);
    },

    async deleteModels(names: string[]) {
      const pass = await ComposeAlert('Are you sure you want to delete model?', 'warning', true);
      if (pass.isDismissed) return;

      console.log(this.models);
      const mains = names.filter(n => this.models.find(m => m.name == n)?.isDefault);
      console.log(mains);
      if (mains.length) {
        ComposeAlert(`Main models can't be deleted`, 'error');
        return;
      }
      
      this.models = this.models.filter(m => !names.includes(m.name));
      useModalsStore().closeModals();
    },

    async createModel(name: string, properties: RawProperty[] = []): Promise<Model | undefined> {
      const exist = this.models.findIndex(m => m.name == name);
      if (exist >= 0) {
        const pass = await ComposeAlert(
          `There is a model of name "${name}". Do you want to overwrite it?`,
          'warning', true,
        );
        if (pass.isDismissed) return;
        this.models[exist] = new Model(name, properties, false);
        return this.models[exist];
      }

      const model = new Model(name, properties, false);
      this.models.push(model);
      return model;
    },
  }
});
