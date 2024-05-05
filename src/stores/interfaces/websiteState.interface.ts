import ToolName from "@/types/ToolName.type";

export default interface WebsiteState {
  content: string;
  base_url: string;
  focused_el: Element | null;
  clicked_el: Element | null;
  context: Document | null;
  loading: boolean;
}
