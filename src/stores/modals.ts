import { defineStore } from "pinia";
import ModalsState, { PairedModal } from "./interfaces/modalsState.interface";
import ModalName from "@/types/ModalName.type";

export const useModalsStore = defineStore('modals', {
  state: (): ModalsState => ({
    paired_modals: [],
  }),

  getters: {
    activeModals(): PairedModal[] {
      return this.paired_modals.filter(m => !m.slots.some(s => s === undefined) && m.show);
    },
  },

  actions: {
    closeModals(modals: ModalName[] = []) {
      if (!modals.length) {
        this.paired_modals = [];
        return;
      }

      modals.forEach(m => this.paired_modals = this.paired_modals.filter(pm => pm.modal != m));
    },

    addPairedModal(modal: ModalName, slots: any[] = []) {
      this.paired_modals = this.paired_modals.filter(m => m.modal != modal);
      const new_modal: PairedModal = {
        modal: modal,
        slots, show: true,
      }

      this.paired_modals.push(new_modal);
      console.log(this.paired_modals);
    }
  }
});
