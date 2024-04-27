import { defineStore } from "pinia";
import ModelsState from "./interfaces/modelsState.interface";
import Model, { RawProperty } from "@/classes/getters/Model.class";
import BaseGetter from "@/classes/getters/BaseGetter.class";
import TextGetter from "@/classes/getters/TextGetter.class";
import LinkGetter from "@/classes/getters/LinkGetter.class";
import ImgGetter from "@/classes/getters/ImgGetter.class";
import { ComposeAlert } from "@/services/FireAlert.service";

export const useModelsStore = defineStore('models', {
  state: (): ModelsState => ({
    default_getters: [
      new TextGetter(),
      new LinkGetter(),
      new ImgGetter(),
    ],
    models: [
      new Model('Main'),
    ],
  }),

  getters: {
    getters(): string[] {
      return [
        ...this.default_getters.map(g => g.name),
        ...this.models.map(g => g.name),
      ];
    }
  },

  actions: {
    async createModel(name: string, properties: RawProperty[] = []): Promise<boolean> {
      const exist = this.models.findIndex(m => m.name == name);
      if (exist >= 0) {
        const pass = await ComposeAlert(
          `There is a moden of name "". Do you want to overwrite it?`,
          'warning', true,
        );
        if (pass.isDismissed) return false;
        this.models[exist] = new Model(name, properties);
        return true;
      }

      const model = new Model(name, properties);
      this.models.push(model);
      return true;
    },
  }
});
