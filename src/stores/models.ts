import { defineStore } from "pinia";
import ModelsState from "./interfaces/modelsState.interface";
import Model, { RawProperty } from "@/classes/getters/Model.class";
import BaseGetter from "@/classes/getters/BaseGetter.class";

export const useModelsStore = defineStore('models', {
  state: (): ModelsState => ({
    default_getters: [],
    models: [],
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
    createModel(name: string, properties: RawProperty[] = []) {
      const model = new Model(name, properties);
      this.models.push(model);
    },
  }
});
