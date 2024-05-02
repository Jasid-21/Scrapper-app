import { defineStore } from "pinia";
import ToolsState from "./interfaces/ToolsState.interface";
import ToolName from "@/types/ToolName.type";
import { useWebsiteStore } from "./website";

export const useToolsStore = defineStore('tools', {
  state: (): ToolsState => ({
    active_tool: undefined,
  }),

  actions: {
    setActiveTool(tool: ToolName | undefined) {
      if (tool && typeof tool != 'string') return;
      this.active_tool = tool;
    },

    removeElement() {
      useWebsiteStore().removeElementFromIframe();
    }
  }
});
