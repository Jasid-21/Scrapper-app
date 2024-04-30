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
  }),

  getters: {
    trainingModel(): Model | undefined {
      return this.models.find(m => m.name === this.training);
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
    async trainProerty(el: Element) {
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
        this.trainingModel?.setTrainingContext('');
        this.training = undefined;
        return;
      }
      const msg = `Click element to train "${next}" property`;
      useAdvicesStore().setMessage(msg);
    },

    async setTrainingContext(selector: string) {
      const pass = await this.trainingModel?.setTrainingContext(selector);
      if (!pass) return;
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
      this.training = model.name;
      const msg = `Click element to define context`;
      useAdvicesStore().setMessage(msg);
    },

    async deleteModels(names: string[]) {
      const pass = await ComposeAlert('Are you sure you want to delete model?', 'warning', true);
      if (pass.isDismissed) return;

      console.log(this.models);
      const mains = this.models.filter(m => m.isDefault);
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

      const model = new Model(name, properties);
      this.models.push(model);
      return model;
    },
  }
});
