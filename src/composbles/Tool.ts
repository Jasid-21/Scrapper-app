import ToolName from "@/types/ToolName.type";
import { useToolsStore } from "@/stores/tools";
import { computed } from "vue";

export function useTool(name: ToolName) {
  const tools = useToolsStore();
  const active_tool = computed(() => tools.active_tool);
  const active = computed(() => active_tool.value === name);

  const setActiveTool = () => {
    if (active_tool.value == name) {
      tools.setActiveTool(undefined);
      return;
    }

    tools.setActiveTool(name);
  }

  return {
    active,
    setActiveTool,
  }
}
