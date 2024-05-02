import ToolName from "@/types/ToolName.type";
import { useToolsStore } from "@/stores/tools";

export function useTool(name: ToolName) {
  const tools = useToolsStore();

  const setActiveTool = () => {
    tools.setActiveTool(name);
  }

  return {
    setActiveTool,
  }
}
