import ModalName from "@/types/ModalName.type"

export interface PairedModal {
  modal: ModalName;
  slots: any[];
  show: boolean;
}

export default interface ModalsState {
  paired_modals: PairedModal[];
}
