export default interface WebsiteState {
  content: string;
  base_url: string;
  focused_el: Element | null;
  clicked_el: Element | null;
}
