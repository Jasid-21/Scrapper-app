import { defineStore } from "pinia";
import AdvicesState from "./interfaces/AdvicesState.interface";

export const useAdvicesStore = defineStore('advices', {
  state: (): AdvicesState => ({
    message: '',
  }),

  actions: {
    closeAdvice() {
      this.message = '';
    },

    setMessage(msg: string) {
      if (typeof msg != 'string') return;
      this.message = msg;
    }
  }
});
